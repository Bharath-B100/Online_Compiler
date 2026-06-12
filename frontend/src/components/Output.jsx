import React, { useRef, useEffect, useState } from 'react';
import SmartOutputRenderer from './SmartOutputRenderer';

const OutputPanel = ({ output, isLoading, executionStats, language, onClear }) => {
  const contentRef = useRef(null);
  const [smartMode, setSmartMode] = useState(true);

  useEffect(() => {
    if (contentRef.current && output) contentRef.current.scrollTop = contentRef.current.scrollHeight;
  }, [output]);

  const copyOutput = () => {
    const text = [output?.stdout, output?.stderr].filter(Boolean).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="output-panel" style={{ height: '100%' }}>
      {/* Header */}
      <div className="pane-header">
        <div className="pane-title">
          <span className="dot" style={{ background: 'var(--accent-secondary)', boxShadow: '0 0 6px var(--accent-secondary)' }} />
          Output Console
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Smart Mode Toggle */}
          <button
            onClick={() => setSmartMode(v => !v)}
            title={smartMode ? 'Switch to Raw terminal' : 'Switch to Smart renderer'}
            style={{
              padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${smartMode ? 'var(--accent-secondary)' : 'var(--border-subtle)'}`,
              background: smartMode ? 'rgba(0,212,255,0.1)' : 'var(--bg-raised)',
              color: smartMode ? 'var(--accent-secondary)' : 'var(--text-dim)',
              fontFamily: 'Inter, sans-serif',
            }}
          >✨ Smart</button>
          {output && (
            <>
              <button className="icon-btn" onClick={copyOutput} title="Copy output" id="copy-output-btn">📋</button>
              <button className="icon-btn" onClick={onClear} title="Clear" id="clear-output-btn">🗑</button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="output-content" ref={contentRef}>
        {isLoading ? (
          <div style={{ paddingTop: 8 }}>
            <div style={{ color: 'var(--accent-secondary)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', marginBottom: 12 }}>
              $ executing {language} code...
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="spinner" />
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Running</span>
              <span className="cursor-blink" />
            </div>
          </div>
        ) : output ? (
          <SmartOutputRenderer output={output} smartMode={smartMode} />
        ) : (
          <div className="output-empty">
            <div className="icon">⌨️</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, marginBottom: 4, color: 'var(--text-secondary)' }}>Ready to execute</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                Press <kbd style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '1px 5px', fontSize: 10 }}>Ctrl+Enter</kbd> or click <strong>▶ Run Code</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {executionStats && !isLoading && (
        <div className="stats-bar">
          <span className={`stat-badge ${executionStats.success ? 'success' : 'error'}`}>
            {executionStats.success ? '✓ Success' : '✗ Error'}
          </span>
          <span className="stat-badge neutral">⏱ {executionStats.executionTime}ms</span>
          <span className="stat-badge neutral">Exit: {executionStats.exitCode}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{new Date().toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};

export default OutputPanel;
