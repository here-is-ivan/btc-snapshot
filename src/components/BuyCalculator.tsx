import React from 'react';

type OrderBook = {
  bids: [string, string, string][];
  asks: [string, string, string][];
};

const BuyCalculator = ({ orderBook }: { orderBook: OrderBook | null }) => {
  const [btcAmount, setBtcAmount] = React.useState('');
  const [usdCost, setUsdCost] = React.useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderBook || !btcAmount || isNaN(Number(btcAmount))) return;
    let remaining = parseFloat(btcAmount);
    let cost = 0;
    for (const [price, size] of orderBook.asks) {
      const askSize = parseFloat(size);
      const askPrice = parseFloat(price);
      if (remaining <= askSize) {
        cost += remaining * askPrice;
        remaining = 0;
        break;
      } else {
        cost += askSize * askPrice;
        remaining -= askSize;
      }
    }
    setUsdCost(remaining > 0 ? NaN : cost);
  };

  return (
    <form onSubmit={handleCalculate} className='flex flex-col md:flex-row gap-4 items-center'>
      <label className='text-gray-300'>
        BTC Amount:
        <input
          type='number'
          min='0.0001'
          step='0.0001'
          value={btcAmount}
          onChange={e => setBtcAmount(e.target.value)}
          className='ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white w-28'
          placeholder='e.g. 0.1'
        />
      </label>
      <button
        type='submit'
        className='px-4 py-2 rounded bg-green-600 hover:bg-green-700 font-semibold shadow-lg transition'
        disabled={!orderBook || !btcAmount}
      >
        Calculate Cost
      </button>
      {usdCost !== null && (
        <span className='ml-2 text-lg font-mono'>
          {isNaN(usdCost!) ? 'Not enough asks in book' : `≈ $${usdCost!.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        </span>
      )}
    </form>
  );
};

export default BuyCalculator;
