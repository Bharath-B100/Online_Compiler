import React, { useMemo } from 'react';

// Lightweight static code analysis — no AI API needed, runs entirely in-browser
const RULES = {
  javascript: [
    { id: 'js-no-var',     pattern: /\bvar\b/g,              sev: 'warn',  msg: 'Prefer `let` or `const` over `var`' },
    { id: 'js-eqeq',      pattern: /[^=!<>]==[^=]/g,         sev: 'warn',  msg: 'Use `===` instead of `==` for strict equality' },
    { id: 'js-console',   pattern: /console\.(log|warn|error)/g, sev: 'info', msg: 'Remove console statements before production' },
    { id: 'js-todo',      pattern: /\/\/\s*TODO/gi,           sev: 'info',  msg: 'TODO comment found — track this task' },
    { id: 'js-empty-catch',pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g, sev: 'error', msg: 'Empty catch block swallows errors silently' },
    { id: 'js-alert',     pattern: /\balert\s*\(/g,           sev: 'warn',  msg: 'Avoid using `alert()` in production code' },
    { id: 'js-long-line', pattern: /.{120,}/gm,              sev: 'info',  msg: 'Lines over 120 chars reduce readability' },
  ],
  typescript: [
    { id: 'ts-any',       pattern: /:\s*any\b/g,             sev: 'warn',  msg: 'Avoid `any` type — use specific types for safety' },
    { id: 'ts-nonnull',   pattern: /!\./g,                   sev: 'warn',  msg: 'Non-null assertion `!.` may cause runtime errors' },
    { id: 'ts-console',   pattern: /console\.(log|warn|error)/g, sev: 'info', msg: 'Remove console statements before production' },
    { id: 'ts-todo',      pattern: /\/\/\s*TODO/gi,           sev: 'info',  msg: 'TODO comment found' },
  ],
  python: [
    { id: 'py-print',     pattern: /\bprint\s*\(/g,          sev: 'info',  msg: 'Print statement detected — use logging in production' },
    { id: 'py-bare-except', pattern: /except\s*:/g,          sev: 'warn',  msg: 'Bare `except:` catches all exceptions including SystemExit' },
    { id: 'py-global',    pattern: /\bglobal\b/g,            sev: 'warn',  msg: 'Global variables make code harder to test' },
    { id: 'py-todo',      pattern: /#\s*TODO/gi,              sev: 'info',  msg: 'TODO comment found' },
    { id: 'py-star-import', pattern: /from\s+\S+\s+import\s+\*/g, sev: 'warn', msg: 'Star imports pollute the namespace' },
  ],
  java: [
    { id: 'java-sout',    pattern: /System\.out\.print/g,    sev: 'info',  msg: 'Use a logger instead of System.out in production' },
    { id: 'java-empty-catch', pattern: /catch\s*\([^)]+\)\s*\{\s*\}/g, sev: 'error', msg: 'Empty catch block — handle or log the exception' },
    { id: 'java-todo',    pattern: /\/\/\s*TODO/gi,           sev: 'info',  msg: 'TODO comment found' },
    { id: 'java-magic',   pattern: /(?<![.\w])\d{2,}(?![.\w])/g, sev: 'info', msg: 'Magic number — consider using a named constant' },
  ],
  c: [
    { id: 'c-gets',       pattern: /\bgets\s*\(/g,           sev: 'error', msg: '`gets()` is dangerous — use `fgets()` instead' },
    { id: 'c-printf',     pattern: /printf\s*\(\s*[^"]/g,    sev: 'warn',  msg: 'Possible format string vulnerability in printf' },
    { id: 'c-todo',       pattern: /\/\/\s*TODO/gi,           sev: 'info',  msg: 'TODO comment found' },
    { id: 'c-magic',      pattern: /(?<![.\w])\d{2,}(?![.\w])/g, sev: 'info', msg: 'Magic number — consider a #define constant' },
  ],
  cpp: [
    { id: 'cpp-endl',     pattern: /std::endl/g,             sev: 'info',  msg: '`std::endl` flushes the buffer — use `\\n` for performance' },
    { id: 'cpp-todo',     pattern: /\/\/\s*TODO/gi,           sev: 'info',  msg: 'TODO comment found' },
    { id: 'cpp-goto',     pattern: /\bgoto\b/g,              sev: 'warn',  msg: '`goto` makes control flow hard to follow' },
    { id: 'cpp-raw-ptr',  pattern: /\bnew\b/g,               sev: 'warn',  msg: 'Raw `new` — prefer smart pointers (unique_ptr, shared_ptr)' },
  ],
  go: [
    { id: 'go-err-ignore', pattern: /_\s*=\s*\w+\s*\(/g,    sev: 'warn',  msg: 'Error return value discarded with `_`' },
    { id: 'go-todo',       pattern: /\/\/\s*TODO/gi,          sev: 'info',  msg: 'TODO comment found' },
    { id: 'go-fmt-print',  pattern: /fmt\.Print(?!ln|f)/g,   sev: 'info',  msg: 'Consider `fmt.Println` for automatic newline' },
  ],
  php: [
    { id: 'php-echo',     pattern: /\becho\b/g,              sev: 'info',  msg: 'Echo is fine; prefer `echo` over `print` for speed' },
    { id: 'php-todo',     pattern: /\/\/\s*TODO/gi,           sev: 'info',  msg: 'TODO comment found' },
    { id: 'php-mysql',    pattern: /mysql_\w+\s*\(/g,        sev: 'error', msg: '`mysql_*` functions are removed — use PDO or MySQLi' },
  ],
  ruby: [
    { id: 'rb-puts',      pattern: /\bputs\b/g,              sev: 'info',  msg: 'puts detected — fine for scripts' },
    { id: 'rb-todo',      pattern: /#\s*TODO/gi,              sev: 'info',  msg: 'TODO comment found' },
    { id: 'rb-eval',      pattern: /\beval\b/g,              sev: 'error', msg: '`eval` is a security risk' },
  ],
};

const SEV_STYLE = {
  error: { icon: '✗', color: 'var(--accent-red)',    bg: 'rgba(255,85,114,0.1)',  border: 'rgba(255,85,114,0.25)' },
  warn:  { icon: '⚠', color: 'var(--accent-yellow)', bg: 'rgba(255,209,102,0.1)', border: 'rgba(255,209,102,0.25)' },
  info:  { icon: 'ℹ', color: 'var(--accent-secondary)', bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)' },
};

function analyzeCode(language, code) {
  const rules = RULES[language] || [];
  const findings = [];

  for (const rule of rules) {
    const matches = [...code.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags))];
    if (matches.length > 0) {
      findings.push({ ...rule, count: matches.length });
    }
  }

  // Score: 100 - (errors×20 + warnings×8 + infos×2), clamped [0,100]
  const score = Math.max(0, 100
    - findings.filter(f => f.sev === 'error').length * 20
    - findings.filter(f => f.sev === 'warn').length * 8
    - findings.filter(f => f.sev === 'info').length * 2
  );

  return { findings, score };
}

function scoreColor(score) {
  if (score >= 80) return 'var(--accent-green)';
  if (score >= 50) return 'var(--accent-yellow)';
  return 'var(--accent-red)';
}

const AnalysisPanel = ({ code, language, onClose }) => {
  const { findings, score } = useMemo(() => analyzeCode(language, code), [code, language]);

  const errors = findings.filter(f => f.sev === 'error');
  const warns  = findings.filter(f => f.sev === 'warn');
  const infos  = findings.filter(f => f.sev === 'info');

  return (
    <div style={{
      position: 'absolute', right: 0, top: 0, bottom: 0,
      width: 300, background: 'rgba(10,14,26,0.97)',
      borderLeft: '1px solid var(--border-medium)',
      display: 'flex', flexDirection: 'column', zIndex: 30,
      animation: 'slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14 }}>🔍</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Code Analysis</span>
        </div>
        <button className="icon-btn" onClick={onClose} style={{ fontSize: 15 }}>×</button>
      </div>

      {/* Score Ring */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
          background: `conic-gradient(${scoreColor(score)} ${score}%, rgba(255,255,255,0.05) 0%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: scoreColor(score), lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 8, color: 'var(--text-dim)', marginTop: 1 }}>SCORE</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: score >= 80 ? 'var(--accent-green)' : score >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)', marginBottom: 6 }}>
            {score >= 80 ? '✓ Good' : score >= 50 ? '⚠ Needs Work' : '✗ Issues Found'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {errors.length > 0 && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: SEV_STYLE.error.bg, border: `1px solid ${SEV_STYLE.error.border}`, color: SEV_STYLE.error.color, fontWeight: 700 }}>{errors.length} error{errors.length > 1 ? 's' : ''}</span>}
            {warns.length > 0  && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: SEV_STYLE.warn.bg,  border: `1px solid ${SEV_STYLE.warn.border}`,  color: SEV_STYLE.warn.color,  fontWeight: 700 }}>{warns.length} warn{warns.length > 1 ? 's' : ''}</span>}
            {infos.length > 0  && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, background: SEV_STYLE.info.bg,  border: `1px solid ${SEV_STYLE.info.border}`,  color: SEV_STYLE.info.color,  fontWeight: 700 }}>{infos.length} hint{infos.length > 1 ? 's' : ''}</span>}
            {findings.length === 0 && <span style={{ fontSize: 10, color: 'var(--accent-green)' }}>No issues detected</span>}
          </div>
        </div>
      </div>

      {/* Findings List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {findings.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, color: 'var(--text-dim)', fontSize: 12 }}>
            <span style={{ fontSize: 32 }}>🎉</span>
            <span>Looks clean!</span>
          </div>
        ) : (
          [...errors, ...warns, ...infos].map((f, i) => {
            const s = SEV_STYLE[f.sev];
            return (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: s.bg, border: `1px solid ${s.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>{s.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: s.color }}>{f.sev}</span>
                  {f.count > 1 && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 99, background: 'rgba(255,255,255,0.07)', color: 'var(--text-dim)', marginLeft: 'auto' }}>×{f.count}</span>}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-primary)', lineHeight: 1.5 }}>{f.msg}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 10, color: 'var(--text-dim)', flexShrink: 0 }}>
        Static analysis · {findings.length} finding{findings.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default AnalysisPanel;
