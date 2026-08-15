import { useState, useMemo, useEffect } from 'react';
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
const REGION_KEYS_4 = ['A', 'B', 'C', 'D', 'AB', 'AC', 'AD', 'BC', 'BD', 'CD', 'ABC', 'ABD', 'ACD', 'BCD', 'ABCD'] as const;
const REGION_KEYS_5 = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE', 'BC', 'BD', 'BE', 'CD', 'CE', 'DE', 'ABC', 'ABD', 'ABE', 'ACD', 'ACE', 'ADE', 'BCD', 'BCE', 'BDE', 'CDE', 'ABCD', 'ABCE', 'ABDE', 'ACDE', 'BCDE', 'ABCDE'] as const;

export default function App() {
  // ── Set count ──────────────────────────────────────────────────────────
  const [setsCount, setSetsCount] = useState<2 | 3 | 4 | 5>(3);

  // ── Labels ─────────────────────────────────────────────────────────────
  const [labelA, setLabelA] = useState('A');
  const [labelB, setLabelB] = useState('B');
  const [labelC, setLabelC] = useState('C');
  const [labelD, setLabelD] = useState('D');
  const [labelE, setLabelE] = useState('E');

  // ── Values ─────────────────────────────────────────────────────────────
  const [valA, setValA]     = useState(1);
  const [valB, setValB]     = useState(2);
  const [valC, setValC]     = useState(3);
  const [valD, setValD]     = useState(4);
  const [valE, setValE]     = useState(5);
  const [valAB, setValAB]   = useState(6);
  const [valAC, setValAC]   = useState(7);
  const [valAD, setValAD]   = useState(8);
  const [valAE, setValAE]   = useState(9);
  const [valBC, setValBC]   = useState(10);
  const [valBD, setValBD]   = useState(11);
  const [valBE, setValBE]   = useState(12);
  const [valCD, setValCD]   = useState(13);
  const [valCE, setValCE]   = useState(14);
  const [valDE, setValDE]   = useState(15);
  const [valABC, setValABC] = useState(16);
  const [valABD, setValABD] = useState(17);
  const [valABE, setValABE] = useState(18);
  const [valACD, setValACD] = useState(19);
  const [valACE, setValACE] = useState(20);
  const [valADE, setValADE] = useState(21);
  const [valBCD, setValBCD] = useState(22);
  const [valBCE, setValBCE] = useState(23);
  const [valBDE, setValBDE] = useState(24);
  const [valCDE, setValCDE] = useState(25);
  const [valABCD, setValABCD] = useState(26);
  const [valABCE, setValABCE] = useState(27);
  const [valABDE, setValABDE] = useState(28);
  const [valACDE, setValACDE] = useState(29);
  const [valBCDE, setValBCDE] = useState(30);
  const [valABCDE, setValABCDE] = useState(31);
  
  // Notice: to avoid breaking existing 2,3,4 sets in state, I will manually map valCA to valAC where appropriate if it existed, but here I unified to AC.
  // Actually, wait, the original code used valCA.
  // Let me restore valCA and keep the rest.
  const [valCA, setValCA]   = useState(7);

  useEffect(() => {
    if (setsCount === 2) {
      setValA(1); setValB(2); setValAB(3);
    } else if (setsCount === 3) {
      setValA(1); setValB(2); setValC(3);
      setValAB(4); setValBC(5); setValCA(6); setValABC(7);
    } else if (setsCount === 4) {
      setValA(1); setValB(2); setValC(3); setValD(4);
      setValAB(5); setValBC(6); setValCA(7); setValAD(8); setValBD(9); setValCD(10);
      setValABC(11); setValABD(12); setValACD(13); setValBCD(14); setValABCD(15);
    } else if (setsCount === 5) {
      setValA(1); setValB(2); setValC(3); setValD(4); setValE(5);
      setValAB(6); setValAC(7); setValAD(8); setValAE(9);
      setValBC(10); setValBD(11); setValBE(12);
      setValCD(13); setValCE(14); setValDE(15);
      setValABC(16); setValABD(17); setValABE(18); setValACD(19); setValACE(20); setValADE(21);
      setValBCD(22); setValBCE(23); setValBDE(24); setValCDE(25);
      setValABCD(26); setValABCE(27); setValABDE(28); setValACDE(29); setValBCDE(30);
      setValABCDE(31);
    }
  }, [setsCount]);

  // ── Layout ─────────────────────────────────────────────────────────────
  const [spacing, setSpacing]         = useState(0.5);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillOpacity, setFillOpacity] = useState(0.8);
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

  const activeColors = Object.keys(colorOverrides).length > 0 ? colorOverrides : undefined;

  // ── Value format ───────────────────────────────────────────────────────
  const [valueFormatMode, setValueFormatMode] = useState<ValueFormatMode>('raw');

  const totalForPercent = useMemo(() => {
    if (setsCount === 2) return valA + valB + valAB;
    if (setsCount === 3) return valA + valB + valC + valAB + valBC + valCA + valABC;
    if (setsCount === 4) return valA + valB + valC + valD + valAB + valCA + valAD + valBC + valBD + valCD + valABC + valABD + valACD + valBCD + valABCD;
    return valA + valB + valC + valD + valE + valAB + valAC + valAD + valAE + valBC + valBD + valBE + valCD + valCE + valDE + valABC + valABD + valABE + valACD + valACE + valADE + valBCD + valBCE + valBDE + valCDE + valABCD + valABCE + valABDE + valACDE + valBCDE + valABCDE;
  }, [setsCount, valA, valB, valC, valD, valE, valAB, valBC, valCA, valAC, valAD, valAE, valBD, valBE, valCD, valCE, valDE, valABC, valABD, valABE, valACD, valACE, valADE, valBCD, valBCE, valBDE, valCDE, valABCD, valABCE, valABDE, valACDE, valBCDE, valABCDE]);

  const valueFormat = useMemo(() => {
    switch (valueFormatMode) {
      case 'locale':   return (v: number) => v.toLocaleString();
      case 'k':        return (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
      case 'percent':  return (v: number) => totalForPercent > 0 ? `${Math.round((v / totalForPercent) * 100)}%` : '0%';
      default:         return undefined;
    }
  }, [valueFormatMode, totalForPercent]);

  // ── Visibility ─────────────────────────────────────────────────────────
  const [showLabels, setShowLabels]   = useState(false);
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
        { name: `${labelA}${labelB}`, sets: ['A', 'B'], value: valAB },
      ];
    }
    if (setsCount === 3) {
      return [
        { name: labelA, sets: ['A'], value: valA },
        { name: labelB, sets: ['B'], value: valB },
        { name: labelC, sets: ['C'], value: valC },
        { name: `${labelA}${labelB}`, sets: ['A', 'B'], value: valAB },
        { name: `${labelB}${labelC}`, sets: ['B', 'C'], value: valBC },
        { name: `${labelC}${labelA}`, sets: ['A', 'C'], value: valCA },
        { name: `${labelA}${labelB}${labelC}`, sets: ['A', 'B', 'C'], value: valABC },
      ];
    }
    if (setsCount === 4) {
      return [
        { name: labelA, sets: ['A'], value: valA },
        { name: labelB, sets: ['B'], value: valB },
        { name: labelC, sets: ['C'], value: valC },
        { name: labelD, sets: ['D'], value: valD },
        { name: `${labelA}${labelB}`, sets: ['A', 'B'], value: valAB },
        { name: `${labelA}${labelC}`, sets: ['A', 'C'], value: valCA }, // internal id is AC but label uses CA
        { name: `${labelA}${labelD}`, sets: ['A', 'D'], value: valAD },
        { name: `${labelB}${labelC}`, sets: ['B', 'C'], value: valBC },
        { name: `${labelB}${labelD}`, sets: ['B', 'D'], value: valBD },
        { name: `${labelC}${labelD}`, sets: ['C', 'D'], value: valCD },
        { name: `${labelA}${labelB}${labelC}`, sets: ['A', 'B', 'C'], value: valABC },
        { name: `${labelA}${labelB}${labelD}`, sets: ['A', 'B', 'D'], value: valABD },
        { name: `${labelA}${labelC}${labelD}`, sets: ['A', 'C', 'D'], value: valACD },
        { name: `${labelB}${labelC}${labelD}`, sets: ['B', 'C', 'D'], value: valBCD },
        { name: `${labelA}${labelB}${labelC}${labelD}`, sets: ['A', 'B', 'C', 'D'], value: valABCD },
      ];
    }
    return [
      { name: labelA, sets: ['A'], value: valA },
      { name: labelB, sets: ['B'], value: valB },
      { name: labelC, sets: ['C'], value: valC },
      { name: labelD, sets: ['D'], value: valD },
      { name: labelE, sets: ['E'], value: valE },
      { name: `${labelA}${labelB}`, sets: ['A', 'B'], value: valAB },
      { name: `${labelA}${labelC}`, sets: ['A', 'C'], value: valAC },
      { name: `${labelA}${labelD}`, sets: ['A', 'D'], value: valAD },
      { name: `${labelA}${labelE}`, sets: ['A', 'E'], value: valAE },
      { name: `${labelB}${labelC}`, sets: ['B', 'C'], value: valBC },
      { name: `${labelB}${labelD}`, sets: ['B', 'D'], value: valBD },
      { name: `${labelB}${labelE}`, sets: ['B', 'E'], value: valBE },
      { name: `${labelC}${labelD}`, sets: ['C', 'D'], value: valCD },
      { name: `${labelC}${labelE}`, sets: ['C', 'E'], value: valCE },
      { name: `${labelD}${labelE}`, sets: ['D', 'E'], value: valDE },
      { name: `${labelA}${labelB}${labelC}`, sets: ['A', 'B', 'C'], value: valABC },
      { name: `${labelA}${labelB}${labelD}`, sets: ['A', 'B', 'D'], value: valABD },
      { name: `${labelA}${labelB}${labelE}`, sets: ['A', 'B', 'E'], value: valABE },
      { name: `${labelA}${labelC}${labelD}`, sets: ['A', 'C', 'D'], value: valACD },
      { name: `${labelA}${labelC}${labelE}`, sets: ['A', 'C', 'E'], value: valACE },
      { name: `${labelA}${labelD}${labelE}`, sets: ['A', 'D', 'E'], value: valADE },
      { name: `${labelB}${labelC}${labelD}`, sets: ['B', 'C', 'D'], value: valBCD },
      { name: `${labelB}${labelC}${labelE}`, sets: ['B', 'C', 'E'], value: valBCE },
      { name: `${labelB}${labelD}${labelE}`, sets: ['B', 'D', 'E'], value: valBDE },
      { name: `${labelC}${labelD}${labelE}`, sets: ['C', 'D', 'E'], value: valCDE },
      { name: `${labelA}${labelB}${labelC}${labelD}`, sets: ['A', 'B', 'C', 'D'], value: valABCD },
      { name: `${labelA}${labelB}${labelC}${labelE}`, sets: ['A', 'B', 'C', 'E'], value: valABCE },
      { name: `${labelA}${labelB}${labelD}${labelE}`, sets: ['A', 'B', 'D', 'E'], value: valABDE },
      { name: `${labelA}${labelC}${labelD}${labelE}`, sets: ['A', 'C', 'D', 'E'], value: valACDE },
      { name: `${labelB}${labelC}${labelD}${labelE}`, sets: ['B', 'C', 'D', 'E'], value: valBCDE },
      { name: `${labelA}${labelB}${labelC}${labelD}${labelE}`, sets: ['A', 'B', 'C', 'D', 'E'], value: valABCDE },
    ];
  }, [setsCount, labelA, labelB, labelC, labelD, labelE, valA, valB, valC, valD, valE, valAB, valAC, valBC, valCA, valAD, valAE, valBD, valBE, valCD, valCE, valDE, valABC, valABD, valABE, valACD, valACE, valADE, valBCD, valBCE, valBDE, valCDE, valABCD, valABCE, valABDE, valACDE, valBCDE, valABCDE]);

  // ── Code export ────────────────────────────────────────────────────────
  const exportedCode = useMemo(() => {
    return formatVennDiagramCode({
      setsCount,
      data,
      theme: selectedTheme,
      colors: activeColors,
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
  }, [setsCount, data, selectedTheme, activeColors, spacing, strokeWidth, fillOpacity, fontSize,
      strokeColor, hoverStrokeColor, showLabels, showValues, showTooltip,
      animated, animationDuration, valueFormatMode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSetsCount = (count: 2 | 3 | 4 | 5) => {
    setSetsCount(count);
    if (count >= 4) setSpacing(0);
    else setSpacing(count === 2 ? 0.55 : 0.5);
  };

  const activeRegionKeys = setsCount === 2
    ? (REGION_KEYS_2 as readonly string[])
    : setsCount === 3 
      ? (REGION_KEYS_3 as readonly string[])
      : setsCount === 4
        ? (REGION_KEYS_4 as readonly string[])
        : (REGION_KEYS_5 as readonly string[]);

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
              <button className={`tab-btn ${setsCount === 4 ? 'active' : ''}`} onClick={() => handleToggleSetsCount(4)}>
                4-Set Venn
              </button>
              <button className={`tab-btn ${setsCount === 5 ? 'active' : ''}`} onClick={() => handleToggleSetsCount(5)}>
                5-Set Venn
              </button>
            </div>
          </div>

          {/* Set Labels */}
          <div className="control-group">
            <label>Set Labels</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="text" className="input-field" value={labelA} onChange={e => setLabelA(e.target.value)} placeholder="Set A" />
              <input type="text" className="input-field" value={labelB} onChange={e => setLabelB(e.target.value)} placeholder="Set B" />
              {setsCount >= 3 && (
                <input type="text" className="input-field" value={labelC} onChange={e => setLabelC(e.target.value)} placeholder="Set C" />
              )}
              {setsCount >= 4 && (
                <input type="text" className="input-field" value={labelD} onChange={e => setLabelD(e.target.value)} placeholder="Set D" />
              )}
              {setsCount >= 5 && (
                <input type="text" className="input-field" value={labelE} onChange={e => setLabelE(e.target.value)} placeholder="Set E" />
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
                ...(setsCount >= 3 ? [{ label: `${labelC} only`, val: valC, set: setValC }] : []),
                ...(setsCount >= 4 ? [{ label: `${labelD} only`, val: valD, set: setValD }] : []),
                ...(setsCount >= 5 ? [{ label: `${labelE} only`, val: valE, set: setValE }] : []),
                { label: `${labelA} ∩ ${labelB}`, val: valAB, set: setValAB },
                ...(setsCount >= 3 ? [
                  { label: `${labelB} ∩ ${labelC}`, val: valBC, set: setValBC },
                  { label: `${labelC} ∩ ${labelA}`, val: setsCount === 3 ? valCA : valAC, set: setsCount === 3 ? setValCA : setValAC },
                  { label: `${labelA} ∩ ${labelB} ∩ ${labelC}`, val: valABC, set: setValABC },
                ] : []),
                ...(setsCount >= 4 ? [
                  { label: `${labelA} ∩ ${labelD}`, val: valAD, set: setValAD },
                  { label: `${labelB} ∩ ${labelD}`, val: valBD, set: setValBD },
                  { label: `${labelC} ∩ ${labelD}`, val: valCD, set: setValCD },
                  { label: `${labelA} ∩ ${labelB} ∩ ${labelD}`, val: valABD, set: setValABD },
                  { label: `${labelA} ∩ ${labelC} ∩ ${labelD}`, val: valACD, set: setValACD },
                  { label: `${labelB} ∩ ${labelC} ∩ ${labelD}`, val: valBCD, set: setValBCD },
                  { label: `${labelA} ∩ ${labelB} ∩ ${labelC} ∩ ${labelD}`, val: valABCD, set: setValABCD },
                ] : []),
                ...(setsCount >= 5 ? [
                  { label: `${labelA} ∩ ${labelE}`, val: valAE, set: setValAE },
                  { label: `${labelB} ∩ ${labelE}`, val: valBE, set: setValBE },
                  { label: `${labelC} ∩ ${labelE}`, val: valCE, set: setValCE },
                  { label: `${labelD} ∩ ${labelE}`, val: valDE, set: setValDE },
                  { label: `${labelA} ∩ ${labelB} ∩ ${labelE}`, val: valABE, set: setValABE },
                  { label: `${labelA} ∩ ${labelC} ∩ ${labelE}`, val: valACE, set: setValACE },
                  { label: `${labelA} ∩ ${labelD} ∩ ${labelE}`, val: valADE, set: setValADE },
                  { label: `${labelB} ∩ ${labelC} ∩ ${labelE}`, val: valBCE, set: setValBCE },
                  { label: `${labelB} ∩ ${labelD} ∩ ${labelE}`, val: valBDE, set: setValBDE },
                  { label: `${labelC} ∩ ${labelD} ∩ ${labelE}`, val: valCDE, set: setValCDE },
                  { label: `${labelA} ∩ ${labelB} ∩ ${labelC} ∩ ${labelE}`, val: valABCE, set: setValABCE },
                  { label: `${labelA} ∩ ${labelB} ∩ ${labelD} ∩ ${labelE}`, val: valABDE, set: setValABDE },
                  { label: `${labelA} ∩ ${labelC} ∩ ${labelD} ∩ ${labelE}`, val: valACDE, set: setValACDE },
                  { label: `${labelB} ∩ ${labelC} ∩ ${labelD} ∩ ${labelE}`, val: valBCDE, set: setValBCDE },
                  { label: `${labelA} ∩ ${labelB} ∩ ${labelC} ∩ ${labelD} ∩ ${labelE}`, val: valABCDE, set: setValABCDE },
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
              colors={activeColors}
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
