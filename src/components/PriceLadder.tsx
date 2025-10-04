import React from 'react';
import type { OrderBook } from '../types/OrderBookType';

type PriceLadderProps = {
  orderBook: OrderBook | null;
  levels?: number;
};

const PriceLadder: React.FC<PriceLadderProps> = ({ orderBook, levels = 15 }) => {
  if (!orderBook) return null;

  // Prepare bids and asks with cumulative size
  let bidCum = 0;
  let askCum = 0;
  const bids = orderBook.bids
    .slice(0, levels)
    .map(([price, size]) => {
      bidCum += parseFloat(size);
      return {
        price: parseFloat(price),
        size: parseFloat(size),
        cum: bidCum,
      };
    });
  const asks = orderBook.asks
    .slice(0, levels)
    .map(([price, size]) => {
      askCum += parseFloat(size);
      return {
        price: parseFloat(price),
        size: parseFloat(size),
        cum: askCum,
      };
    });

  // Find best bid/ask for highlight
  const bestBid = bids[0]?.price;
  const bestAsk = asks[0]?.price;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full text-xs md:text-sm text-center rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-2 py-1 text-gray-400 font-normal">Quantity</th>
            <th className="px-2 py-1 text-green-400 font-normal">Buy Price</th>
            <th className="px-2 py-1 text-red-400 font-normal">Sell Price</th>
            <th className="px-2 py-1 text-gray-400 font-normal">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: levels }).map((_, i) => {
            const isBestBid = bids[i]?.price === bestBid;
            const isBestAsk = asks[i]?.price === bestAsk;
            return (
              <tr key={i}>
                {/* Bid Quantity */}
                <td
                  className={`px-2 py-1 font-mono ${bids[i] ? (isBestBid ? 'bg-green-700/60 text-white' : 'bg-green-900/40 text-green-200') : ''}`}
                >
                  {bids[i]?.size?.toLocaleString(undefined, { maximumFractionDigits: 6 }) ?? ''}
                </td>
                {/* Bid Price */}
                <td
                  className={`px-2 py-1 font-mono ${bids[i] ? (isBestBid ? 'bg-green-700/60 text-white' : 'bg-green-900/40 text-green-300') : ''}`}
                >
                  {bids[i]?.price?.toLocaleString() ?? ''}
                </td>
                {/* Ask Price */}
                <td
                  className={`px-2 py-1 font-mono ${asks[i] ? (isBestAsk ? 'bg-red-700/60 text-white' : 'bg-red-900/40 text-red-300') : ''}`}
                >
                  {asks[i]?.price?.toLocaleString() ?? ''}
                </td>
                {/* Ask Quantity */}
                <td
                  className={`px-2 py-1 font-mono ${asks[i] ? (isBestAsk ? 'bg-red-700/60 text-white' : 'bg-red-900/40 text-red-200') : ''}`}
                >
                  {asks[i]?.size?.toLocaleString(undefined, { maximumFractionDigits: 6 }) ?? ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PriceLadder;
