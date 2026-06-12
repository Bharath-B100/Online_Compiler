import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import CodeEditor from './components/Editor';
import OutputPanel from './components/Output';
import StdinPanel from './components/StdinPanel';
import HistorySidebar from './components/HistorySidebar';
import AnalysisPanel from './components/AnalysisPanel';
import CodeStats from './components/CodeStats';
import ExecutionProgress from './components/ExecutionProgress';
import ChallengePanel from './components/ChallengePanel';
import MultiTestRunner from './components/MultiTestRunner';

const DEFAULT_CODE = {
  javascript: `// JavaScript — CodeForge\nconsole.log("Hello, World!");\n\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log("Fibonacci(10):", fibonacci(10));`,
  python:     `# Python — CodeForge\nprint("Hello, World!")\n\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n\nprint(f"Fibonacci(10): {fibonacci(10)}")`,
  java:       `// Java — CodeForge\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("Fibonacci(10): " + fibonacci(10));\n    }\n    static int fibonacci(int n) {\n        if (n <= 1) return n;\n        return fibonacci(n - 1) + fibonacci(n - 2);\n    }\n}`,
  c:          `// C — CodeForge\n#include <stdio.h>\nint fibonacci(int n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }\nint main() {\n    printf("Hello, World!\\n");\n    printf("Fibonacci(10): %d\\n", fibonacci(10));\n    return 0;\n}`,
  cpp:        `// C++ — CodeForge\n#include <iostream>\nusing namespace std;\nint fibonacci(int n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }\nint main() {\n    cout << "Hello, World!" << endl;\n    cout << "Fibonacci(10): " << fibonacci(10) << endl;\n    return 0;\n}`,
  typescript: `// TypeScript — CodeForge\nconst greet = (name: string): string => \`Hello, \${name}!\`;\nconsole.log(greet("World"));\nfunction fibonacci(n: number): number {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\nconsole.log("Fibonacci(10):", fibonacci(10));`,
  go:         `// Go — CodeForge\npackage main\nimport "fmt"\nfunc fibonacci(n int) int {\n    if n <= 1 { return n }\n    return fibonacci(n-1) + fibonacci(n-2)\n}\nfunc main() {\n    fmt.Println("Hello, World!")\n    fmt.Printf("Fibonacci(10): %d\\n", fibonacci(10))\n}`,
  php:        `<?php\n// PHP — CodeForge\necho "Hello, World!\\n";\nfunction fibonacci($n) {\n    if ($n <= 1) return $n;\n    return fibonacci($n-1) + fibonacci($n-2);\n}\necho "Fibonacci(10): " . fibonacci(10) . "\\n";\n?>`,
  ruby:       `# Ruby — CodeForge\nputs "Hello, World!"\ndef fibonacci(n)\n  return n if n <= 1\n  fibonacci(n-1) + fibonacci(n-2)\nend\nputs "Fibonacci(10): #{fibonacci(10)}"`,
};

const API = import.meta.env.VITE_API_URL || '/api/execute';
const HISTORY_KEY = 'codeforge_history';
const MAX_HISTORY = 15;

const loadHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } };
const saveHistory = (h) => { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch {} };

async function executeCode(language, code, stdin = '') {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, code, stdin }),
  });
  return res.json();
}

