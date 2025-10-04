import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { OrderBook } from '../types/OrderBookType';

type OrderbookDepthChartProps = { orderBook: OrderBook | null };

const OrderbookDepthChart: React.FC<OrderbookDepthChartProps> = ({
  orderBook,
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!orderBook || !ref.current) return;
    
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    svg.attr('width', '100%').attr('height', '100%');
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };

    // Prepare depth data
    const bids = orderBook.bids
      .slice(0,100)
      .map(([p, s]) => [parseFloat(p), parseFloat(s)]);
    const asks = orderBook.asks
      .slice(0, 100)
      .map(([p, s]) => [parseFloat(p), parseFloat(s)]);
    let bidDepth = 0,
      askDepth = 0;
    const bidCumulative = bids.map(([p, s]) => {
      bidDepth += s;
      return { price: p, size: bidDepth };
    });
    const askCumulative = asks.map(([p, s]) => {
      askDepth += s;
      return { price: p, size: askDepth };
    });
    const x = d3
      .scaleLinear()
      .domain([
        d3.min(bidCumulative, (d) => d.price)!,
        d3.max(askCumulative, (d) => d.price)!,
      ])
      .range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max([...bidCumulative, ...askCumulative], (d) => d.size)! * 1.05,
      ])
      .range([height - margin.bottom, margin.top]);
    // Bids Area (semi-transparent)
    svg
      .append('path')
      .datum(bidCumulative)
      .attr('fill', '#22c55e')
      .attr('fill-opacity', 0.1)
      .attr('stroke', 'none')
      .attr(
        'd',
        d3
          .area<{ price: number; size: number }>()
          .x((d) => x(d.price))
          .y0(y(0))
          .y1((d) => y(d.size))
      );
    // Bids Line
    svg
      .append('path')
      .datum(bidCumulative)
      .attr('fill', 'none')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line<{ price: number; size: number }>()
          .x((d) => x(d.price))
          .y((d) => y(d.size))
      );
    // Asks Area (semi-transparent)
    svg
      .append('path')
      .datum(askCumulative)
      .attr('fill', '#ef4444')
      .attr('fill-opacity', 0.1)
      .attr('stroke', 'none')
      .attr(
        'd',
        d3
          .area<{ price: number; size: number }>()
          .x((d) => x(d.price))
          .y0(y(0))
          .y1((d) => y(d.size))
      );
    // Asks Line
    svg
      .append('path')
      .datum(askCumulative)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line<{ price: number; size: number }>()
          .x((d) => x(d.price))
          .y((d) => y(d.size))
      );
    // Axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(8))
      .attr('color', '#888');
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(8))
      .attr('color', '#888');
  }, [orderBook]);

  return <svg ref={ref} className='w-full h-[50dvh]' />;
};

export default OrderbookDepthChart;
