"""Automated JEE Question Generator using Google Gemini.

Generates fresh, high-quality JEE questions on demand and updates questions.json
and questions.js automatically, keeping index.html clean and dependency-free.

Usage:
    export GEMINI_API_KEY="your-key"
    python tools/generate_with_gemini.py --count 20 --subject Physics --topic Mechanics
    python tools/generate_with_gemini.py --count 30 --subject Mixed
"""

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path


def prompt_gemini(api_key: str, count: int, subject: str, topic: str, difficulty: str) -> list[dict]:
    prompt = f"""You are an elite exam question setter for India's JEE (Joint Entrance Examination) Mains and Advanced.

Generate exactly {count} multiple-choice questions for JEE preparation.

Target specifications:
- Subject: {subject}
- Topic: {topic if topic != "any" else "mix of core high-weightage topics"}
- Difficulty: {difficulty if difficulty != "any" else "mixed across easy, medium, and hard"}
- Format: Single-choice MCQ with exactly 4 options (A, B, C, D)
- Answer: 0-based integer index (0 for A, 1 for B, 2 for C, 3 for D)
- Precision: Real JEE-level numericals or conceptual rigor with a short worked explanation (1-2 sentences).

Return ONLY a valid JSON array of objects with NO markdown formatting, NO backticks, and NO trailing commas:
[
  {{
    "subject": "{subject if subject != 'Mixed' else 'Physics'}",
    "topic": "Topic Name",
    "difficulty": "medium",
    "q": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explain": "Clear, concise worked explanation."
  }}
]
"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json"
        }
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        raise RuntimeError(f"Gemini API HTTP Error {e.code}: {err_body}") from e
    except Exception as e:
        raise RuntimeError(f"Network error calling Gemini: {e}") from e

    raw_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
    if not raw_text:
        raise ValueError("Empty response from Gemini")

    # Clean markdown if present
    cleaned = re.sub(r"^```(?:json)?", "", raw_text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"```$", "", cleaned.strip(), flags=re.MULTILINE).strip()

    questions = json.loads(cleaned)
    if not isinstance(questions, list):
        raise ValueError("Gemini response is not a list of questions")

    return questions


def main():
    parser = argparse.ArgumentParser(description="Generate JEE questions automatically with Gemini")
    parser.add_argument("--count", type=int, default=15, help="Number of questions to generate (default: 15)")
    parser.add_argument("--subject", type=str, default="Mixed", choices=["Mixed", "Physics", "Chemistry", "Mathematics"])
    parser.add_argument("--topic", type=str, default="any", help="Specific topic or 'any'")
    parser.add_argument("--difficulty", type=str, default="any", choices=["any", "easy", "medium", "hard"])
    parser.add_argument("--api-key", type=str, default="", help="Gemini API Key (or set GEMINI_API_KEY env var)")
    args = parser.parse_args()

    api_key = args.api_key or os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: Gemini API key required. Pass --api-key or set GEMINI_API_KEY environment variable.", file=sys.stderr)
        return 1

    repo_dir = Path(__file__).resolve().parent.parent
    questions_json_path = repo_dir / "questions.json"
    questions_js_path = repo_dir / "questions.js"

    existing_bank = []
    if questions_json_path.is_file():
        try:
            existing_bank = json.loads(questions_json_path.read_text(encoding="utf-8"))
        except Exception:
            existing_bank = []

    existing_questions = {q.get("q", "").strip().lower() for q in existing_bank if q.get("q")}

    print(f"Calling Gemini to generate {args.count} questions ({args.subject}, topic: {args.topic}, level: {args.difficulty})...")
    raw_questions = prompt_gemini(api_key, args.count, args.subject, args.topic, args.difficulty)

    valid_new = []
    for q in raw_questions:
        if not q.get("q") or len(q.get("options", [])) < 4 or not (0 <= q.get("answer", -1) < len(q["options"])):
            continue
        text = q["q"].strip().lower()
        if text in existing_questions:
            continue
        existing_questions.add(text)
        valid_new.append(q)

    print(f"Generated {len(valid_new)} valid new questions.")
    if not valid_new:
        print("No new questions to append.")
        return 0

    # Append to bank
    updated_bank = existing_bank + valid_new
    questions_json_path.write_text(json.dumps(updated_bank, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Updated {questions_json_path.name} (total questions: {len(updated_bank)})")

    # Update questions.js
    js_content = f"""// JEE Question Bank & Procedural Generator
(function(root) {{
  'use strict';

  const BANK = {json.dumps(updated_bank, indent=2, ensure_ascii=False)};

  root.JEE_BANK = BANK;
}})(typeof window !== 'undefined' ? window : globalThis);
"""
    questions_js_path.write_text(js_content, encoding="utf-8")
    print(f"Updated {questions_js_path.name}")
    print("Done! Questions will now automatically appear in the quiz with zero manual steps.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
