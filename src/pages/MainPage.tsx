import { useEffect, useState } from 'react';

import PriceChart from '../components/PriceChart';
import OrderbookDepthChart from '../components/OrderbookDepthChart';
import BidsAsksPie from '../components/BidsAsksPie';
import TopBidsAsksTable from '../components/TopBidsAsksTable';
import BuyCalculator from '../components/BuyCalculator';

type OrderBook = {
  bids: [string, string, string][];
  asks: [string, string, string][];
};

type Ticker = {
  price: string;
  open: string;
  high: string;
  low: string;
  volume: string;
};

const MainPage = () => {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<
    { time: number; price: number }[]
  >([]);

  // fetch orderbook
  useEffect(() => {
    fetch('https://api.exchange.coinbase.com/products/BTC-USD/book?level=2')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orderbook');
        return res.json();
      })
      .then((data) => setOrderBook({ bids: data.bids, asks: data.asks }))
      .catch((err) => setError(err.message));
  }, []);

  // fetch ticker info
  useEffect(() => {
    fetch('https://api.exchange.coinbase.com/products/BTC-USD/ticker')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch ticker');
        return res.json();
      })
      .then((data) => setTicker(data))
      .catch((err) => setError(err.message));
  }, []);

  // fetch price history (last 24h, 5min granularity)
  useEffect(() => {
    fetch(
      'https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=300'
    )
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch candles');
        return res.json();
      })
      .then((data) => {
        setPriceHistory(
          data
            .map((d: number[]) => ({ time: d[0] * 1000, price: d[4] }))
            .sort(
              (
                a: { time: number; price: number },
                b: { time: number; price: number }
              ) => a.time - b.time
            )
        );
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return null;

  const isLoading = !orderBook || !ticker || priceHistory.length === 0;

  if (isLoading) {
    return (
      <section className='min-h-screen min-w-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <svg
            className='animate-spin h-12 w-12 text-green-400 mb-4'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
            ></path>
          </svg>
          <span className='text-lg text-gray-300 font-medium'>
            Loading data...
          </span>
        </div>
      </section>
    );
  }

  // get current time as HH:mm:ss for snapshot
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}`;

  return (
    <section className='min-h-screen min-w-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white flex flex-col items-center p-0 md:p-8'>
      <header className='w-full max-w-5xl flex flex-col md:flex-row justify-between items-center py-8 mb-4'>
        <div>
          <h1 className='text-3xl md:text-5xl font-bold tracking-tight mb-2'>
            BTC Snapshot{' '}
            <span className='text-base md:text-2xl font-normal text-gray-400'>
              at {timeString}
            </span>
          </h1>
          <p className='text-gray-400 text-lg'>Bitcoin data from Coinbase</p>
        </div>
        {ticker && (
          <div className='flex flex-col items-end mt-4 md:mt-0'>
            <span className='text-2xl md:text-4xl font-mono font-bold text-green-400'>
              ${parseFloat(ticker.price).toLocaleString()}
            </span>
            <span className='text-xs text-gray-400'>
              24h Vol: {parseFloat(ticker.volume).toLocaleString()} BTC
            </span>
          </div>
        )}
      </header>

      <main className='w-full max-w-5xl flex flex-col gap-10'>
        <div className='bg-gray-950 rounded-xl shadow-lg p-8 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>BTC Price (24h)</h2>
          <PriceChart data={priceHistory} />
        </div>
        <div className='bg-gray-950 rounded-xl shadow-lg p-8 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>Orderbook Depth</h2>
          <OrderbookDepthChart orderBook={orderBook} />
        </div>
        <div className='bg-gray-950 rounded-xl shadow-lg p-8 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>Bids vs Asks (Pie)</h2>
          <BidsAsksPie orderBook={orderBook} />
        </div>
        <div className='bg-gray-950 rounded-xl shadow-lg p-8 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>Top 3 Bids & Asks</h2>
          <TopBidsAsksTable orderBook={orderBook} />
        </div>
        <div className='bg-gray-950 rounded-xl shadow-lg p-8 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>BTC Buy Calculator</h2>
          <BuyCalculator orderBook={orderBook} />
        </div>
      </main>
      <footer className='mt-12 text-xs text-gray-600'>
        Powered by Coinbase API & D3.js | Minimalistic Fintech Demo
      </footer>
    </section>
  );
};

export default MainPage;
