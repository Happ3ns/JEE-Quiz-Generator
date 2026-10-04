import json
import re
import sys
from pathlib import Path
from collections import Counter

BANK_REGEX = re.compile(
    r"const\s+BANK\s*=\s*(\[.*?\]);",
    re.DOTALL,
)


def extract_bank(html_path: Path) -> list[dict]:
    html = html_path.read_text(encoding="utf-8")
    match = BANK_REGEX.search(html)
    if not match:
        raise ValueError("Could not find 'const BANK = [...]' in index.html")
    # The bank is valid JSON-ish; if it's JS object syntax, strip trailing commas
    raw = re.sub(r",(\s*[\]}])", r"\1", match.group(1))
    return json.loads(raw)


def validate(questions: list[dict]) -> int:
    errors = 0
    seen_text = Counter()

    for i, q in enumerate(questions):
        prefix = f"Q{i}"

        # Required fields
        for field in ("question", "options", "answer", "subject", "difficulty"):
            if field not in q or not q[field]:
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
            print(f"  {prefix}: answer index {ans} out of range")
            errors += 1

        # Duplicate detection
        text = q.get("question", "").strip().lower()
        seen_text[text] += 1

    duplicates = [t for t, c in seen_text.items() if c > 1 and t]
    for dup in duplicates:
        print(f"  duplicate question: '{dup[:60]}...'")
        errors += 1

    return errors


def main() -> int:
    repo = Path(__file__).resolve().parent.parent
    html = repo / "index.html"
    if not html.is_file():
        print(f"Error: {html} not found", file=sys.stderr)
        return 1

    print(f"Validating question bank in {html.name}...")
    try:
        bank = extract_bank(html)
    except (ValueError, json.JSONDecodeError) as e:
        print(f"Error: {e}", file=sys.stderr)
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
