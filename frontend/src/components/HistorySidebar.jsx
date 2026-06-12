import React from 'react';

const LANG_COLORS = {
  javascript: '#f7df1e',
  python:     '#3776ab',
  java:       '#f89820',
  c:          '#a8b9cc',
  cpp:        '#00599c',
  typescript: '#3178c6',
  go:         '#00add8',
  php:        '#8892be',
  ruby:       '#cc342d',
};

const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)   return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  return `${Math.round(diff / 3600)}h ago`;
};

const HistorySidebar = ({ history, onRestore, onClearHistory, onClose }) => {
  return (
    <div className="history-sidebar">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🕐</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            History
          </span>
          <span style={{
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 99,
            background: 'rgba(124,92,252,0.2)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent-primary)',
            fontWeight: 700,
          }}>
            {history.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {history.length > 0 && (
            <button
              className="icon-btn"
              onClick={onClearHistory}
              title="Clear history"
              style={{ fontSize: 11 }}
            >
              🗑
            </button>
          )}
          <button
            className="icon-btn"
            onClick={onClose}
            title="Close"
            style={{ fontSize: 14 }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {history.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 8,
            color: 'var(--text-dim)',
            fontSize: 12,
          }}>
            <span style={{ fontSize: 28 }}>📭</span>
            No runs yet
          </div>
        ) : (
          history.map((entry, i) => (
            <div
              key={entry.id || i}
              className="history-item"
              onClick={() => onRestore(entry)}
              title="Click to restore this code"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div className="history-item-lang" style={{ color: LANG_COLORS[entry.language] || 'var(--text-secondary)' }}>
                  {entry.language.toUpperCase()}
                </div>
                <span style={{
                  fontSize: 9,
                  padding: '1px 5px',
                  borderRadius: 99,
                  background: entry.success
                    ? 'rgba(0,229,160,0.12)' : 'rgba(255,85,114,0.12)',
                  border: `1px solid ${entry.success ? 'rgba(0,229,160,0.3)' : 'rgba(255,85,114,0.3)'}`,
                  color: entry.success ? 'var(--accent-green)' : 'var(--accent-red)',
                  fontWeight: 700,
                }}>
                  {entry.success ? '✓' : '✗'}
                </span>
              </div>
              <div className="history-item-preview">
                {entry.code.trim().split('\n')[0].slice(0, 60) || '(empty)'}
              </div>
              <div className="history-item-time" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span>{timeAgo(entry.timestamp)}</span>
                <span>{entry.executionTime}ms</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
