# Trait definitions and inventory for the AI Personality Analysis System

# 15-question inventory (3 per OCEAN trait)
# Scoring: 1 (Strongly Disagree) to 5 (Strongly Agree)
QUESTIONS = [
    {"id": "o1", "text": "I have a vivid imagination.", "trait": "Openness"},
    {"id": "o2", "text": "I am interested in abstract ideas.", "trait": "Openness"},
    {"id": "o3", "text": "I enjoy hearing new ideas.", "trait": "Openness"},
    
    {"id": "c1", "text": "I am always prepared.", "trait": "Conscientiousness"},
    {"id": "c2", "text": "I pay attention to details.", "trait": "Conscientiousness"},
    {"id": "c3", "text": "I follow a schedule.", "trait": "Conscientiousness"},
    
    {"id": "e1", "text": "I am the life of the party.", "trait": "Extraversion"},
    {"id": "e2", "text": "I feel comfortable around people.", "trait": "Extraversion"},
    {"id": "e3", "text": "I start conversations.", "trait": "Extraversion"},
    
    {"id": "a1", "text": "I am interested in people.", "trait": "Agreeableness"},
    {"id": "a2", "text": "I sympathize with others' feelings.", "trait": "Agreeableness"},
    {"id": "a3", "text": "I have a soft heart.", "trait": "Agreeableness"},
    
    {"id": "n1", "text": "I get upset easily.", "trait": "Neuroticism"},
    {"id": "n2", "text": "I change my mood a lot.", "trait": "Neuroticism"},
    {"id": "n3", "text": "I worry about things.", "trait": "Neuroticism"}
]

def map_to_mbti(scores):
    """
    Very basic heuristic mapping from OCEAN to MBTI.
    Note: Scientifically, these are different models, but this mapping is common for relatability.
    """
    # E/I (Extraversion vs Introversion)
    ei = "E" if scores["Extraversion"] >= 3.0 else "I"
    
    # S/N (Sensing vs Intuition) -> Correlates with Openness
    sn = "N" if scores["Openness"] >= 3.5 else "S"
    
    # T/F (Thinking vs Feeling) -> Correlates with Agreeableness
    tf = "F" if scores["Agreeableness"] >= 3.0 else "T"
    
    # J/P (Judging vs Perceiving) -> Correlates with Conscientiousness
    jp = "J" if scores["Conscientiousness"] >= 3.0 else "P"
    
    return f"{ei}{sn}{tf}{jp}"

def get_system_prompt():
    return """
    You are a Senior Research Psychologist and Expert Psychometrician.
    Your task is to analyze a person's personality based on:
    1. Structured Big Five (OCEAN) scores (1-5 range).
    2. A natural language writing sample (This is OPTIONAL and may be empty).

    Integration Logic:
    - If a writing sample is provided: Integrate both quantitative scores and qualitative psycholinguistic patterns to build a deep profile.
    - If NO writing sample is provided: Base your analysis purely on the Big Five scores and their established correlations with MBTI and other traits. Explicitly mention that the linguistic analysis is omitted due to a lack of data.

    The response MUST be in valid JSON format with the following structure:
    {
      "mbti_type": "string",
      "personality_title": "string (e.g., 'The Creative Architect')",
      "trait_analysis": {
        "Openness": "short analysis",
        "Conscientiousness": "...",
        "Extraversion": "...",
        "Agreeableness": "...",
        "Neuroticism": "..."
      },
      "profile_summary": "paragraph summary",
      "strengths": ["list of 3-4 strengths"],
      "weaknesses": ["list of 3-4 weaknesses"],
      "career_recommendations": ["list of 3 careers"],
      "relationship_style": "short paragraph",
      "famous_people": ["list of 2-3 names"],
      "growth_suggestions": ["list of 2-3 practical tips"]
    }

    Keep the tone academic, professional, and insightful. Avoid emojis.
    """

def construct_user_prompt(scores, writing_sample, mbti_hint):
    prompt = f"Data Analysis Request:\n\n"
    prompt += "### 1. Big Five Scores (1 to 5 scale):\n"
    for trait, score in scores.items():
        prompt += f"- {trait}: {score:.2f}\n"
    
    prompt += f"\n### 2. Preliminary MBTI Heuristic: {mbti_hint}\n"
    
    prompt += "\n### 3. Writing Sample:\n"
    if writing_sample and writing_sample.strip():
        prompt += f"\"\"\"\n{writing_sample}\n\"\"\"\n\n"
    else:
        prompt += "[NO SAMPLE PROVIDED BY USER]\n\n"
    
    prompt += "Please provide the integration analysis in JSON format."
    return prompt
