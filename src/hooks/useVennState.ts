import { useState, useMemo } from 'react';
import { VennColors } from 'react-venn';
import { VennRegionInfo } from 'react-venn';

export type ThemePresetName = 'classic' | 'pastel' | 'dark' | 'sunset' | 'emerald';
export type ValueFormatMode = 'raw' | 'locale' | 'k' | 'percent';

export function useVennState() {
  // ── Set count ───────────────────────────────────────────────────
  const [setsCount, setSetsCount] = useState<2 | 3>(3);

  // ── Labels ──────────────────────────────────────────────────────
  const [labelA, setLabelA] = useState('React');
  const [labelB, setLabelB] = useState('TypeScript');
  const [labelC, setLabelC] = useState('CSS');

  // ── Values ──────────────────────────────────────────────────────
  const [valA, setValA]     = useState(12);
  const [valB, setValB]     = useState(15);
  const [valC, setValC]     = useState(10);
  const [valAB, setValAB]   = useState(4);
  const [valBC, setValBC]   = useState(5);
  const [valCA, setValCA]   = useState(3);
  const [valABC, setValABC] = useState(2);

  // ── Layout ──────────────────────────────────────────────────────
  const [spacing, setSpacing]         = useState(0.5);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillOpacity, setFillOpacity] = useState(0.6);
  const [fontSize, setFontSize]       = useState(13);

  // ── Theme & Colors ──────────────────────────────────────────────
  const [selectedTheme, setSelectedTheme]       = useState<ThemePresetName>('classic');
  const [strokeColor, setStrokeColor]           = useState('#ffffff');
  const [hoverStrokeColor, setHoverStrokeColor] = useState('#1e293b');
  const [colorOverrides, setColorOverrides]     = useState<VennColors>({});

  const updateColorOverride = (key: string, val: string) =>
    setColorOverrides(prev => ({ ...prev, [key]: val }));

  const clearColorOverride = (key: string) =>
    setColorOverrides(prev => {
      const next = { ...prev };
      delete next[key as keyof VennColors];
      return next;
    });

  // ── Value format ────────────────────────────────────────────────
  const [valueFormatMode, setValueFormatMode] = useState<ValueFormatMode>('raw');

  const totalForPercent = useMemo(() => {
    if (setsCount === 2) return valA + valB + valAB;
    return valA + valB + valC + valAB + valBC + valCA + valABC;
  }, [setsCount, valA, valB, valC, valAB, valBC, valCA, valABC]);

  const valueFormat = useMemo(() => {
    switch (valueFormatMode) {
      case 'locale':  return (v: number) => v.toLocaleString();
      case 'k':       return (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
      case 'percent': return (v: number) => totalForPercent > 0 ? `${Math.round((v / totalForPercent) * 100)}%` : '0%';
      default:        return undefined;
    }
  }, [valueFormatMode, totalForPercent]);

  // ── Visibility & Behaviour ──────────────────────────────────────
  const [showLabels, setShowLabels]   = useState(true);
  const [showValues, setShowValues]   = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [animated, setAnimated]       = useState(true);
  const [animationDuration, setAnimationDuration] = useState(200);

  // ── Interaction log ─────────────────────────────────────────────
  const [hoveredRegion, setHoveredRegion] = useState<VennRegionInfo | null>(null);
  const [clickedRegion, setClickedRegion] = useState<VennRegionInfo | null>(null);

  // ── Derived ─────────────────────────────────────────────────────
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

  const handleToggleSetsCount = (count: 2 | 3) => {
    setSetsCount(count);
    setSpacing(count === 2 ? 0.55 : 0.5);
    setClickedRegion(null);
    setHoveredRegion(null);
  };

  return {
    // set count
    setsCount, handleToggleSetsCount,
    // labels
    labelA, setLabelA, labelB, setLabelB, labelC, setLabelC,
    // values
    valA, setValA, valB, setValB, valC, setValC,
    valAB, setValAB, valBC, setValBC, valCA, setValCA, valABC, setValABC,
    // layout
    spacing, setSpacing, strokeWidth, setStrokeWidth,
    fillOpacity, setFillOpacity, fontSize, setFontSize,
    // theme & colors
    selectedTheme, setSelectedTheme,
    strokeColor, setStrokeColor,
    hoverStrokeColor, setHoverStrokeColor,
    colorOverrides, updateColorOverride, clearColorOverride,
    // value format
    valueFormatMode, setValueFormatMode, valueFormat,
    // visibility
    showLabels, setShowLabels, showValues, setShowValues,
    showTooltip, setShowTooltip, animated, setAnimated,
    animationDuration, setAnimationDuration,
    // interaction
    hoveredRegion, setHoveredRegion, clickedRegion, setClickedRegion,
    // derived
    data,
  };
}
