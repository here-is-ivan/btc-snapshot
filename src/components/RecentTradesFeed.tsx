import React from 'react';
import type { Trade } from '../types/TradeType';

const RecentTradesFeed: React.FC<{ trades: Trade[] }> = ({ trades }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-xs md:text-sm font-mono'>
        <thead>
          <tr className='text-gray-400'>
            <th className='text-left'>Time</th>
            <th className='text-right'>Price</th>
            <th className='text-right'>Size</th>
            <th className='text-right'>Side</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.trade_id}>
              <td className='text-left'>
                {new Date(trade.time).toLocaleTimeString()}
              </td>
              <td
                className={
                  trade.side === 'buy'
                    ? 'text-green-400 text-right'
                    : 'text-red-400 text-right'
                }
              >
                {parseFloat(trade.price).toLocaleString()}
              </td>
              <td className='text-right'>
                {parseFloat(trade.size).toLocaleString(undefined, {
                  maximumFractionDigits: 8,
                })}
              </td>
              <td
                className={
                  trade.side === 'buy'
                    ? 'text-green-400 text-right'
                    : 'text-red-400 text-right'
                }
              >
                {trade.side.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTradesFeed;
