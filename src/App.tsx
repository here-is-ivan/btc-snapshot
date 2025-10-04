import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import MainPage from './pages/MainPage';

const App = () => {
  return (
    <main className='bg-gray-950'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<StartScreen />} />
          <Route path='/main' element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default App;
