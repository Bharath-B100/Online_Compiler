import React, { useState } from 'react';
import { CHALLENGES } from './challengeData';

const DIFF = {
  easy:   { label: 'Easy',   color: '#00e5a0', bg: 'rgba(0,229,160,0.12)',  border: 'rgba(0,229,160,0.3)' },
  medium: { label: 'Medium', color: '#ffd166', bg: 'rgba(255,209,102,0.12)', border: 'rgba(255,209,102,0.3)' },
  hard:   { label: 'Hard',   color: '#ff5572', bg: 'rgba(255,85,114,0.12)',  border: 'rgba(255,85,114,0.3)' },
};

const ChallengePanel = ({ onClose, onLoadChallenge, onSubmit, isSubmitting, results, activeChallenge }) => {
  const [view, setView] = useState('list'); // 'list' | 'detail'
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? CHALLENGES : CHALLENGES.filter(c => c.difficulty === filter);

  const openChallenge = (c) => { setSelected(c); setView('detail'); };

  const passCount = results ? results.filter(r => r.passed).length : 0;
  const allPassed = results && results.length > 0 && passCount === results.length;

  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 360,
      background: 'rgba(10,14,26,0.98)', borderRight: '1px solid var(--border-medium)',
      display: 'flex', flexDirection: 'column', zIndex: 40,
      animation: 'slideInLeft 0.25s cubic-bezier(0.4,0,0.2,1)',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {view === 'detail' && (
            <button className="icon-btn" onClick={() => { setView('list'); setSelected(null); }} style={{ fontSize: 14 }}>←</button>
          )}
          <span style={{ fontSize: 14 }}>🏆</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            {view === 'list' ? 'Challenge Mode' : selected?.title}
          </span>
        </div>
        <button className="icon-btn" onClick={onClose} style={{ fontSize: 15 }}>×</button>
      </div>

      {view === 'list' ? (
        <>
          {/* Filter */}
          <div style={{ display: 'flex', gap: 6, padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            {['all', 'easy', 'medium', 'hard'].map(d => (
              <button key={d} onClick={() => setFilter(d)} style={{
                padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                textTransform: 'capitalize', border: `1px solid ${filter === d ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                background: filter === d ? 'rgba(124,92,252,0.2)' : 'var(--bg-raised)',
                color: filter === d ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}>{d === 'all' ? 'All' : DIFF[d].label}</button>
            ))}
          </div>

          {/* Challenge List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(c => {
              const d = DIFF[c.difficulty];
              const isActive = activeChallenge?.id === c.id;
              return (
                <div key={c.id} onClick={() => openChallenge(c)} style={{
                  padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer', background: isActive ? 'rgba(124,92,252,0.08)' : 'transparent',
                  transition: 'background 0.15s',
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,92,252,0.06)'}
                   onMouseLeave={e => e.currentTarget.style.background = isActive ? 'rgba(124,92,252,0.08)' : 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.id}. {c.title}
                    </span>
                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, background: d.bg, border: `1px solid ${d.border}`, color: d.color, fontWeight: 700 }}>
                      {d.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{c.category} · {c.testCases.length} test cases</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Detail View */
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {selected && (
            <>
              {/* Difficulty Badge */}
              <div style={{ padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
                <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: DIFF[selected.difficulty].bg, border: `1px solid ${DIFF[selected.difficulty].border}`, color: DIFF[selected.difficulty].color, fontWeight: 700 }}>
                  {DIFF[selected.difficulty].label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{selected.category}</span>
              </div>

              {/* Description */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
                <p style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.7, margin: 0 }}>{selected.description}</p>
              </div>

              {/* Examples */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Examples</div>
                {selected.examples.map((ex, i) => (
                  <div key={i} style={{ marginBottom: 8, background: 'var(--bg-base)', borderRadius: 6, padding: '8px 10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>Input:</div>
                    <pre style={{ fontSize: 11, color: 'var(--accent-secondary)', margin: '0 0 6px 0', fontFamily: 'JetBrains Mono, monospace' }}>{ex.input === '(none)' ? '(no input)' : ex.input}</pre>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>Output:</div>
                    <pre style={{ fontSize: 11, color: 'var(--accent-green)', margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>{ex.output}</pre>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Constraints</div>
                {selected.constraints.map((c, i) => (
                  <div key={i} style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 3 }}>• {c}</div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ padding: '12px 16px', display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => onLoadChallenge(selected)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--border-medium)',
                  background: 'var(--bg-raised)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>📋 Load Starter Code</button>
                <button onClick={() => onSubmit(selected)} disabled={isSubmitting} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                  background: isSubmitting ? 'var(--bg-raised)' : 'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))',
                  color: isSubmitting ? 'var(--text-dim)' : '#fff', fontSize: 12, fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif',
                  boxShadow: isSubmitting ? 'none' : '0 0 16px rgba(124,92,252,0.4)',
                }}>{isSubmitting ? '⏳ Running...' : '▶ Submit'}</button>
              </div>

              {/* Test Results */}
              {results && (
                <div style={{ padding: '0 16px 16px 16px', flex: 1 }}>
                  {/* Score bar */}
                  <div style={{
                    padding: '10px 14px', borderRadius: 8, marginBottom: 10,
                    background: allPassed ? 'rgba(0,229,160,0.1)' : 'rgba(255,85,114,0.1)',
                    border: `1px solid ${allPassed ? 'rgba(0,229,160,0.3)' : 'rgba(255,85,114,0.3)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: allPassed ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {allPassed ? '🎉 All Tests Passed!' : `${passCount}/${results.length} Tests Passed`}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{passCount}/{results.length}</span>
                  </div>

                  {/* Individual results */}
                  {results.map((r, i) => (
                    <div key={i} style={{
                      padding: '8px 10px', marginBottom: 6, borderRadius: 6,
                      background: r.passed ? 'rgba(0,229,160,0.07)' : 'rgba(255,85,114,0.07)',
                      border: `1px solid ${r.passed ? 'rgba(0,229,160,0.2)' : 'rgba(255,85,114,0.2)'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: r.passed ? 0 : 6 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: r.passed ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                          {r.passed ? '✓' : '✗'} Test {r.id}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{r.time}ms</span>
                      </div>
                      {!r.passed && (
                        <div style={{ fontSize: 10.5, fontFamily: 'JetBrains Mono, monospace' }}>
                          <div style={{ color: 'var(--accent-green)', marginBottom: 2 }}>Expected: {r.expected.slice(0, 40)}</div>
                          <div style={{ color: 'var(--accent-red)' }}>Got: {(r.actual || '(no output)').slice(0, 40)}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengePanel;
