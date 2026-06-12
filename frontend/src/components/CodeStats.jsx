import React, { useMemo } from 'react';

/**
 * CodeStats — live stats bar shown at the bottom of the editor pane.
 * Shows: lines, characters, words, estimated execution complexity.
 */
const COMPLEXITY_LABELS = [
  { max: 5,   label: 'Simple',   color: 'var(--accent-green)' },
  { max: 15,  label: 'Moderate', color: 'var(--accent-yellow)' },
  { max: 30,  label: 'Complex',  color: 'var(--accent-orange)' },
  { max: Infinity, label: 'Very Complex', color: 'var(--accent-red)' },
];

function estimateComplexity(code) {
  // McCabe cyclomatic-complexity approximation:
  // count branches: if, else if, for, while, case, &&, ||, ?, catch
  const patterns = [
    /\bif\b/g, /\bfor\b/g, /\bwhile\b/g, /\bcase\b/g,
    /\bcatch\b/g, /&&/g, /\|\|/g, /\?(?!=)/g, /\belif\b/g,
  ];
  let count = 1; // base complexity
  for (const p of patterns) {
    count += (code.match(p) || []).length;
  }
  return count;
}

const CodeStats = ({ code, language }) => {
  const stats = useMemo(() => {
    const lines = code.split('\n').length;
    const chars = code.length;
    const words = code.trim() ? code.trim().split(/\s+/).length : 0;
    const nonEmpty = code.split('\n').filter(l => l.trim()).length;
    const complexity = estimateComplexity(code);
    const label = COMPLEXITY_LABELS.find(c => complexity <= c.max);
    return { lines, chars, words, nonEmpty, complexity, label };
  }, [code]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      padding: '4px 12px',
      background: 'var(--bg-base)',
      borderTop: '1px solid var(--border-subtle)',
      fontSize: 10.5,
      color: 'var(--text-dim)',
      flexShrink: 0,
      userSelect: 'none',
      flexWrap: 'wrap',
      gap: 16,
    }}>
      <span title="Total lines"><span style={{ color: 'var(--text-secondary)' }}>Lines: </span>{stats.lines}</span>
      <span title="Non-empty lines"><span style={{ color: 'var(--text-secondary)' }}>Code: </span>{stats.nonEmpty}</span>
      <span title="Characters"><span style={{ color: 'var(--text-secondary)' }}>Chars: </span>{stats.chars}</span>
      <span title="Cyclomatic complexity estimate" style={{ marginLeft: 'auto' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Complexity: </span>
        <span style={{ color: stats.label.color, fontWeight: 700 }}>{stats.label.label} ({stats.complexity})</span>
      </span>
      <span style={{ color: 'var(--text-dim)', opacity: 0.5 }}>|</span>
      <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.4px', fontSize: 9.5 }}>
        {language}
      </span>
    </div>
  );
};

export default CodeStats;
