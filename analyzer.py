import anthropic
import json
import os
import re

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))


def analyze_papers(papers_text: list[str], syllabus_text: str) -> dict:
    """
    Send past papers + syllabus to Claude for deep analysis.
    Returns structured JSON with topic frequency, study plan, etc.
    """

    combined_papers = ""
    for i, text in enumerate(papers_text):
        combined_papers += f"\n\n===== PAPER {i+1} =====\n{text}"

    prompt = f"""
You are an expert exam strategist and educational analyst. Analyze the following past question papers against the provided syllabus.

{combined_papers}

===== SYLLABUS =====
{syllabus_text}

Perform a deep analysis and return a JSON object with EXACTLY this structure (no extra text, no markdown, only raw JSON):

{{
  "total_papers_analyzed": <number>,
  "topic_frequency": {{
    "<topic_name>": <number_of_times_appeared>
  }},
  "high_yield_topics": [
    {{
      "topic": "<topic name>",
      "score": <1-100>,
      "reason": "<why it's high yield>"
    }}
  ],
  "coverage_gaps": [
    {{
      "topic": "<syllabus topic not covered in papers>",
      "risk": "low|medium|high"
    }}
  ],
  "difficulty_distribution": {{
    "easy": <percentage>,
    "medium": <percentage>,
    "hard": <percentage>
  }},
  "question_type_distribution": {{
    "theoretical": <percentage>,
    "numerical": <percentage>,
    "application": <percentage>,
    "analytical": <percentage>
  }},
  "year_wise_trends": [
    {{
      "year": "<year or Paper N>",
      "dominant_topics": ["<topic1>", "<topic2>"],
      "difficulty": "easy|medium|hard"
    }}
  ],
  "study_planner": [
    {{
      "week": <week_number>,
      "topics": ["<topic1>", "<topic2>"],
      "hours": <recommended_hours>,
      "priority": "critical|high|medium|low",
      "focus": "<what to focus on this week>"
    }}
  ],
  "practice_questions": [
    {{
      "topic": "<topic>",
      "question": "<practice question>",
      "difficulty": "easy|medium|hard",
      "marks": <estimated marks>
    }}
  ],
  "exam_strategy_tips": ["<tip1>", "<tip2>", "<tip3>"]
}}

Be thorough, specific, and base everything strictly on the content of the papers and syllabus provided.
Return ONLY valid JSON. No explanations, no markdown code blocks.
"""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw_text = response.content[0].text.strip()

    # Strip markdown code fences if present
    raw_text = re.sub(r"^```json\s*", "", raw_text)
    raw_text = re.sub(r"^```\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        # Return a safe fallback
        return {
            "error": "Failed to parse AI response",
            "raw": raw_text[:500]
        }
