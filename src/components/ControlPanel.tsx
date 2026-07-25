import { useVennState, ValueFormatMode } from '../hooks/useVennState';

type Props = ReturnType<typeof useVennState>;

const REGION_KEYS_2 = ['A', 'B', 'AB'] as const;
const REGION_KEYS_3 = ['A', 'B', 'C', 'AB', 'BC', 'CA', 'ABC'] as const;

export function ControlPanel(props: Props) {
  const {
    setsCount, handleToggleSetsCount,
    labelA, setLabelA, labelB, setLabelB, labelC, setLabelC,
    valA, setValA, valB, setValB, valC, setValC,
    valAB, setValAB, valBC, setValBC, valCA, setValCA, valABC, setValABC,
    valueFormatMode, setValueFormatMode,
  } = props;

  const regionRows = [
    { label: `${labelA} only`, val: valA, set: setValA },
    { label: `${labelB} only`, val: valB, set: setValB },
    ...(setsCount === 3 ? [{ label: `${labelC} only`, val: valC, set: setValC }] : []),
    { label: `${labelA} ∩ ${labelB}`, val: valAB, set: setValAB },
    ...(setsCount === 3 ? [
      { label: `${labelB} ∩ ${labelC}`, val: valBC, set: setValBC },
      { label: `${labelC} ∩ ${labelA}`, val: valCA, set: setValCA },
      { label: `${labelA} ∩ ${labelB} ∩ ${labelC}`, val: valABC, set: setValABC },
    ] : []),
  ];

  return (
    <section className="panel control-panel">
      <h2>Data</h2>

      {/* Diagram type */}
      <div className="control-group">
        <label>Diagram Type</label>
        <div className="tabs">
          {([2, 3] as const).map(n => (
            <button
              key={n}
              className={`tab-btn ${setsCount === n ? 'active' : ''}`}
              onClick={() => handleToggleSetsCount(n)}
            >
              {n}-Set Venn
            </button>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="control-group">
        <label>Set Labels</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input className="input-field" type="text" value={labelA} onChange={e => setLabelA(e.target.value)} placeholder="Set A" />
          <input className="input-field" type="text" value={labelB} onChange={e => setLabelB(e.target.value)} placeholder="Set B" />
          {setsCount === 3 && (
            <input className="input-field" type="text" value={labelC} onChange={e => setLabelC(e.target.value)} placeholder="Set C" />
          )}
        </div>
      </div>

      {/* Region values */}
      <div className="control-group">
        <label>Region Values</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {regionRows.map(({ label, val, set }) => (
            <div key={label} className="input-grid">
              <input className="input-field" type="text" value={label} disabled style={{ opacity: 0.6 }} />
              <input
                className="input-field"
                type="number"
                value={val}
                min={0}
                onChange={e => set(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Value format */}
      <div className="control-group">
        <label>Value Format</label>
        <div className="tabs" style={{ flexWrap: 'wrap', gap: '6px' }}>
          {(['raw', 'locale', 'k', 'percent'] as ValueFormatMode[]).map(m => (
            <button
              key={m}
              className={`tab-btn ${valueFormatMode === m ? 'active' : ''}`}
              onClick={() => setValueFormatMode(m)}
              style={{ flex: '1 1 40%', fontSize: '0.8rem' }}
            >
              {m === 'raw' ? 'Raw (42)' : m === 'locale' ? 'Locale (1,000)' : m === 'k' ? 'K (1k)' : '% of Total'}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export { REGION_KEYS_2, REGION_KEYS_3 };
