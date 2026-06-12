import React, { useMemo, useState } from 'react';

// ── Type Detection ────────────────────────────────────────────────
function detectType(raw) {
  const s = raw.trim();
  if (!s) return 'empty';

  // JSON
  try {
    const parsed = JSON.parse(s);
    if (typeof parsed === 'object' && parsed !== null) return 'json';
  } catch {}

  const lines = s.split('\n').map(l => l.trim()).filter(Boolean);

  // Pure numbers chart (≥2 lines, each a number)
  if (lines.length >= 2 && lines.every(l => /^-?\d+(\.\d+)?$/.test(l))) return 'chart';

  // CSV / pipe table (≥2 lines with consistent separators)
  const hasPipe = lines.length >= 2 && lines.every(l => l.includes('|'));
  const hasTabs = lines.length >= 2 && lines.every(l => l.includes('\t'));
  if (hasPipe || hasTabs) return 'table';

  // Key: Value (every line has ": ")
  if (lines.length >= 2 && lines.every(l => /^[\w\s]+:\s/.test(l))) return 'properties';

  return 'terminal';
}

// ── JSON Renderer ─────────────────────────────────────────────────
function JsonRenderer({ raw }) {
  const obj = JSON.parse(raw.trim());
  const text = JSON.stringify(obj, null, 2);

  const colorize = (s) => s
    .replace(/"([^"]+)":/g, '<span style="color:#7c5cfc">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span style="color:#00e5a0">"$1"</span>')
    .replace(/: (-?\d+\.?\d*)/g, ': <span style="color:#ffd166">$1</span>')
    .replace(/: (true|false|null)/g, ': <span style="color:#00d4ff">$1</span>');

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ fontSize: 10, color: 'var(--accent-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{ }</span> <span>JSON</span>
      </div>
      <pre
        style={{ fontSize: 12, lineHeight: 1.7, margin: 0, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap' }}
        dangerouslySetInnerHTML={{ __html: colorize(text) }}
      />
    </div>
  );
}

// ── Bar Chart Renderer ────────────────────────────────────────────
function ChartRenderer({ raw }) {
  const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const nums = lines.map(Number);
  const max = Math.max(...nums.map(Math.abs));

  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--accent-secondary)', marginBottom: 10 }}>📊 Number Chart</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {nums.map((n, i) => {
          const pct = max === 0 ? 0 : Math.abs(n) / max * 100;
          const positive = n >= 0;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--text-dim)', minWidth: 18, textAlign: 'right' }}>{i + 1}</span>
              <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: positive ? 'linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))' : 'linear-gradient(90deg,var(--accent-red),var(--accent-orange))',
                  borderRadius: 3,
                  transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                  animation: 'barGrow 0.6s cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
              <span style={{ fontSize: 11, color: positive ? 'var(--accent-green)' : 'var(--accent-red)', minWidth: 48, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{n}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Table Renderer ────────────────────────────────────────────────
function TableRenderer({ raw }) {
  const lines = raw.trim().split('\n');
  const sep = lines[0].includes('|') ? '|' : '\t';
  const rows = lines.map(l => l.split(sep).map(c => c.trim()).filter((c, i, a) => !(i === 0 && !c) && !(i === a.length - 1 && !c)));
  const headers = rows[0];
  const body = rows.slice(1).filter(r => !r.every(c => /^[-=]+$/.test(c)));

  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--accent-secondary)', marginBottom: 8 }}>⊞ Table</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: 12, width: '100%' }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ padding: '6px 12px', textAlign: 'left', background: 'rgba(124,92,252,0.15)', border: '1px solid var(--border-subtle)', color: 'var(--accent-primary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: '5px 12px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Properties Renderer ───────────────────────────────────────────
function PropertiesRenderer({ raw }) {
  const lines = raw.trim().split('\n').filter(Boolean);
  const pairs = lines.map(l => {
    const idx = l.indexOf(': ');
    return [l.slice(0, idx), l.slice(idx + 2)];
  });

  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--accent-secondary)', marginBottom: 8 }}>⊟ Properties</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {pairs.map(([k, v], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, color: 'var(--accent-primary)', fontFamily: 'JetBrains Mono, monospace', minWidth: 100, flexShrink: 0 }}>{k}</span>
            <span style={{ fontSize: 11, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Terminal Renderer ─────────────────────────────────────────────
function TerminalRenderer({ stdout, stderr }) {
  return (
    <div>
      {stdout && <pre className="output-stdout" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{stdout}</pre>}
      {stderr && <pre className="output-stderr" style={{ whiteSpace: 'pre-wrap', marginTop: stdout ? 12 : 0 }}>{stderr}</pre>}
      {!stdout && !stderr && <span className="output-info">Code executed with no output.</span>}
    </div>
  );
}

// ── Main Smart Renderer ───────────────────────────────────────────
const SmartOutputRenderer = ({ output, smartMode }) => {
  if (!output) return null;
  const { stdout = '', stderr = '' } = output;

  // Always show stderr in terminal style
  if (stderr && !stdout) return <TerminalRenderer stdout="" stderr={stderr} />;

  if (!smartMode || !stdout.trim()) return <TerminalRenderer stdout={stdout} stderr={stderr} />;

  const type = detectType(stdout);

  if (type === 'json')       return <>{stderr && <pre className="output-stderr" style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{stderr}</pre>}<JsonRenderer raw={stdout} /></>;
  if (type === 'chart')      return <ChartRenderer raw={stdout} />;
  if (type === 'table')      return <TableRenderer raw={stdout} />;
  if (type === 'properties') return <PropertiesRenderer raw={stdout} />;
  return <TerminalRenderer stdout={stdout} stderr={stderr} />;
};

export default SmartOutputRenderer;
