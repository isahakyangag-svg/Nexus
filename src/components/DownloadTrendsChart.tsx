import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Calendar, TrendingUp, HelpCircle, Activity } from 'lucide-react';

interface DownloadTrendsChartProps {
  downloadsTodayOffset: number;
}

export interface ChartDataPoint {
  date: Date;
  downloads: number;
  label: string;
}

export default function DownloadTrendsChart({ downloadsTodayOffset }: DownloadTrendsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 240 });
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [timeRange, setTimeRange] = useState<7 | 30>(30);

  // Resize observer to make the D3 chart perfectly responsive
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 280),
          height: 240, // Elegant stable height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Generate stable, highly professional 30 days time series data
  const data: ChartDataPoint[] = useMemo(() => {
    const arr: ChartDataPoint[] = [];
    const baseDownloads = 1384 + downloadsTodayOffset;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
      // Create some realistic cyclical traffic variation
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseVariation = Math.sin((30 - i) * 0.5) * 180 + 1100;
      const weekendModifier = isWeekend ? -220 : 130;
      const randomNoise = (Math.sin((30 - i) * 1.7) * 60); // Stable deterministic noise based on index
      
      let finalDownloads = Math.round(baseVariation + weekendModifier + randomNoise);
      
      // The last element is "TODAY", which must match the modified downloadsTodayOffset precisely!
      if (i === 0) {
        finalDownloads = baseDownloads;
      }
      
      arr.push({
        date,
        downloads: finalDownloads,
        label: date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
      });
    }
    
    return arr;
  }, [downloadsTodayOffset]);

  // Filtered data based on selected timeRange (7 days or 30 days)
  const filteredData = useMemo(() => {
    return timeRange === 7 ? data.slice(-7) : data;
  }, [data, timeRange]);

  // SVG parameters
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = dimensions.width;
  const height = dimensions.height;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // D3 Scales
  const xScale = useMemo(() => {
    return d3.scaleTime()
      .domain(d3.extent(filteredData, (d: ChartDataPoint) => d.date) as [Date, Date])
      .range([0, innerWidth]);
  }, [filteredData, innerWidth]);

  const yScale = useMemo(() => {
    const maxVal = (d3.max(filteredData, (d: ChartDataPoint) => d.downloads) as number) || 1500;
    const minVal = (d3.min(filteredData, (d: ChartDataPoint) => d.downloads) as number) || 800;
    // Add margin bounds
    return d3.scaleLinear()
      .domain([Math.max(0, minVal - 100), maxVal + 100])
      .range([innerHeight, 0]);
  }, [filteredData, innerHeight]);

  // Generates SVG Line path
  const linePath = useMemo(() => {
    const lineGenerator = d3.line<ChartDataPoint>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.downloads))
      .curve(d3.curveMonotoneX); // Beautiful smooth interpolation
    return lineGenerator(filteredData) || '';
  }, [filteredData, xScale, yScale]);

  // Generates Area path
  const areaPath = useMemo(() => {
    const areaGenerator = d3.area<ChartDataPoint>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScale(d.downloads))
      .curve(d3.curveMonotoneX);
    return areaGenerator(filteredData) || '';
  }, [filteredData, xScale, yScale, innerHeight]);

  // Generates D3 Ticks
  const xTicks = useMemo(() => {
    return xScale.ticks(timeRange === 7 ? 7 : 8);
  }, [xScale, timeRange]);

  const yTicks = useMemo(() => {
    return yScale.ticks(5);
  }, [yScale]);

  return (
    <div className="space-y-4" id="d3-download-trends-wrapper">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            D3 Интенсивность Динамики Скачиваний (E2E)
          </span>
        </div>
        
        {/* Toggle between last 7 or 30 days */}
        <div className="flex bg-black/40 border border-white/5 rounded-lg p-0.5" id="data-time-range-toggle">
          <button
            type="button"
            onClick={() => setTimeRange(7)}
            className={`cursor-pointer px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider transition-all ${
              timeRange === 7 
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' 
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            7 Дней
          </button>
          <button
            type="button"
            onClick={() => setTimeRange(30)}
            className={`cursor-pointer px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold tracking-wider transition-all ${
              timeRange === 30 
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' 
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            30 Дней
          </button>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="w-full relative bg-[#090910]/40 border border-white/5 rounded-2xl p-4 overflow-hidden"
        style={{ minHeight: '272px' }}
      >
        {/* Real D3 SVG Element */}
        <svg 
          width={width} 
          height={height} 
          className="overflow-visible select-none"
        >
          <defs>
            {/* Elegant multi-stop gradient for line fill AREA */}
            <linearGradient id="d3AreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing line stroke gradient */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            
            {/* Neon line glow filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Core Plot Area */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Y Axis Gridlines */}
            {yTicks.map((tickVal, idx) => (
              <g key={`y-grid-${idx}`} transform={`translate(0, ${yScale(tickVal)})`}>
                <line 
                  x1={0} 
                  x2={innerWidth} 
                  stroke="rgba(255, 255, 255, 0.03)" 
                  strokeWidth={1}
                  strokeDasharray="4,4" 
                />
                <text 
                  x={-15} 
                  y={4} 
                  textAnchor="end" 
                  fill="#58586c" 
                  className="font-mono text-[9px] font-bold"
                >
                  {tickVal}
                </text>
              </g>
            ))}

            {/* X Axis Gridlines & Labels */}
            {xTicks.map((tickVal, idx) => {
              const xPos = xScale(tickVal);
              return (
                <g key={`x-grid-${idx}`} transform={`translate(${xPos}, 0)`}>
                  <line 
                    y1={0} 
                    y2={innerHeight} 
                    stroke="rgba(255, 255, 255, 0.015)" 
                    strokeWidth={1} 
                  />
                  <text 
                    y={innerHeight + 18} 
                    textAnchor="middle" 
                    fill="#58586c" 
                    className="font-mono text-[9px] font-bold"
                  >
                    {tickVal.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
                  </text>
                </g>
              );
            })}

            {/* Filled Area beneath the line */}
            <path 
              d={areaPath} 
              fill="url(#d3AreaGradient)" 
            />

            {/* Glowing Trend Line */}
            <path 
              d={linePath} 
              fill="none" 
              stroke="url(#lineGradient)"
              strokeWidth={2.5} 
              filter="url(#neonGlow)"
              style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
            />

            {/* Interactive Circles / Hover Tooltip Interceptor */}
            {filteredData.map((d, index) => {
              const cx = xScale(d.date);
              const cy = yScale(d.downloads);
              const isHovered = hoveredPoint && hoveredPoint.date.getTime() === d.date.getTime();

              return (
                <g key={`point-${index}`}>
                  {/* Subtle pulsing background ring for current/latest day (today) */}
                  {index === filteredData.length - 1 && (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={7} 
                      className="fill-purple-500/20 stroke-purple-500/30 animate-ping" 
                    />
                  )}
                  
                  {/* Real point circle anchor */}
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={isHovered ? 6 : 3.5} 
                    className={`transition-all duration-150 cursor-pointer ${
                      index === filteredData.length - 1 
                        ? 'fill-[#07070c] stroke-purple-400 stroke-[3]' 
                        : 'fill-[#05050a] stroke-indigo-400 stroke-[2]'
                    } ${isHovered ? 'stroke-pink-400 stroke-[3.5]' : ''}`}
                    onMouseEnter={(e) => {
                      setHoveredPoint(d);
                      setTooltipPos({
                        x: cx + margin.left,
                        y: cy + margin.top
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredPoint(null);
                    }}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Dynamic Tooltip Element absolutely structured over chart content */}
        {hoveredPoint && (
          <div 
            className="absolute z-35 bg-[#0b0b18]/95 border border-purple-500/40 px-3.5 py-2 rounded-xl shadow-2xl pointer-events-none transition-all duration-100 ease-out flex flex-col gap-1 text-left backdrop-blur-md"
            style={{ 
              left: `${tooltipPos.x}px`, 
              top: `${tooltipPos.y - 65}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Visual tiny layout corner pointer */}
            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0b0b18] border-r border-b border-purple-500/40 rotate-45" />
            
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-wider text-purple-400 font-mono">
              <Calendar className="w-3 h-3" />
              <span>{hoveredPoint.date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-[13px] font-extrabold text-white">{hoveredPoint.downloads}</span>
              <span className="text-[8px] uppercase font-bold text-slate-500 font-sans">СКАЧИВАНИЙ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
