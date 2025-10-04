import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

type PriceChartProps = {
  data: { time: number; price: number }[];
};

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

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

    // Area under the line
    const area = d3
      .area<{ time: number; price: number }>()
      .x((d) => x(new Date(d.time)))
      .y0(y.range()[0])
      .y1((d) => y(d.price));
    svg
      .append('path')
      .datum(data)
      .attr('fill', '#22d3ee')
      .attr('opacity', 0.1)
      .attr('d', area);

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

    // Tooltip logic
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    // Add a dot marker for the hovered point
    const focusDot = svg
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#22d3ee')
      .style('display', 'none');

    // Overlay for capturing mouse events
    svg
      .append('rect')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event);
        // Find closest data point
        const xm = x.invert(mx);
        const bisect = d3.bisector((d: { time: number }) => d.time).left;
        const idx = bisect(data, +xm);
        const d0 = data[idx - 1];
        const d1 = data[idx];
        let dClosest = d0;
        if (d1 && d0) {
          dClosest = xm.getTime() - d0.time > d1.time - xm.getTime() ? d1 : d0;
        } else if (d1) {
          dClosest = d1;
        }
        if (dClosest) {
          // Show and move the dot
          focusDot
            .style('display', 'block')
            .attr('cx', x(new Date(dClosest.time)))
            .attr('cy', y(dClosest.price));

          tooltip.style.display = 'block';
          tooltip.style.position = 'fixed';
          // Get mouse position relative to viewport
          const e = event as MouseEvent;
          tooltip.style.left = e.clientX + 12 + 'px';
          tooltip.style.top = e.clientY - 24 + 'px';
          tooltip.innerHTML = `<div style='font-size:14px'><b>Price:</b> $${dClosest.price.toLocaleString()}<br/><b>Time:</b> ${d3.timeFormat(
            '%H:%M:%S'
          )(new Date(dClosest.time))}</div>`;
        } else {
          focusDot.style('display', 'none');
        }
      })
      .on('mouseleave', function () {
        tooltip.style.display = 'none';
        focusDot.style('display', 'none');
      });
  }, [data]);

  return (
    <div className='relative w-full'>
      <svg ref={ref} className='w-full h-[50dvh]' />
      <div
        ref={tooltipRef}
        style={{
          display: 'none',
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.85)',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: 6,
          fontSize: 13,
          position: 'fixed',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          minWidth: 90,
          textAlign: 'left',
        }}
      />
    </div>
  );
};

export default PriceChart;
