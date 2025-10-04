import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const StartScreen = () => {
  const headingRef = useRef(null);
  const buttonRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -40, scale: 2, filter: 'blur(24px)' },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 2,
        ease: 'power3.out',
      }
    );
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 40, scale: 2, filter: 'blur(24px)' },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 2,
        delay: 0.3,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans tracking-tight'>
      <h1
        ref={headingRef}
        className='text-center text-4xl py-2 md:text-6xl font-semibold mb-10 tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600 bg-clip-text text-transparent drop-shadow-xl'
      >
        What's Going On With Bitcoin?
      </h1>
      <button
        ref={buttonRef}
        className='px-8 py-3 rounded-full bg-gray-900 hover:bg-blue-400 hover:text-black transition-colors duration-200 shadow-lg border-2 border-blue-400 text-lg font-medium tracking-wide cursor-pointer'
      >
        Get A Snapshot
      </button>
    </div>
  );
};

export default StartScreen;
