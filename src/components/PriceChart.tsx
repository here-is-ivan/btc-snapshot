import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

type PriceChartProps = {
  data: { time: number; price: number }[];
  large?: boolean;
};

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data.length || !ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    svg.attr('width', '100%').attr('height', '100%');
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    const margin = { top: 30, right: 30, bottom: 30, left: 50 };
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.time)) as [Date, Date])
      .range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.price)! * 0.995,
        d3.max(data, (d) => d.price)! * 1.005,
      ])
      .range([height - margin.bottom, margin.top]);
    const line = d3
      .line<{ time: number; price: number }>()
      .x((d) => x(new Date(d.time)))
      .y((d) => y(d.price));
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#22d3ee')
      .attr('stroke-width', 2)
      .attr('d', line);
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call((g) =>
        d3
          .axisBottom(x)
          .ticks(8)
          .tickFormat((d: Date | { valueOf(): number }) => {
            const date = d instanceof Date ? d : new Date(Number(d));
            return d3.timeFormat('%H:%M')(date);
          })(g)
      )
      .attr('color', '#888');
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(8))
      .attr('color', '#888');
  }, [data]);

  return (
    <svg ref={ref} className='w-full h-[50dvh]' style={{ width: '100%' }} />
  );
};

export default PriceChart;
