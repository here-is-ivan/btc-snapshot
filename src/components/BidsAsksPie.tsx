import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

type OrderBook = {
  bids: [string, string, string][];
  asks: [string, string, string][];
};

type BidsAsksPieProps = { orderBook: OrderBook | null };

const BidsAsksPie: React.FC<BidsAsksPieProps> = ({ orderBook }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (!orderBook || !ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', '100%').attr('height', '100%');
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    const totalBids = orderBook.bids
      .slice(0, 30)
      .reduce((sum, [, size]) => sum + parseFloat(size), 0);
    const totalAsks = orderBook.asks
      .slice(0, 30)
      .reduce((sum, [, size]) => sum + parseFloat(size), 0);
    const data = [
      { label: 'Bids', value: totalBids, color: '#22c55e' },
      { label: 'Asks', value: totalAsks, color: '#ef4444' },
    ];
    const pie = d3
      .pie<{ label: string; value: number; color: string }>()
      .value((d) => d.value);
    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
      .innerRadius(80)
      .outerRadius(180);
    g.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr(
        'd',
        (d: d3.PieArcDatum<{ label: string; value: number; color: string }>) =>
          arc(d) as string
      )
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#222')
      .attr('stroke-width', 2);
    // Labels
    g.selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', 16)
      .text((d) => d.data.label);
  }, [orderBook]);
  return (
    <svg ref={ref} className='w-full h-[50dvh]' style={{ width: '100%' }} />
  );
};

export default BidsAsksPie;
