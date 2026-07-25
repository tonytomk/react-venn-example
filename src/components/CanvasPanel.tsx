import { VennDiagram, VennColors } from 'react-venn';
import { VennRegionInfo } from 'react-venn';
import { useVennState } from '../hooks/useVennState';

type Props = ReturnType<typeof useVennState>;

export function CanvasPanel(props: Props) {
  const {
    setsCount, data,
    selectedTheme, colorOverrides,
    spacing, strokeWidth, strokeColor, hoverStrokeColor,
    fillOpacity, fontSize,
    showLabels, showValues, showTooltip,
    animated, animationDuration,
    valueFormat,
    setHoveredRegion, setClickedRegion,
    hoveredRegion, clickedRegion,
  } = props;

  const activeColors: VennColors | undefined =
    Object.keys(colorOverrides).length > 0 ? colorOverrides : undefined;

  const renderRegionInfo = (region: VennRegionInfo, suffix = '') => (
    <div>
      <div className="stat-header">
        <div className="stat-color-indicator" style={{ backgroundColor: region.color }} />
        <div className="stat-title">
          {region.label}
          {suffix && <span style={{ opacity: 0.5, fontWeight: 400 }}> {suffix}</span>}
        </div>
      </div>
      <div className="stat-grid">
        <div className="stat-item"><div className="stat-label">Value</div><div className="stat-val">{region.value}</div></div>
        <div className="stat-item"><div className="stat-label">Share</div><div className="stat-val">{region.percentage}%</div></div>
        <div className="stat-item"><div className="stat-label">Region ID</div><div className="stat-val">{region.id}</div></div>
        <div className="stat-item"><div className="stat-label">Color</div><div className="stat-val" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{region.color}</div></div>
      </div>
    </div>
  );

  return (
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
          onRegionClick={region => setClickedRegion(region)}
          onRegionHover={region => setHoveredRegion(region)}
        />
      </div>

      {/* Interaction monitor */}
      <div className="log-display" style={{ marginTop: '8px' }}>
        {hoveredRegion
          ? renderRegionInfo(hoveredRegion)
          : clickedRegion
          ? renderRegionInfo(clickedRegion, '(clicked)')
          : <div className="log-empty">Hover or click a region to inspect its data.</div>
        }
      </div>
    </section>
  );
}
