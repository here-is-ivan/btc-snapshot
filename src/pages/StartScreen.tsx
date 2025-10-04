import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const StartScreen = () => {
  const headingRef = useRef(null);
  const buttonRef = useRef(null);
  const dotsDistance = 100;
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const dotsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateDots);
      }
    };

    function updateDots() {
      const minSize = 0;
      const maxSize = 6;
      if (dotsContainerRef.current) {
        const dotDivs = dotsContainerRef.current.querySelectorAll<HTMLDivElement>('.dot');
        dotDivs.forEach(dot => {
          const dotX = Number(dot.dataset.x);
          const dotY = Number(dot.dataset.y);
          const dx = mouseRef.current.x - dotX;
          const dy = mouseRef.current.y - dotY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const size = Math.max(minSize, Math.min(maxSize, minSize + dist / 80));
          dot.style.width = `${size}px`;
          dot.style.height = `${size}px`;
        });
      }
      animationFrameId = 0;
    }

    window.addEventListener('mousemove', handleMouseMove);
    
    requestAnimationFrame(updateDots);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const rowsArray = new Array(
    Math.round(window.innerWidth / dotsDistance)
  ).fill(0);
  const columnsArray = new Array(
    Math.round(window.innerHeight / dotsDistance)
  ).fill(0);

  useGSAP(() => {
    // Animate dots container: blur to sharp, scale, and a subtle rotation
    if (dotsContainerRef.current) {
      gsap.fromTo(
        dotsContainerRef.current,
        {
          filter: 'blur(32px)',
          opacity: 0.2,
          scale: 1.2,
          rotate: -24,
        },
        {
          filter: 'blur(2px)',
          opacity: 0.5,
          scale: 1,
          rotate: 0,
          duration: 3,
          ease: 'power3.out',
        }
      );
    }
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
  <section className='min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#101a2b] via-60% to-[#0a0f1c] text-white font-sans tracking-tight'>
      <div ref={dotsContainerRef} className='absolute h-dvh w-dvw z-10 flex'>
        {rowsArray.map((_, rowIndex) => (
          <div key={rowIndex} className='flex flex-col flex-1'>
            {columnsArray.map((_, columnIndex) => {
              const dotX = rowIndex * dotsDistance + dotsDistance / 2;
              const dotY = columnIndex * dotsDistance + dotsDistance / 2;
              return (
                <div key={columnIndex} className='flex-1 flex justify-center items-center'>
                  <div
                    className='bg-blue-500 rounded-full dot'
                    data-x={dotX}
                    data-y={dotY}
                    style={{ width: 6, height: 6 }}
                  ></div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <h1
        ref={headingRef}
        className='z-20 text-center text-4xl p-2 md:text-6xl font-semibold mb-10 tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-600 bg-clip-text text-transparent drop-shadow-xl'
      >
        What's Going On With Bitcoin?
      </h1>
      <button
        ref={buttonRef}
        className='z-20 px-8 py-3 rounded-full bg-gray-900 hover:bg-blue-400 hover:text-black transition-colors duration-200 shadow-lg border-2 border-blue-400 text-lg tracking-wide cursor-pointer'
      >
        Get A Snapshot
      </button>
    </section>
  );
};

export default StartScreen;
