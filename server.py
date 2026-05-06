"""
Personality Analyzer - Pure Python Server
No Flask, no Django, no frameworks — just Python built-ins + Gemini API
Run: python server.py
Open: http://localhost:8080
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import mimetypes
import time
import random

# Port MUST be read before anything else for Render
PORT = int(os.environ.get("PORT", 8080))
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")

from google import genai

QUIZ_PROMPT = """You are an expert personality psychologist. Analyze these quiz responses and return a personality profile.

RESPONSES:
{answers}

Return ONLY valid JSON, no markdown, no code fences:
{{
  "mbti_type": "XXXX",
  "mbti_description": "One sentence description of this MBTI type",
  "personality_summary": "3-4 sentences summarizing the overall personality",
  "ocean_scores": {{
    "openness":          {{"score": 72, "level": "High",     "confidence": 92, "description": "2 clear sentences", "xai_reasoning": "Driven by response X"}},
    "conscientiousness": {{"score": 65, "level": "Moderate", "confidence": 85, "description": "2 clear sentences", "xai_reasoning": "Driven by response Y"}},
    "extraversion":      {{"score": 48, "level": "Moderate", "confidence": 78, "description": "2 clear sentences", "xai_reasoning": "Driven by response Z"}},
    "agreeableness":     {{"score": 78, "level": "High",     "confidence": 95, "description": "2 clear sentences", "xai_reasoning": "Driven by response W"}},
    "neuroticism":       {{"score": 32, "level": "Low",      "confidence": 88, "description": "2 clear sentences", "xai_reasoning": "Driven by response V"}}
  }},
  "key_strengths":    ["strength1","strength2","strength3","strength4","strength5"],
  "key_weaknesses":   ["weakness1","weakness2","weakness3","weakness4"],
  "best_career_paths":["career1","career2","career3","career4","career5"],
  "famous_people": [
    {{"name":"Full Name","why":"One sentence explanation"}},
    {{"name":"Full Name","why":"One sentence explanation"}},
    {{"name":"Full Name","why":"One sentence explanation"}}
  ],
  "relationship_style": "2-3 sentences about how this person relates to others",
  "growth_tips": ["tip1","tip2","tip3"]
}}
Levels must be: Very Low / Low / Moderate / High / Very High. Scores 0-100."""

WRITING_PROMPT = """You are an expert in psycholinguistics. Analyze this writing sample for personality indicators.

WRITING SAMPLE:
\"\"\"{text}\"\"\"

Return ONLY valid JSON, no markdown, no code fences:
{{
  "mbti_type": "XXXX",
  "mbti_description": "One sentence description",
  "writing_style_insights": ["insight1","insight2","insight3","insight4"],
  "personality_summary": "3-4 sentences based on writing analysis",
  "ocean_scores": {{
    "openness":          {{"score": 70, "level": "High",     "confidence": 90, "description": "2 sentences", "xai_reasoning": "Indicated by word choice X"}},
    "conscientiousness": {{"score": 55, "level": "Moderate", "confidence": 80, "description": "2 sentences", "xai_reasoning": "Indicated by sentence structure Y"}},
    "extraversion":      {{"score": 42, "level": "Low",      "confidence": 75, "description": "2 sentences", "xai_reasoning": "Indicated by topic Z"}},
    "agreeableness":     {{"score": 75, "level": "High",     "confidence": 92, "description": "2 sentences", "xai_reasoning": "Indicated by phrasing W"}},
    "neuroticism":       {{"score": 38, "level": "Low",      "confidence": 85, "description": "2 sentences", "xai_reasoning": "Indicated by expression V"}}
  }},
  "key_strengths":    ["s1","s2","s3","s4"],
  "key_weaknesses":   ["w1","w2","w3"],
  "best_career_paths":["c1","c2","c3","c4"],
  "famous_people": [
    {{"name":"Name","why":"reason"}},
    {{"name":"Name","why":"reason"}}
  ],
  "relationship_style": "2-3 sentences",
  "growth_tips": ["t1","t2","t3"]
}}"""


def call_gemini(api_key: str, prompt: str) -> dict:
    models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
    last_error = None
    
    for model_name in models_to_try:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                print(f"  Attempting model: {model_name} (Try {attempt + 1})")
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                
                raw = response.text.strip()
                if "```" in raw:
                    parts = raw.split("```")
                    raw = parts[1] if len(parts) > 1 else parts[0]
                    if raw.startswith("json"):
                        raw = raw[4:]
                
                return json.loads(raw.strip())
            
            except Exception as e:
                last_error = str(e)
                print(f"  Error with {model_name}: {last_error}")
                
                # If location is not supported, don't retry this model, try the next one or fail
                if "location is not supported" in last_error.lower():
                    print(f"  Location error detected for {model_name}. Skipping to next model or reporting.")
                    break # Break out of retry loop, try next model
                
                # If high demand (503), retry with backoff
                if "503" in last_error or "high demand" in last_error.lower():
                    wait_time = (2 ** attempt) + (random.random() * 1)
                    print(f"  High demand detected. Retrying in {wait_time:.2f}s...")
                    time.sleep(wait_time)
                    continue
                
                # For other errors, still try next attempt or model
                time.sleep(1)
        
    # If we get here, all models and retries failed
    error_msg = f"API Error after multiple attempts. Last error: {last_error}"
    if "location is not supported" in last_error.lower():
        error_msg += ". IMPORTANT: Your Render server location might not be supported. Try changing your Render region to Oregon (us-west-2) in the dashboard."
    
    raise Exception(error_msg)


class Handler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        print(f"  {args[0]} {args[1]}")

    def send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path):
        try:
            with open(path, "rb") as f:
                content = f.read()
            mime, _ = mimetypes.guess_type(path)
            mime = mime or "text/plain"
            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", len(content))
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/" or path == "/index.html":
            self.send_file(os.path.join(os.path.dirname(__file__), "index.html"))
        elif path == "/style.css":
            self.send_file(os.path.join(os.path.dirname(__file__), "style.css"))
        elif path == "/script.js":
            self.send_file(os.path.join(os.path.dirname(__file__), "script.js"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))
        api_key = body.get("api_key", "").strip() or GEMINI_API_KEY

        try:
            if self.path == "/api/analyze-quiz":
                answers = body.get("answers", [])
                if isinstance(answers, str):
                    answers_text = answers
                else:
                    answers_text = "\n".join([
                        f"- Q{i+1}: {a['question']} -> {a['answer']} [{a['trait']}]"
                        for i, a in enumerate(answers)
                    ])
                prompt = QUIZ_PROMPT.format(answers=answers_text)
                result = call_gemini(api_key, prompt)
                self.send_json({"success": True, "data": result})

            elif self.path == "/api/analyze-writing":
                text = body.get("text", "")
                prompt = WRITING_PROMPT.format(text=text)
                result = call_gemini(api_key, prompt)
                self.send_json({"success": True, "data": result})

            else:
                self.send_json({"success": False, "error": "Unknown endpoint"}, 404)

        except Exception as e:
            self.send_json({"success": False, "error": str(e)}, 500)


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    # Print immediately so Render detects the open port
    import sys
    print(f"Server listening on 0.0.0.0:{PORT}", file=sys.stdout, flush=True)
    sys.stdout.flush()
    server.serve_forever()