// ── App State, Local Storage & Audio Synth ──
(function (root) {
  "use strict";

  const STORAGE_KEY = "jeeQuizHistory";
  const SETTINGS_KEY = "jeeQuizSettings";
  const BOOKMARKS_KEY = "jeeQuizBookmarks";

  function getBookmarks() {
    try {
      const raw = localStorage.getItem(BOOKMARKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function toggleBookmark(id) {
    const bms = getBookmarks();
    const strId = String(id);
    const idx = bms.indexOf(strId);
    if (idx >= 0) {
      bms.splice(idx, 1);
    } else {
      bms.push(strId);
    }
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bms));
    } catch (e) {}
    return idx < 0;
  }

  function isBookmarked(id) {
    return getBookmarks().includes(String(id));
  }


  const state = {
    subject: "Mixed",
    focus: "any",
    difficulty: "any",
    count: 10,
    markingScheme: "jee", // "jee" (+4/-1) or "standard" (+1/0)
    mode: "practice",     // "practice" or "mock"
    questionLimit: 60,    // seconds per question
    soundEnabled: true,

    // Session runtime
    questions: [],
    index: 0,
    activeSubject: null,
    score: 0,             // raw score based on marking scheme
    correctCount: 0,
    wrongCount: 0,
    skippedCount: 0,
    answers: [],
    questionStart: 0,
    totalTime: 0,
    timerId: null
  };

  // Audio synthesizer via Web Audio API (zero external assets)
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "correct") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.14);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === "skip") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(360, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch (e) {
      // Audio autoplay blocked or unsupported
    }
  }

  function loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.soundEnabled === "boolean") state.soundEnabled = parsed.soundEnabled;
        if (parsed.markingScheme) state.markingScheme = parsed.markingScheme;
      }
    } catch (e) {}
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        soundEnabled: state.soundEnabled,
        markingScheme: state.markingScheme
      }));
    } catch (e) {}
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveAttempt(attempt) {
    try {
      const hist = loadHistory();
      hist.push(attempt);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hist.slice(-50)));
    } catch (e) {}
  }

  function topicWeaknessSummary() {
    const hist = loadHistory();
    const stats = {};
    hist.forEach(a => {
      (a.answers || []).forEach(r => {
        const key = r.topic;
        if (!key) return;
        if (!stats[key]) stats[key] = { correct: 0, total: 0 };
        stats[key].total++;
        if (r.correct) stats[key].correct++;
      });
    });
    return stats;
  }

  function getWeakTopics() {
    const weak = topicWeaknessSummary();
    return Object.keys(weak)
      .filter(topic => weak[topic].total >= 3 && (weak[topic].correct / weak[topic].total) < 0.6)
      .sort((a, b) => (weak[a].correct / weak[a].total) - (weak[b].correct / weak[b].total));
  }

  root.QuizState = {
    state,
    playSound,
    loadSettings,
    saveSettings,
    loadHistory,
    saveAttempt,
    topicWeaknessSummary,
    getWeakTopics,
    getBookmarks,
    toggleBookmark,
    isBookmarked
  };

})(typeof window !== "undefined" ? window : globalThis);
