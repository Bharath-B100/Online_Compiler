import React from 'react';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
  { value: 'python',     label: 'Python',     color: '#3776ab' },
  { value: 'java',       label: 'Java',       color: '#f89820' },
  { value: 'c',          label: 'C',          color: '#a8b9cc' },
  { value: 'cpp',        label: 'C++',        color: '#00599c' },
  { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
  { value: 'go',         label: 'Go',         color: '#00add8' },
  { value: 'php',        label: 'PHP',        color: '#8892be' },
  { value: 'ruby',       label: 'Ruby',       color: '#cc342d' },
];

const THEMES = [
  { value: 'vs-dark',  label: '🌙 VS Dark' },
  { value: 'vs-light', label: '☀️ Light' },
  { value: 'hc-black', label: '⬛ High Contrast' },
];

const Navbar = ({
  language, setLanguage, onRun, isLoading,
  theme, setTheme, fontSize, setFontSize,
  onShare, onToggleHistory, historyCount,
  onToggleAnalysis, analysisActive,
  onToggleChallenge, challengeActive,
  onToggleMultiTest, multiTestActive,
}) => {
  const currentLang = LANGUAGES.find(l => l.value === language);

  const activeStyle = { borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' };

  return (
    <header className="navbar">
      {/* Brand */}
      <div className="navbar-brand">
        <div className="brand-logo">⚡</div>
        <span className="brand-name">CodeForge</span>
      </div>

      {/* Controls */}
      <div className="navbar-controls">
        {/* Language */}
        <div className="control-group">
          <span className="control-label">Lang</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {currentLang && <span style={{ position: 'absolute', left: 8, width: 8, height: 8, borderRadius: '50%', background: currentLang.color, boxShadow: `0 0 6px ${currentLang.color}`, zIndex: 1, pointerEvents: 'none' }} />}
            <select id="language-select" value={language} onChange={e => setLanguage(e.target.value)} className="custom-select" style={{ paddingLeft: 22 }}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>

        {/* Theme */}
        <div className="control-group">
          <span className="control-label">Theme</span>
          <select id="theme-select" value={theme} onChange={e => setTheme(e.target.value)} className="custom-select">
            {THEMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Font */}
        <div className="control-group">
          <span className="control-label">Font</span>
          <button className="icon-btn" onClick={() => setFontSize(s => Math.max(10, s - 1))} id="font-decrease-btn">A-</button>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 22, textAlign: 'center' }}>{fontSize}</span>
          <button className="icon-btn" onClick={() => setFontSize(s => Math.min(24, s + 1))} id="font-increase-btn">A+</button>
        </div>

        {/* Feature Buttons */}
        <button className="action-btn" onClick={onToggleChallenge} id="challenge-btn" style={challengeActive ? activeStyle : {}}>🏆 Challenge</button>
        <button className="action-btn" onClick={onToggleMultiTest} id="multitest-btn" style={multiTestActive ? activeStyle : {}}>⚡ Multi-Test</button>
        <button className="action-btn" onClick={onToggleAnalysis} id="analysis-btn" style={analysisActive ? activeStyle : {}}>🔍 Analysis</button>
        <button className="action-btn" onClick={onToggleHistory} id="history-btn">
          🕐 History
          {historyCount > 0 && <span style={{ marginLeft: 4, padding: '0 5px', borderRadius: 99, background: 'rgba(124,92,252,0.25)', color: 'var(--accent-primary)', fontSize: 10, fontWeight: 700 }}>{historyCount}</span>}
        </button>
        <button className="action-btn" onClick={onShare} id="share-btn">🔗 Share</button>
      </div>

      {/* Run Button */}
      <div className="navbar-actions">
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Ctrl+Enter</span>
        <button id="run-btn" onClick={onRun} disabled={isLoading} className={`run-btn ${isLoading ? 'loading' : 'active'}`}>
          {isLoading ? <><div className="spinner" /><span>Running...</span></> : <><span>▶</span><span>Run Code</span></>}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
