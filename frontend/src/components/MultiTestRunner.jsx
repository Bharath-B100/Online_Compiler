import React, { useState, useCallback } from 'react';

let nextId = 1;
const newRow = () => ({ id: nextId++, stdin: '', expected: '', actual: '', status: 'idle', time: 0 });

const STATUS = {
  idle:    { icon: '○', color: 'var(--text-dim)' },
  running: { icon: '⏳', color: 'var(--accent-yellow)' },
  pass:    { icon: '✓', color: 'var(--accent-green)' },
  fail:    { icon: '✗', color: 'var(--accent-red)' },
  error:   { icon: '!', color: 'var(--accent-orange)' },
};

const MultiTestRunner = ({ onRunSingle, language }) => {
  const [rows, setRows] = useState([newRow(), newRow(), newRow()]);
  const [running, setRunning] = useState(false);

  const update = (id, field, val) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));

  const addRow = () => setRows(prev => [...prev, newRow()]);
  const removeRow = (id) => setRows(prev => prev.filter(r => r.id !== id));

  const runAll = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setRows(prev => prev.map(r => ({ ...r, status: 'running', actual: '', time: 0 })));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const start = Date.now();
      try {
        const result = await onRunSingle(row.stdin);
        const actual = (result.output || '').trim();
        const expected = row.expected.trim();
        const passed = expected === '' ? true : actual === expected;
        const time = Date.now() - start;
        setRows(prev => prev.map(r => r.id === row.id
          ? { ...r, status: passed ? 'pass' : 'fail', actual, time }
          : r
        ));
      } catch {
        setRows(prev => prev.map(r => r.id === row.id
          ? { ...r, status: 'error', actual: 'Connection error', time: Date.now() - start }
          : r
        ));
      }
    }
    setRunning(false);
  }, [rows, running, onRunSingle]);

  const exportCSV = () => {
    const csv = ['#,Input,Expected,Actual,Status,Time(ms)']
      .concat(rows.map((r, i) => `${i+1},"${r.stdin.replace(/"/g,'""')}","${r.expected}","${r.actual}",${r.status},${r.time}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'test_results.csv'; a.click();
  };

  const passCount = rows.filter(r => r.status === 'pass').length;
  const doneCount = rows.filter(r => r.status !== 'idle' && r.status !== 'running').length;

  return (
    <div className="stdin-panel" style={{ height: 240, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Header */}
      <div className="stdin-header" style={{ cursor: 'default' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--accent-secondary)' }}>
            ⚡ Multi-Test Runner
          </span>
          {doneCount > 0 && (
            <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 99, background: passCount === doneCount ? 'rgba(0,229,160,0.15)' : 'rgba(255,85,114,0.15)', border: `1px solid ${passCount === doneCount ? 'rgba(0,229,160,0.3)' : 'rgba(255,85,114,0.3)'}`, color: passCount === doneCount ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700 }}>
              {passCount}/{doneCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {doneCount > 0 && <button className="action-btn" onClick={exportCSV} style={{ fontSize: 10, padding: '2px 8px' }}>↓ CSV</button>}
          <button className="action-btn" onClick={addRow} style={{ fontSize: 10, padding: '2px 8px' }}>+ Add</button>
          <button onClick={runAll} disabled={running} style={{
            padding: '3px 12px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 700,
            background: running ? 'var(--bg-raised)' : 'linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))',
            color: running ? 'var(--text-dim)' : '#fff', cursor: running ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}>{running ? '⏳' : '▶ Run All'}</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--bg-base)' }}>
              <th style={{ width: 28, padding: '5px 8px', color: 'var(--text-dim)', textAlign: 'center', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)' }}>#</th>
              <th style={{ padding: '5px 8px', color: 'var(--text-dim)', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)' }}>Input (stdin)</th>
              <th style={{ padding: '5px 8px', color: 'var(--text-dim)', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)' }}>Expected</th>
              <th style={{ padding: '5px 8px', color: 'var(--text-dim)', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)' }}>Actual</th>
              <th style={{ width: 36, padding: '5px 4px', borderBottom: '1px solid var(--border-subtle)' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const s = STATUS[row.status];
              return (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '4px 8px', textAlign: 'center', color: s.color, fontWeight: 700 }}>{s.icon}</td>
                  <td style={{ padding: '3px 4px' }}>
                    <input value={row.stdin} onChange={e => update(row.id, 'stdin', e.target.value)}
                      placeholder="input..."
                      style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '3px 6px', color: 'var(--text-primary)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                    />
                  </td>
                  <td style={{ padding: '3px 4px' }}>
                    <input value={row.expected} onChange={e => update(row.id, 'expected', e.target.value)}
                      placeholder="(optional)"
                      style={{ width: '100%', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '3px 6px', color: 'var(--accent-green)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                    />
                  </td>
                  <td style={{ padding: '4px 8px', color: row.status === 'pass' ? 'var(--accent-green)' : row.status === 'fail' ? 'var(--accent-red)' : 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.actual || (row.status === 'running' ? '…' : '')}
                    {row.status !== 'idle' && row.status !== 'running' && <span style={{ fontSize: 9, color: 'var(--text-dim)', marginLeft: 4 }}>{row.time}ms</span>}
                  </td>
                  <td style={{ padding: '3px 4px', textAlign: 'center' }}>
                    {rows.length > 1 && (
                      <button onClick={() => removeRow(row.id)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13 }}>×</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MultiTestRunner;
