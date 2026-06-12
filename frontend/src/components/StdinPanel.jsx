import React, { useState } from 'react';

const StdinPanel = ({ stdin, setStdin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="stdin-panel">
      {/* Collapsible Header */}
      <div className="stdin-header" onClick={() => setIsOpen(v => !v)} id="stdin-toggle">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--accent-orange)', fontWeight: 600 }}>
            {isOpen ? '▼' : '▶'}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-secondary)' }}>
            Standard Input (stdin)
          </span>
          {stdin.trim() && (
            <span style={{
              fontSize: 9,
              padding: '1px 6px',
              borderRadius: 99,
              background: 'rgba(255,140,66,0.15)',
              border: '1px solid rgba(255,140,66,0.3)',
              color: 'var(--accent-orange)',
              fontWeight: 700,
            }}>
              ACTIVE
            </span>
          )}
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
          {isOpen ? 'Click to collapse' : 'Click to expand'}
        </span>
      </div>

      {/* Textarea */}
      {isOpen && (
        <div style={{ padding: '0 0 8px 0' }}>
          <textarea
            id="stdin-textarea"
            className="stdin-textarea"
            value={stdin}
            onChange={e => setStdin(e.target.value)}
            placeholder="Enter program input here (one value per line)..."
            rows={4}
            spellCheck={false}
            autoComplete="off"
          />
          {stdin.trim() && (
            <div style={{ padding: '0 14px' }}>
              <button
                style={{
                  fontSize: 10,
                  color: 'var(--text-dim)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 0',
                  fontFamily: 'Inter, sans-serif',
                }}
                onClick={() => setStdin('')}
              >
                × Clear input
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StdinPanel;