function App() {
  const [language, setLanguage]   = useState('javascript');
  const [code, setCode]           = useState(DEFAULT_CODE.javascript);
  const [stdin, setStdin]         = useState('');
  const [output, setOutput]       = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme]         = useState('vs-dark');
  const [fontSize, setFontSize]   = useState(14);
  const [history, setHistory]     = useState(loadHistory);
  const [executionStats, setExecutionStats] = useState(null);
  const [toast, setToast]         = useState(null);
  const [editorWidth, setEditorWidth] = useState(60);

  // Panel toggles
  const [showHistory, setShowHistory]     = useState(false);
  const [showAnalysis, setShowAnalysis]   = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showMultiTest, setShowMultiTest] = useState(false);

  // Challenge state
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [challengeResults, setChallengeResults] = useState(null);

  const isDragging = useRef(false);

  // Reset code on language change
  useEffect(() => {
    setCode(DEFAULT_CODE[language] || '');
    setOutput(null);
    setExecutionStats(null);
    setChallengeResults(null);
  }, [language]);

  const showToast = useCallback((msg, icon = '✓') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2500);
  }, []);

  // ── Core run function ─────────────────────────────────────────────
  const runCode = useCallback(async (customStdin) => {
    // Guard: only accept string stdin values (prevents React event objects leaking in)
    const inputStdin = (typeof customStdin === 'string') ? customStdin : stdin;
    if (!code.trim()) { showToast('Write some code first!', '⚠️'); return; }
    setIsLoading(true); setOutput(null); setExecutionStats(null);
    try {
      const data = await executeCode(language, code, inputStdin);
      const stats = { success: data.success, executionTime: data.executionTime || 0, exitCode: data.exitCode ?? -1 };
      setExecutionStats(stats);
      setOutput({ stdout: data.output || '', stderr: data.error || '', success: data.success });
      const entry = { id: Date.now(), language, code, stdin: inputStdin, output: data.output || '', error: data.error || '', success: data.success, executionTime: data.executionTime || 0, timestamp: new Date().toISOString() };
      setHistory(prev => { const next = [entry, ...prev].slice(0, MAX_HISTORY); saveHistory(next); return next; });
    } catch (err) {
      setOutput({ stdout: '', stderr: `Connection error: ${err.message}\n\nMake sure the backend is running on port 5001.`, success: false });
      setExecutionStats({ success: false, executionTime: 0, exitCode: -1 });
    } finally { setIsLoading(false); }
  }, [code, language, stdin, showToast]);

  // Keyboard shortcut — always call runCode() with no args so stdin defaults to the state value
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode(undefined); // explicit undefined keeps customStdin check correct
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [runCode]);

  // ── Share ─────────────────────────────────────────────────────────
  const shareCode = useCallback(() => {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ language, code }))));
    const url = `${window.location.origin}${window.location.pathname}?share=${payload}`;
    navigator.clipboard.writeText(url).then(() => showToast('Share link copied!', '🔗')).catch(() => showToast('Failed to copy', '❌'));
  }, [language, code, showToast]);

  // Load shared code from URL
  useEffect(() => {
    const share = new URLSearchParams(window.location.search).get('share');
    if (share) {
      try {
        const { language: l, code: c } = JSON.parse(decodeURIComponent(escape(atob(share))));
        if (l && c) { setLanguage(l); setTimeout(() => setCode(c), 50); showToast('Shared code loaded!', '📎'); }
      } catch {}
    }
  }, []);

  // ── Resizable panels ──────────────────────────────────────────────
  const onMouseDownResize = useCallback((e) => {
    e.preventDefault(); isDragging.current = true;
    const onMove = (mv) => { if (!isDragging.current) return; setEditorWidth(Math.min(80, Math.max(30, (mv.clientX / window.innerWidth) * 100))); };
    const onUp = () => { isDragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  }, []);

  // ── Challenge Mode handlers ───────────────────────────────────────
  const handleLoadChallenge = useCallback((challenge) => {
    setActiveChallenge(challenge);
    setChallengeResults(null);
    const starter = challenge.starter[language] || challenge.starter.javascript || challenge.starter.python || '';
    setCode(starter);
    showToast(`"${challenge.title}" loaded!`, '🏆');
  }, [language, showToast]);

  const handleSubmitChallenge = useCallback(async (challenge) => {
    if (!code.trim()) { showToast('Write your solution first!', '⚠️'); return; }
    setIsSubmitting(true);
    setChallengeResults(null);
    const results = [];
    for (const tc of challenge.testCases) {
      const start = Date.now();
      try {
        const data = await executeCode(language, code, tc.stdin);
        const actual = (data.output || '').trim();
        const expected = tc.expected.trim();
        results.push({ id: tc.id, passed: actual === expected, actual, expected, time: Date.now() - start });
      } catch {
        results.push({ id: tc.id, passed: false, actual: 'Error', expected: tc.expected, time: Date.now() - start });
      }
    }
    setChallengeResults(results);
    setIsSubmitting(false);
    const passed = results.filter(r => r.passed).length;
    showToast(`${passed}/${results.length} tests passed`, passed === results.length ? '🎉' : '📋');
  }, [code, language, showToast]);

  // ── Multi-Test single run ─────────────────────────────────────────
  const handleRunSingle = useCallback(async (inputStdin) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code, stdin: inputStdin }),
    });
    return res.json();
  }, [language, code]);

  // ── History restore ───────────────────────────────────────────────
  const restoreHistory = useCallback((entry) => {
    setLanguage(entry.language);
    setTimeout(() => setCode(entry.code), 50);
    setStdin(entry.stdin || '');
    setShowHistory(false);
    showToast('Code restored from history', '📂');
  }, [showToast]);

  return (
    <div className="gradient-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <ExecutionProgress isLoading={isLoading || isSubmitting} />

      <Navbar
        language={language} setLanguage={setLanguage}
        onRun={runCode} isLoading={isLoading}
        theme={theme} setTheme={setTheme}
        fontSize={fontSize} setFontSize={setFontSize}
        onShare={shareCode}
        onToggleHistory={() => setShowHistory(v => !v)} historyCount={history.length}
        onToggleAnalysis={() => setShowAnalysis(v => !v)} analysisActive={showAnalysis}
        onToggleChallenge={() => setShowChallenge(v => !v)} challengeActive={showChallenge}
        onToggleMultiTest={() => setShowMultiTest(v => !v)} multiTestActive={showMultiTest}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* Challenge Panel — left overlay */}
        {showChallenge && (
          <ChallengePanel
            onClose={() => setShowChallenge(false)}
            onLoadChallenge={handleLoadChallenge}
            onSubmit={handleSubmitChallenge}
            isSubmitting={isSubmitting}
            results={challengeResults}
            activeChallenge={activeChallenge}
          />
        )}

        {/* Editor Pane */}
        <div style={{ width: `${editorWidth}%`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <CodeEditor code={code} setCode={setCode} language={language} theme={theme} fontSize={fontSize} />
          <CodeStats code={code} language={language} />
          {showMultiTest
            ? <MultiTestRunner onRunSingle={handleRunSingle} language={language} />
            : <StdinPanel stdin={stdin} setStdin={setStdin} />
          }
        </div>

        <div className="resize-handle" onMouseDown={onMouseDownResize} title="Drag to resize" />

        {/* Output Pane */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <OutputPanel
            output={output} isLoading={isLoading}
            executionStats={executionStats} language={language}
            onClear={() => { setOutput(null); setExecutionStats(null); }}
          />
          {showHistory && (
            <HistorySidebar history={history} onRestore={restoreHistory}
              onClearHistory={() => { setHistory([]); saveHistory([]); }}
              onClose={() => setShowHistory(false)} />
          )}
          {showAnalysis && (
            <AnalysisPanel code={code} language={language} onClose={() => setShowAnalysis(false)} />
          )}
        </div>
      </div>

      {toast && (
        <div className="toast"><span>{toast.icon}</span><span>{toast.msg}</span></div>
      )}
    </div>
  );
}

export default App;
