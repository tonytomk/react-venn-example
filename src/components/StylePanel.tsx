import { VennColors } from 'react-venn';
import { useVennState, ThemePresetName } from '../hooks/useVennState';

type Props = ReturnType<typeof useVennState>;

const THEME_PREVIEWS: Record<ThemePresetName, string[]> = {
  classic: ['#3b82f6', '#ef4444', '#eab308'],
  pastel:  ['#cbd5e1', '#fecdd3', '#fef9c3'],
  dark:    ['#0ea5e9', '#ec4899', '#a855f7'],
  sunset:  ['#f43f5e', '#f97316', '#eab308'],
  emerald: ['#059669', '#0d9488', '#10b981'],
};

const REGION_KEYS_2 = ['A', 'B', 'AB'] as const;
const REGION_KEYS_3 = ['A', 'B', 'C', 'AB', 'BC', 'CA', 'ABC'] as const;

export function StylePanel(props: Props) {
  const {
    setsCount,
    selectedTheme, setSelectedTheme,
    strokeColor, setStrokeColor,
    hoverStrokeColor, setHoverStrokeColor,
    colorOverrides, updateColorOverride, clearColorOverride,
    spacing, setSpacing,
    strokeWidth, setStrokeWidth,
    fillOpacity, setFillOpacity,
    fontSize, setFontSize,
    animationDuration, setAnimationDuration,
    showLabels, setShowLabels,
    showValues, setShowValues,
    showTooltip, setShowTooltip,
    animated, setAnimated,
  } = props;

  const activeKeys = setsCount === 2
    ? (REGION_KEYS_2 as readonly string[])
    : (REGION_KEYS_3 as readonly string[]);

  const sliders = [
    { label: 'Overlap Spacing',     val: spacing,           set: setSpacing,           min: setsCount === 2 ? 0.1 : 0.2, max: setsCount === 2 ? 0.9 : 0.7, step: 0.01, display: spacing.toFixed(2) },
    { label: 'Fill Opacity',        val: fillOpacity,       set: setFillOpacity,       min: 0.1,  max: 0.95,  step: 0.05, display: fillOpacity.toFixed(2) },
    { label: 'Border Width',        val: strokeWidth,       set: setStrokeWidth,       min: 0,    max: 6,     step: 1,    display: `${strokeWidth}px` },
    { label: 'Font Size',           val: fontSize,          set: setFontSize,          min: 9,    max: 20,    step: 1,    display: `${fontSize}px` },
    { label: 'Animation Duration',  val: animationDuration, set: setAnimationDuration, min: 0,    max: 1000,  step: 50,   display: `${animationDuration}ms` },
  ] as const;

  const toggles = [
    { label: 'Show Set Labels',       val: showLabels,  set: setShowLabels },
    { label: 'Show Region Values',    val: showValues,  set: setShowValues },
    { label: 'Show Tooltip',          val: showTooltip, set: setShowTooltip },
    { label: 'Animated Transitions',  val: animated,    set: setAnimated },
  ] as const;

  return (
    <section className="panel side-panel">
      <h2>Style &amp; Layout</h2>

      {/* Theme presets */}
      <div className="control-group">
        <label>Color Theme</label>
        <div className="themes-grid">
          {(Object.keys(THEME_PREVIEWS) as ThemePresetName[]).map(t => (
            <div
              key={t}
              className={`theme-card ${selectedTheme === t ? 'active' : ''}`}
              onClick={() => setSelectedTheme(t)}
            >
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
        <label>
          Per-Region Colors{' '}
          <span style={{ fontWeight: 400, opacity: 0.6, fontSize: '11px', textTransform: 'none' }}>
            (overrides theme)
          </span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {activeKeys.map(key => {
            const override = colorOverrides[key as keyof VennColors];
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <code style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', minWidth: '38px' }}>{key}</code>
                <input
                  type="color"
                  value={override || '#888888'}
                  onChange={e => updateColorOverride(key, e.target.value)}
                  style={{ width: '34px', height: '26px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, background: 'none' }}
                />
                {override ? (
                  <button
                    onClick={() => clearColorOverride(key)}
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    reset
                  </button>
                ) : (
                  <span style={{ fontSize: '11px', color: '#475569' }}>theme default</span>
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
          {[
            { label: 'Border', val: strokeColor,      set: setStrokeColor },
            { label: 'Hover',  val: hoverStrokeColor, set: setHoverStrokeColor },
          ].map(({ label, val, set }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', minWidth: '38px' }}>{label}</span>
              <input
                type="color"
                value={val}
                onChange={e => set(e.target.value)}
                style={{ width: '34px', height: '26px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, background: 'none' }}
              />
              <code style={{ fontSize: '11px', color: '#475569' }}>{val}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Sliders */}
      {sliders.map(({ label, val, set, min, max, step, display }) => (
        <div className="control-group" key={label}>
          <div className="range-slider-group">
            <div className="range-header">
              <span>{label}</span>
              <span>{display}</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min={min}
              max={max}
              step={step}
              value={val}
              onChange={e => (set as (v: number) => void)(parseFloat(e.target.value))}
            />
          </div>
        </div>
      ))}

      {/* Toggles */}
      <div className="control-group" style={{ gap: '12px' }}>
        {toggles.map(({ label, val, set }) => (
          <div key={label} className="switch-row">
            <span className="switch-label">{label}</span>
            <label className="switch">
              <input type="checkbox" checked={val} onChange={e => (set as (v: boolean) => void)(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}
