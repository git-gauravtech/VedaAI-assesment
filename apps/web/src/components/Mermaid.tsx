'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

function sanitizeMermaid(chart: string): string {
  if (!chart) return '';
  
  let sanitized = chart;
  
  // 1. Double round brackets (Circle): id((text)) -> id(("text"))
  sanitized = sanitized.replace(/(\b\w+)\s*\(\(\s*([^"\)]+?)\s*\)\)/g, '$1(("$2"))');
  
  // 2. Stadium/Round shape: id([text]) -> id(["text"])
  sanitized = sanitized.replace(/(\b\w+)\s*\(\[\s*([^"\]]+?)\s*\]\)/g, '$1(["$2"])');
  
  // 3. Subroutine: id[[text]] -> id[["text"]]
  sanitized = sanitized.replace(/(\b\w+)\s*\[\[\s*([^"\]]+?)\s*\]\]/g, '$1[["$2"]]');
  
  // 4. Database: id[(text)] -> id[("text")]
  sanitized = sanitized.replace(/(\b\w+)\s*\[\(\s*([^"\)]+?)\s*\)\]/g, '$1[("$2")]');
  
  // 5. Hexagon: id{{text}} -> id{{"text"}}
  sanitized = sanitized.replace(/(\b\w+)\s*\{\{\s*([^"\}]+?)\s*\}\}/g, '$1{{"$2"}}');
  
  // 6. Round brackets: id(text) -> id("text")
  sanitized = sanitized.replace(/(\b\w+)\s*\(\s*([^"\)\r\n]+?)\s*\)/g, (match, id, text) => {
    const keywords = ['style', 'click', 'subgraph', 'end', 'flowchart', 'graph'];
    if (keywords.includes(id.toLowerCase())) return match;
    return `${id}("${text}")`;
  });
  
  // 7. Square brackets: id[text] -> id["text"]
  sanitized = sanitized.replace(/(\b\w+)\s*\[\s*([^"\]\r\n]+?)\s*\]/g, (match, id, text) => {
    const keywords = ['style', 'click', 'subgraph', 'end', 'flowchart', 'graph'];
    if (keywords.includes(id.toLowerCase())) return match;
    return `${id}["${text}"]`;
  });
  
  // 8. Curly brackets (Rhombus): id{text} -> id{"text"}
  sanitized = sanitized.replace(/(\b\w+)\s*\{\s*([^"\}\r\n]+?)\s*\}/g, (match, id, text) => {
    const keywords = ['style', 'click', 'subgraph', 'end', 'flowchart', 'graph'];
    if (keywords.includes(id.toLowerCase())) return match;
    return `${id}{"${text}"}`;
  });
  
  return sanitized;
}

export default function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    setError(null);

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const sanitizedChart = sanitizeMermaid(chart);
        const { svg } = await mermaid.render(id, sanitizedChart);
        if (mounted) {
          setSvg(svg);
          setError(null);
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        if (mounted) {
          setError(err?.message || 'Could not parse Mermaid diagram syntax');
        }
      }
    };

    if (chart) {
      renderChart();
    }

    return () => {
      mounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-slate-800 dark:text-slate-200 w-full max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-rose-500 text-sm md:text-base">Diagram Render Blocked</h4>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              The AI-generated diagram contains syntax rendering issues.
            </p>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2 text-xs md:text-sm">
          <button 
            onClick={() => setShowRaw(!showRaw)}
            className="px-3 py-1.5 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {showRaw ? 'Hide Diagram Details' : 'Show Diagram Details'}
          </button>
        </div>

        {showRaw && (
          <div className="mt-4 p-3 bg-slate-950 dark:bg-slate-900 rounded-lg overflow-x-auto text-[10px] sm:text-xs font-mono text-emerald-400 border border-slate-800">
            <div className="mb-2 text-slate-500 border-b border-slate-800 pb-1 flex justify-between">
              <span>RAW DIAGRAM SYNTAX</span>
              <span className="text-[10px] text-rose-400 max-w-[50%] truncate">Error: {error.split('\n')[0]}</span>
            </div>
            <pre className="whitespace-pre-wrap select-all">{chart}</pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center my-4 overflow-hidden w-full" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
