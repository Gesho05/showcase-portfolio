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
          <div className={`absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${modalActive ? 'opacity-100' : 'opacity-0'}`} onClick={closeModal} />

          <div className={`relative z-10 bg-transparent w-[96%] max-w-[1400px] h-[85vh] rounded-3xl transform transition-all duration-300 ${modalActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`} onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#131313] rounded-t-3xl h-16 px-6 flex items-center justify-end">
              <button onClick={closeModal} className="bg-white text-black rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold hover:opacity-90">×</button>
            </div>

            <div className="bg-[#131313] rounded-b-3xl pt-6 pb-0 h-[calc(100%-72px)] flex items-start">
              <div className="flex flex-col gap-4 px-8 w-full">
                <div className="flex gap-6 w-full px-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`${i === 2 ? 'w-[120px]' : 'flex-1'} bg-[#e6e6e6] rounded-sm h-full min-h-[360px]`}>
                      {modalImages[i] ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <img className="w-full h-[360px] object-cover rounded-sm bg-[#e6e6e6]" src={modalImages[i]} alt={`${title} ${i}`} />
                        </a>
                      ) : null}
                    </div>
                  ))}
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
