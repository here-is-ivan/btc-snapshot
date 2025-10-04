export type Trade = {
  time: string;
  trade_id: number;
  price: string;
  size: string;
  side: 'buy' | 'sell';
};