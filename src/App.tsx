import { useState, useMemo } from 'react';
import { VennDiagram, VennColors, formatVennDiagramCode } from 'react-venn';

type ThemePresetName = 'classic' | 'pastel' | 'dark' | 'sunset' | 'emerald';
type ValueFormatMode = 'raw' | 'locale' | 'k' | 'percent';

const THEME_PREVIEWS: Record<ThemePresetName, string[]> = {
  classic: ['#3b82f6', '#ef4444', '#eab308'],
  pastel: ['#cbd5e1', '#fecdd3', '#fef9c3'],
  dark: ['#0ea5e9', '#ec4899', '#a855f7'],
  sunset: ['#f43f5e', '#f97316', '#eab308'],
  emerald: ['#059669', '#0d9488', '#10b981'],
};

const REGION_KEYS_2 = ['A', 'B', 'AB'] as const;
const REGION_KEYS_3 = ['A', 'B', 'C', 'AB', 'BC', 'CA', 'ABC'] as const;

export default function App() {
  // ── Set count ──────────────────────────────────────────────────────────
  const [setsCount, setSetsCount] = useState<2 | 3>(3);

  // ── Labels ─────────────────────────────────────────────────────────────
  const [labelA, setLabelA] = useState('React');
  const [labelB, setLabelB] = useState('TypeScript');
  const [labelC, setLabelC] = useState('CSS');

  // ── Values ─────────────────────────────────────────────────────────────
  const [valA, setValA]     = useState(12);
  const [valB, setValB]     = useState(15);
  const [valC, setValC]     = useState(10);
  const [valAB, setValAB]   = useState(4);
  const [valBC, setValBC]   = useState(5);
  const [valCA, setValCA]   = useState(3);
  const [valABC, setValABC] = useState(2);

  // ── Layout ─────────────────────────────────────────────────────────────
  const [spacing, setSpacing]         = useState(0.5);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillOpacity, setFillOpacity] = useState(0.6);
  const [fontSize, setFontSize]       = useState(13);

  // ── Theme ──────────────────────────────────────────────────────────────
  const [selectedTheme, setSelectedTheme] = useState<ThemePresetName>('classic');
  const [strokeColor, setStrokeColor]           = useState('#ffffff');
  const [hoverStrokeColor, setHoverStrokeColor] = useState('#1e293b');

  // ── Per-region color overrides ─────────────────────────────────────────
  const [colorOverrides, setColorOverrides] = useState<VennColors>({});

  const updateColorOverride = (key: string, val: string) => {
    setColorOverrides(prev => ({ ...prev, [key]: val }));
  };
  const clearColorOverride = (key: string) => {
    setColorOverrides(prev => {
      const next = { ...prev };
      delete next[key as keyof VennColors];
      return next;
    });
  };

  // ── Value format ───────────────────────────────────────────────────────
  const [valueFormatMode, setValueFormatMode] = useState<ValueFormatMode>('raw');

  const totalForPercent = useMemo(() => {
    if (setsCount === 2) return valA + valB + valAB;
    return valA + valB + valC + valAB + valBC + valCA + valABC;
  }, [setsCount, valA, valB, valC, valAB, valBC, valCA, valABC]);

  const valueFormat = useMemo(() => {
    switch (valueFormatMode) {
      case 'locale':   return (v: number) => v.toLocaleString();
      case 'k':        return (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
      case 'percent':  return (v: number) => totalForPercent > 0 ? `${Math.round((v / totalForPercent) * 100)}%` : '0%';
      default:         return undefined;
    }
  }, [valueFormatMode, totalForPercent]);

  // ── Visibility ─────────────────────────────────────────────────────────
  const [showLabels, setShowLabels]   = useState(true);
  const [showValues, setShowValues]   = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [animated, setAnimated]       = useState(true);
  const [animationDuration, setAnimationDuration] = useState(200);

  const [copied, setCopied] = useState(false);

  // ── Derived data ───────────────────────────────────────────────────────
  const data = useMemo(() => {
    if (setsCount === 2) {
      return [
        { name: labelA, sets: ['A'], value: valA },
        { name: labelB, sets: ['B'], value: valB },
        { name: `${labelA} & ${labelB}`, sets: ['A', 'B'], value: valAB },
      ];
    }
    return [
      { name: labelA, sets: ['A'], value: valA },
      { name: labelB, sets: ['B'], value: valB },
      { name: labelC, sets: ['C'], value: valC },
      { name: `${labelA} & ${labelB}`, sets: ['A', 'B'], value: valAB },
      { name: `${labelB} & ${labelC}`, sets: ['B', 'C'], value: valBC },
      { name: `${labelC} & ${labelA}`, sets: ['A', 'C'], value: valCA },
      { name: `${labelA} & ${labelB} & ${labelC}`, sets: ['A', 'B', 'C'], value: valABC },
    ];
  }, [setsCount, labelA, labelB, labelC, valA, valB, valC, valAB, valBC, valCA, valABC]);

  // ── Code export ────────────────────────────────────────────────────────
  const exportedCode = useMemo(() => {
    return formatVennDiagramCode({
      setsCount,
      data,
      theme: selectedTheme,
      colors: Object.keys(colorOverrides).length > 0 ? colorOverrides : undefined,
      spacing,
      strokeWidth,
      fillOpacity,
      fontSize,
      strokeColor,
      hoverStrokeColor,
      showLabels,
      showValues,
      showTooltip,
      animated,
      animationDuration,
    }, {
      includeValueFormat: valueFormatMode !== 'raw'
    });
  }, [setsCount, data, selectedTheme, colorOverrides, spacing, strokeWidth, fillOpacity, fontSize,
      strokeColor, hoverStrokeColor, showLabels, showValues, showTooltip,
      animated, animationDuration, valueFormatMode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSetsCount = (count: 2 | 3) => {
    setSetsCount(count);
    setSpacing(count === 2 ? 0.55 : 0.5);
  };

  const activeRegionKeys = setsCount === 2
    ? (REGION_KEYS_2 as readonly string[])
    : (REGION_KEYS_3 as readonly string[]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-title-group">
          <h1>react-venn</h1>
          <div className="app-subtitle">Premium, interactive Venn diagrams for React applications</div>
        </div>
        <a
          href="https://github.com/tonytomk/react-venn"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          GitHub
        </a>
      </header>

      <main className="dashboard-grid">
        {/* ── Left Panel: Data ─────────────────────────────────────────── */}
        <section className="panel control-panel">
          <h2>Data</h2>

          {/* Diagram Type Toggle */}
          <div className="control-group">
            <label>Diagram Type</label>
            <div className="tabs">
              <button className={`tab-btn ${setsCount === 2 ? 'active' : ''}`} onClick={() => handleToggleSetsCount(2)}>
                2-Set Venn
              </button>
              <button className={`tab-btn ${setsCount === 3 ? 'active' : ''}`} onClick={() => handleToggleSetsCount(3)}>
                3-Set Venn
              </button>
            </div>
          </div>

          {/* Set Labels */}
          <div className="control-group">
            <label>Set Labels</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="text" className="input-field" value={labelA} onChange={e => setLabelA(e.target.value)} placeholder="Set A" />
              <input type="text" className="input-field" value={labelB} onChange={e => setLabelB(e.target.value)} placeholder="Set B" />
              {setsCount === 3 && (
                <input type="text" className="input-field" value={labelC} onChange={e => setLabelC(e.target.value)} placeholder="Set C" />
              )}
            </div>
          </div>

          {/* Region Values */}
          <div className="control-group">
            <label>Region Values</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: `${labelA} only`, val: valA, set: setValA },
                { label: `${labelB} only`, val: valB, set: setValB },
                ...(setsCount === 3 ? [{ label: `${labelC} only`, val: valC, set: setValC }] : []),
                { label: `${labelA} ∩ ${labelB}`, val: valAB, set: setValAB },
                ...(setsCount === 3 ? [
                  { label: `${labelB} ∩ ${labelC}`, val: valBC, set: setValBC },
                  { label: `${labelC} ∩ ${labelA}`, val: valCA, set: setValCA },
                  { label: `${labelA} ∩ ${labelB} ∩ ${labelC}`, val: valABC, set: setValABC },
                ] : []),
              ].map(({ label, val, set }) => (
                <div key={label} className="input-grid">
                  <input type="text" className="input-field" value={label} disabled style={{ opacity: 0.6 }} />
                  <input
                    type="number"
                    className="input-field"
                    value={val}
                    min={0}
                    onChange={e => set(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Value Format */}
          <div className="control-group">
            <label>Value Format</label>
            <div className="tabs" style={{ flexWrap: 'wrap', gap: '6px' }}>
              {(['raw', 'locale', 'k', 'percent'] as ValueFormatMode[]).map(m => (
                <button key={m} className={`tab-btn ${valueFormatMode === m ? 'active' : ''}`} onClick={() => setValueFormatMode(m)} style={{ flex: '1 1 40%' }}>
                  {m === 'raw' ? 'Raw (42)' : m === 'locale' ? 'Locale (42,000)' : m === 'k' ? 'K (42k)' : '% of Total'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Center Panel: Canvas ─────────────────────────────────────── */}
        <section className="panel canvas-panel">
          <h2>Visualization Canvas</h2>
          <div className="venn-wrapper">
            <VennDiagram
              setsCount={setsCount}
              data={data}
              theme={selectedTheme}
              colors={Object.keys(colorOverrides).length > 0 ? colorOverrides : undefined}
              width={400}
              height={400}
              spacing={spacing}
              strokeWidth={strokeWidth}
              strokeColor={strokeColor}
              hoverStrokeColor={hoverStrokeColor}
              fillOpacity={fillOpacity}
              hoverOpacity={0.9}
              fontSize={fontSize}
              showLabels={showLabels}
              showValues={showValues}
              showTooltip={showTooltip}
              animated={animated}
              animationDuration={animationDuration}
              valueFormat={valueFormat}
            />
          </div>
        </section>

        {/* ── Right Panel: Style ───────────────────────────────────────── */}
        <section className="panel side-panel">
          <h2>Style &amp; Layout</h2>

          {/* Theme presets */}
          <div className="control-group">
            <label>Color Theme</label>
            <div className="themes-grid">
              {(Object.keys(THEME_PREVIEWS) as ThemePresetName[]).map(t => (
                <div key={t} className={`theme-card ${selectedTheme === t ? 'active' : ''}`} onClick={() => setSelectedTheme(t)}>
                  <div className="theme-card-name">{t}</div>
                  <div className="theme-preview-colors">
                    {THEME_PREVIEWS[t].map((c, i) => <div key={i} className="color-dot" style={{ backgroundColor: c }} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-region color overrides */}
          <div className="control-group">
            <label>Per-Region Colors <span style={{ fontWeight: 400, opacity: 0.6, fontSize: '11px' }}>(overrides theme)</span></label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeRegionKeys.map(key => {
                const override = colorOverrides[key as keyof VennColors];
                return (
                  <div key={key} className="input-grid" style={{ alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'monospace', minWidth: '36px' }}>{key}</span>
                    <input
                      type="color"
                      value={override || '#888888'}
                      onChange={e => updateColorOverride(key, e.target.value)}
                      style={{ width: '36px', height: '28px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none', padding: 0 }}
                    />
                    {override ? (
                      <button
                        onClick={() => clearColorOverride(key)}
                        style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      >
                        reset
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', paddingLeft: '4px' }}>theme default</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stroke colors */}
          <div className="control-group">
            <label>Stroke Colors</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="input-grid" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Border</span>
                <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} style={{ width: '36px', height: '28px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none', padding: 0 }} />
                <code style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{strokeColor}</code>
              </div>
              <div className="input-grid" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hover</span>
                <input type="color" value={hoverStrokeColor} onChange={e => setHoverStrokeColor(e.target.value)} style={{ width: '36px', height: '28px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none', padding: 0 }} />
                <code style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{hoverStrokeColor}</code>
              </div>
            </div>
          </div>

          {/* Sliders */}
          {[
            { label: 'Overlap Spacing', val: spacing, set: setSpacing, min: setsCount === 2 ? 0.1 : 0.2, max: setsCount === 2 ? 0.9 : 0.7, step: 0.01, display: spacing.toFixed(2) },
            { label: 'Fill Opacity', val: fillOpacity, set: setFillOpacity, min: 0.1, max: 0.95, step: 0.05, display: fillOpacity.toFixed(2) },
            { label: 'Border Width', val: strokeWidth, set: setStrokeWidth, min: 0, max: 6, step: 1, display: `${strokeWidth}px` },
            { label: 'Font Size', val: fontSize, set: setFontSize, min: 9, max: 20, step: 1, display: `${fontSize}px` },
            { label: 'Animation Duration', val: animationDuration, set: setAnimationDuration, min: 0, max: 1000, step: 50, display: `${animationDuration}ms` },
          ].map(({ label, val, set, min, max, step, display }) => (
            <div className="control-group" key={label}>
              <div className="range-slider-group">
                <div className="range-header">
                  <span>{label}</span>
                  <span>{display}</span>
                </div>
                <input type="range" className="range-slider" min={min} max={max} step={step} value={val} onChange={e => set(parseFloat(e.target.value) as never)} />
              </div>
            </div>
          ))}

          {/* Toggles */}
          <div className="control-group" style={{ gap: '12px' }}>
            {[
              { label: 'Show Set Labels', val: showLabels, set: setShowLabels },
              { label: 'Show Region Values', val: showValues, set: setShowValues },
              { label: 'Show Tooltip', val: showTooltip, set: setShowTooltip },
              { label: 'Animated Transitions', val: animated, set: setAnimated },
            ].map(({ label, val, set }) => (
              <div key={label} className="switch-row">
                <span className="switch-label">{label}</span>
                <label className="switch">
                  <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>

          {/* Code export */}
          <div className="control-group">
            <label>Export Component</label>
            <div className="code-container">
              <div className="code-header">
                <span className="code-lang">React JSX</span>
                <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyCode}>
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <div className="code-block">{exportedCode}</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        © 2026 react-venn · MIT License · Tony Tom K · Built for React 18 &amp; 19
      </footer>
    </div>
  );
}
