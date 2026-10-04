# JEE Quiz Studio

A single-page, no-dependency quiz app for practicing JEE-level Physics, Chemistry, and Mathematics questions — with per-topic accuracy tracking to surface weak areas over time.

https://happ3ns.github.io/JEE-Quiz-Generator/

## Architecture

```mermaid
flowchart LR
    %% ---------- Styling ----------
    classDef client  fill:#eef4f0,stroke:#2f6f4e,stroke-width:1.5px,color:#18181b
    classDef engine  fill:#eff4fb,stroke:#1d4ed8,stroke-width:1.5px,color:#18181b
    classDef storage fill:#fdf6e3,stroke:#a16207,stroke-width:1.5px,color:#18181b
    classDef host    fill:#f5f5f5,stroke:#52525b,stroke-width:1px,color:#18181b

    %% ---------- Layer 1: Delivery ----------
    subgraph L1["1 · Delivery"]
        direction TB
        H1["GitHub Pages<br/><i>static hosting, no server</i>"]
        H2["index.html<br/><i>single-file app</i>"]
    end

    %% ---------- Layer 2: Client ----------
    subgraph L2["2 · User Interface"]
        direction TB
        U1["Subject + Difficulty<br/>selector"]
        U2["Question view<br/>+ instant feedback"]
        U3["Results view<br/>+ answer review"]
    end

    %% ---------- Layer 3: Engine ----------
    subgraph L3["3 · Quiz Engine"]
        direction TB
        Q1["Question Bank<br/><i>hardcoded JS array</i>"]
        Q2["Filter<br/>subject × difficulty"]
        Q3["Score Tracker<br/>correct / wrong per attempt"]
        Q4["Weak-Topic Analyzer<br/>flags topics below threshold"]
    end

    %% ---------- Layer 4: Persistence ----------
    subgraph L4["4 · Browser Persistence"]
        direction TB
        P1[("topic_accuracy<br/><i>per-topic stats</i>")]
        P2[("attempt_history<br/><i>past sessions</i>")]
    end

    %% ---------- Edges ----------
    H1 --> H2
    H2 --> U1
    U1 --> Q2
    Q1 --> Q2
    Q2 --> U2
    U2 --> Q3
    Q3 --> Q4
    Q4 --> P1
    Q3 --> P2
    P1 -.->|loads on open| Q2
    P2 -.->|loads on open| Q4
    Q3 --> U3
    Q4 --> U3

    %% ---------- Apply classes ----------
    class H1,H2 host
    class U1,U2,U3 client
    class Q1,Q2,Q3,Q4 engine
    class P1,P2 storage
```

## Features

- Pick a subject (Physics / Chemistry / Mathematics / Mixed), difficulty, and question count
- Instant feedback per question, with a worked explanation
- Score, per-topic accuracy breakdown, and full answer review after each attempt
- Weak-topic tracking across attempts, stored locally in your browser (`localStorage`) — no account, no backend
- Fully responsive, keyboard-accessible, works offline once loaded

## Why I built this

Built to make my own JEE revision more targeted — instead of solving questions at random, the topic-accuracy tracker tells me exactly which topics to revise next.

## Running it

No build step, no dependencies. Just open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying for free with GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages** in your repo.
3. Under "Build and deployment", set source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

## Project structure

```
├── index.html   # entire app — markup, styles, and logic
└── README.md
```

Everything lives in one file by design, so it's easy to read end-to-end and easy to deploy anywhere that serves static files.

## Extending the question bank

Questions live in the `BANK` array near the top of the `<script>` block in `index.html`. Each entry looks like:

```js
{
  subject: "Physics",
  topic: "Mechanics",
  difficulty: "medium",
  q: "Question text",
  options: ["A", "B", "C", "D"],
  answer: 1,          // index of the correct option
  explain: "Why that answer is correct."
}
```

To add questions: append more objects to `BANK`. To add a new subject or topic, just use a new string — the setup screen and topic-accuracy table pick it up automatically.

## Ideas for extending this further

- [ ] Move the question bank into a separate `questions.json` file and fetch it, so it's easier to maintain as it grows
- [ ] Add negative marking, matching the actual JEE marking scheme
- [ ] Export attempt history as CSV

## License

MIT — use, modify, and extend freely.
