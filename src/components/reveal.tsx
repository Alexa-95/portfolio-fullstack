'use client';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

// CSS transition toggled by an IntersectionObserver: it only writes a class and never
// reads layout, so it can't force a synchronous reflow (unlike the motion-based version).
export function Reveal({children, className='', delay=0}:{children:ReactNode; className?:string; delay?:number}){
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      el.classList.add('is-revealed');
      io.disconnect();
    }, {threshold:0.14});
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{'--reveal-delay':`${delay}s`} as CSSProperties}>{children}</div>;
}
