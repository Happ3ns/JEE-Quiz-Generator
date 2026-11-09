import json
import re
import sys
from pathlib import Path
from collections import Counter


def load_bank(repo: Path) -> list[dict]:
    # Check questions.json first
    json_path = repo / "questions.json"
    if json_path.is_file():
        return json.loads(json_path.read_text(encoding="utf-8"))

    # Fallback to questions.js or index.html
    target = repo / "questions.js" if (repo / "questions.js").is_file() else repo / "index.html"
    content = target.read_text(encoding="utf-8")
    match = re.search(r"const\s+BANK\s*=\s*(\[.*?\]);", content, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find 'const BANK = [...]' in {target.name}")
    raw = match.group(1)
    # Quote unquoted JS object keys: subject: -> "subject":
    quoted = re.sub(r'(\b[a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'"\1":', raw)
    # Strip trailing commas before ] or }
    clean = re.sub(r',(\s*[\]}])', r'\1', quoted)
    return json.loads(clean)


def validate(questions: list[dict]) -> int:
    errors = 0
    seen_text = Counter()

    for i, q in enumerate(questions):
        prefix = f"Q{i}"

        # Required fields (support both 'q' and 'question')
        has_q = ("q" in q and q["q"]) or ("question" in q and q["question"])
        if not has_q:
            print(f"  {prefix}: missing question text ('q')")
            errors += 1

        for field in ("options", "answer", "subject", "difficulty"):
            if field not in q or q[field] is None or q[field] == "":
                print(f"  {prefix}: missing '{field}'")
                errors += 1

        # Options length
        opts = q.get("options", [])
        if len(opts) < 4:
            print(f"  {prefix}: only {len(opts)} options (need at least 4)")
            errors += 1

        # Answer index sanity
        ans = q.get("answer")
        if isinstance(ans, int) and not (0 <= ans < len(opts)):
            print(f"  {prefix}: answer index {ans} out of range (options length: {len(opts)})")
            errors += 1

        # Duplicate detection
        text = (q.get("q") or q.get("question") or "").strip().lower()
        seen_text[text] += 1

    duplicates = [t for t, c in seen_text.items() if c > 1 and t]
    for dup in duplicates:
        print(f"  duplicate question: '{dup[:60]}...'")
        errors += 1

    return errors


def main() -> int:
    repo = Path(__file__).resolve().parent.parent
    print("Validating question bank...")
    try:
        bank = load_bank(repo)
    except Exception as e:
        print(f"Error loading bank: {e}", file=sys.stderr)
        return 1

    print(f"Found {len(bank)} questions.\n")
    errors = validate(bank)

    if errors:
        print(f"\n{errors} issue(s) found.")
        return 1

    print("All checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
