import type { OrderBook } from '../types/OrderBookType';

const TopBidsAsksTable = ({ orderBook }: { orderBook: OrderBook | null }) => {
  if (!orderBook) return <div className='text-gray-500'>Loading...</div>;

  const topBids = orderBook.bids.slice(0, 3);
  const topAsks = orderBook.asks.slice(0, 3);

  return (
    <div className='flex flex-col md:flex-row gap-4 min-h-[50dvh] items-stretch'>
      {/* Bids Column */}
      <div className='flex-1 flex flex-col bg-zinc-900 rounded-lg shadow p-4 border border-zinc-800'>
        <div className='flex justify-between mb-2 border-b border-zinc-700 pb-1'>
          <span className='font-semibold text-green-400'>Bid Price</span>
          <span className='font-semibold text-green-400'>Size</span>
        </div>
        {topBids.map(([price, size], i) => (
          <div
            key={i}
            className='flex justify-between py-2 border-b last:border-b-0 border-zinc-800 text-green-300'
          >
            <span>{parseFloat(price).toLocaleString()}</span>
            <span>{parseFloat(size).toLocaleString()}</span>
          </div>
        ))}
      </div>
      {/* Asks Column */}
      <div className='flex-1 flex flex-col bg-zinc-900 rounded-lg shadow p-4 border border-zinc-800'>
        <div className='flex justify-between mb-2 border-b border-zinc-700 pb-1'>
          <span className='font-semibold text-red-400'>Ask Price</span>
          <span className='font-semibold text-red-400'>Size</span>
        </div>
        {topAsks.map(([price, size], i) => (
          <div
            key={i}
            className='flex justify-between py-2 border-b last:border-b-0 border-zinc-800 text-red-300'
          >
            <span>{parseFloat(price).toLocaleString()}</span>
            <span>{parseFloat(size).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBidsAsksTable;
