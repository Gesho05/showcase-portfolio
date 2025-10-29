import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function ProjectCard({
  title,
  description,
  bigDescription,
  thumbnail,
  modalImages = [], // array of image URLs for left/center/right panels
  url = '#',
  className = ''
}) {
  const [selected, setSelected] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const cardRef = useRef(null);

  const closeModal = () => {
    setModalActive(false);
    setTimeout(() => setSelected(false), 300);
  };

  // Carousel refs/state for drag-to-scroll
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const currentIndex = useRef(0);
  const wheelDebounce = useRef(null);

  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') setSelected(false); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(en => { if (en.isIntersecting) { setVisible(true); o.unobserve(node); } });
    }, { threshold: 0.15 });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (selected) requestAnimationFrame(() => setModalActive(true));
    else setModalActive(false);
  }, [selected]);

  // prevent background scrolling when modal is open
  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [selected]);

  // inject a global stylesheet (only once) to hide native scrollbars on the main page
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('global-hide-scrollbar')) return;
    const style = document.createElement('style');
    style.id = 'global-hide-scrollbar';
    style.innerHTML = `
      /* hide scrollbars visually but preserve scroll functionality */
      html, body { scrollbar-width: none; -ms-overflow-style: none; }
      html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; width: 0; height: 0; }
    `;
    document.head.appendChild(style);
    // keep the style for the app lifecycle; remove on unmount if desired
    return () => {
      try { const el = document.getElementById('global-hide-scrollbar'); if (el) el.remove(); } catch (e) {}
    };
  }, []);

  // carousel helpers (inside component so they can access carouselRef/modalImages)
  const getSlideWidth = () => {
    const el = carouselRef.current;
    if (!el || !el.firstElementChild) return 0;
    const child = el.firstElementChild;
    const style = window.getComputedStyle(child);
    const marginRight = parseFloat(style.marginRight || '0');
    return Math.round(child.getBoundingClientRect().width + marginRight);
  };

  const scrollToIndex = (idx) => {
    const el = carouselRef.current;
    if (!el) return;
    const slideW = getSlideWidth();
    if (!slideW) return;
    el.scrollTo({ left: idx * slideW, behavior: 'smooth' });
    currentIndex.current = idx;
  };

  const moveToNext = () => {
    const max = (modalImages?.length || 1) - 1;
    const next = clamp(currentIndex.current + 1, 0, max);
    scrollToIndex(next);
  };

  const moveToPrev = () => {
    const prev = clamp(currentIndex.current - 1, 0, (modalImages?.length || 1) - 1);
    scrollToIndex(prev);
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={() => setSelected(true)}
        className={`w-72 font-helvetica-compressed bg-[#131313] text-[#f5f5f5] rounded-2xl overflow-hidden border border-gray-800 shadow-lg flex flex-col p-2 cursor-pointer transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(true); }}
      >
        <img className="rounded-xl h-[230px] w-full object-cover" src={thumbnail} alt={title} style={{ objectPosition: 'center 65%' }} />
        <div className="p-4 flex flex-col justify-between flex-grow">
          <h2 className="font-helvetica-compressed text-3xl text-left mb-20 font-extrabold tracking-wide">{title}</h2>
          <div className="border-b border-gray-600 my-2" />
          <p className="text-left leading-tight uppercase text-md font-helvetica-compressed">{description}</p>
        </div>
      </div>
  {selected && createPortal(
  <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className={`absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${modalActive ? 'opacity-100' : 'opacity-0'}`} data-modal-overlay="light" onClick={closeModal} />

          <div className={`relative z-10 bg-transparent w-[96%] max-w-[1400px] h-[85vh] rounded-3xl transform transition-all duration-300 ${modalActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`} onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#131313] rounded-t-3xl h-16 px-6 flex items-center justify-end">
              <button onClick={closeModal} aria-label="Close modal" className="pt-6 bg-transparent rounded-full w-11 h-11 flex items-center justify-center hover:opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
                  <circle cx="21" cy="21" r="21" fill="#D9D9D9" />
                  <line x1="25.6774" y1="25.6777" x2="15.7779" y2="15.7782" stroke="black" strokeWidth={4} strokeLinecap="round" />
                  <line x1="15.7778" y1="25.6774" x2="25.6773" y2="15.7779" stroke="black" strokeWidth={4} strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="bg-[#131313] rounded-b-3xl pt-6 pb-0 h-[calc(100%-62px)] flex items-start">
              <div className="flex flex-col gap-4 px-8 w-full">
                {/* Carousel viewport */}
                <div className="relative w-full" style={{ overflow: 'hidden' }}>
                  {/* hide native scrollbar visually across browsers for the carousel track */}
                  <style>{`[data-carousel-track] { scrollbar-width: none; -ms-overflow-style: none; }
                    [data-carousel-track]::-webkit-scrollbar { display: none; }
                  `}</style>
                  <div
                    ref={carouselRef}
                    data-carousel-track
                    className="flex gap-0 py-1 px-1 overflow-x-auto"
                    style={{ cursor: 'grab', touchAction: 'pan-y', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
                    onPointerDown={(e) => {
                      const el = carouselRef.current;
                      if (!el) return;
                      isDragging.current = true;
                      startX.current = e.pageX - el.getBoundingClientRect().left;
                      startScroll.current = el.scrollLeft;
                      el.setPointerCapture?.(e.pointerId);
                      // show grabbing cursor while dragging
                      try { el.style.cursor = 'grabbing'; } catch (err) {}
                    }}
                    onPointerMove={(e) => {
                      const el = carouselRef.current;
                      if (!el || !isDragging.current) return;
                      const x = e.pageX - el.getBoundingClientRect().left;
                      const walk = x - startX.current;
                      el.scrollLeft = startScroll.current - walk;
                    }}
                    onPointerUp={(e) => {
                      const el = carouselRef.current;
                      if (!el) return;
                      isDragging.current = false;
                      try { el.releasePointerCapture?.(e.pointerId); } catch (err) {}
                      try { el.style.cursor = 'grab'; } catch (err) {}
                      // snap to nearest slide on release
                      const slideW = getSlideWidth();
                      if (!slideW) return;
                      const idx = Math.round(el.scrollLeft / slideW);
                      scrollToIndex(clamp(idx, 0, (modalImages?.length || 1) - 1));
                    }}
                    onPointerLeave={() => { isDragging.current = false; try { const el = carouselRef.current; if (el) el.style.cursor = 'grab'; } catch (err) {} }}
                    onWheel={(e) => {
                      const el = carouselRef.current;
                      if (!el) return;
                      // debounce wheel so quick scrolls only trigger one slide change
                      if (wheelDebounce.current) {
                        e.preventDefault();
                        return;
                      }
                      wheelDebounce.current = setTimeout(() => { wheelDebounce.current = null; }, 120);
                      if (e.deltaY > 0) moveToNext(); else moveToPrev();
                      e.preventDefault();
                    }}
                  >
                    {modalImages && modalImages.length > 0 ? modalImages.map((src, idx) => (
                        <div key={idx} className="flex-shrink-0" style={{ flex: '0 0 550px', width: '550px', scrollSnapAlign: 'center', marginRight: '6px' }}>
                        <div onClick={(e) => e.stopPropagation()}>
                          <img
                            className="w-[550px] h-[360px] object-cover rounded-sm bg-[#e6e6e6]"
                            src={src}
                            alt={`${title} ${idx}`}
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                            style={{ userSelect: 'none', WebkitUserDrag: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                          />
                        </div>
                      </div>
                    )) : (
                      <div className="w-full h-[360px] bg-gray-200 rounded-sm" />
                    )}
                  </div>
                </div>

                <div className="text-left mt-4 mb-6 ml-2">
                  <h3 className="font-helvetica-compressed text-2xl text-[#f5f5f5] font-extrabold uppercase tracking-wide mb-2">{title}</h3>
                  <p className="font-helvetica-compressed text-sm text-gray-300 uppercase leading-tight max-w-full">{bigDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>, document.body)
      }
    </>
  );
}

// helpers used by the carousel
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

