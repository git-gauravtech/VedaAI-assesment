'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export default function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (mounted) {
          setSvg(svg);
        }
      } catch (error) {
        console.error('Mermaid render error:', error);
      }
    };

    if (chart) {
      renderChart();
    }

    return () => {
      mounted = false;
    };
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center my-4 overflow-hidden" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
