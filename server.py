"""
Personality Analyzer - Pure Python Server
No Flask, no Django, no frameworks — just Python built-ins + Gemini API
Run: python server.py
Open: http://localhost:8080
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
from google import genai
import json
import os
import mimetypes

# ── API KEY — reads from environment variable (set on Render) ────────────────
# Locally: paste your key as the fallback value below
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")
# ─────────────────────────────────────────────────────────────────────────────

# Render sets PORT automatically — falls back to 8080 locally
PORT = int(os.environ.get("PORT", 8080))

QUIZ_PROMPT = """You are an expert personality psychologist. Analyze these quiz responses and return a personality profile.

RESPONSES:
{answers}

Return ONLY valid JSON, no markdown, no code fences:
{{
  "mbti_type": "XXXX",
  "mbti_description": "One sentence description of this MBTI type",
  "personality_summary": "3-4 sentences summarizing the overall personality",
  "ocean_scores": {{
    "openness":          {{"score": 72, "level": "High",     "description": "2 clear sentences"}},
    "conscientiousness": {{"score": 65, "level": "Moderate", "description": "2 clear sentences"}},
    "extraversion":      {{"score": 48, "level": "Moderate", "description": "2 clear sentences"}},
    "agreeableness":     {{"score": 78, "level": "High",     "description": "2 clear sentences"}},
    "neuroticism":       {{"score": 32, "level": "Low",      "description": "2 clear sentences"}}
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
    "openness":          {{"score": 70, "level": "High",     "description": "2 sentences"}},
    "conscientiousness": {{"score": 55, "level": "Moderate", "description": "2 sentences"}},
    "extraversion":      {{"score": 42, "level": "Low",      "description": "2 sentences"}},
    "agreeableness":     {{"score": 75, "level": "High",     "description": "2 sentences"}},
    "neuroticism":       {{"score": 38, "level": "Low",      "description": "2 sentences"}}
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
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    raw = response.text.strip()
    if "```" in raw:
        parts = raw.split("```")
        raw = parts[1] if len(parts) > 1 else parts[0]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


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
        elif path == "/app.js":
            self.send_file(os.path.join(os.path.dirname(__file__), "app.js"))
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
    print(f"Personality Analyzer running on port {PORT}", flush=True)
    server.serve_forever()