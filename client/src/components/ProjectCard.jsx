import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function ProjectCard({
  title,
  description,
  bigDescription,
  middleHeading,
  middleText,
  bottomText,
  projectLinkLabel,
  clientLabel,
  projectYear = '2025',
  showProjectLink = true,
  mediaLinkEnabled = true,
  overlayBadges = ['WEB DESIGN'],
  popupBadges = ['Web Design'],
  coverObjectPosition = 'center 62%',
  coverImageClassName = '',
  heroObjectPosition = '50% 50%',
  heroHeightClass = 'h-[clamp(22rem,48vw,36rem)]',
  wideMediaHeightClass = 'h-[clamp(22rem,48vw,36rem)]',
  detailImageClass = 'h-full object-cover object-[50%_22%]',
  detailSecondImageClass = 'h-full object-cover object-[50%_22%]',
  wideMediaImageClass = 'h-full object-cover object-[50%_22%]',
  thumbnail,
  modalImages = [],
  url = '#',
  className = '',
  variant = 'default',
  overlayTextColor = 'black'
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

  const isOverlayVariant = variant === 'overlay';
  const overlayTextClass = overlayTextColor === 'white' ? 'text-white' : 'text-black';
  const secondaryBadgeClass =
    overlayTextColor === 'white'
      ? 'bg-white/20 backdrop-blur-sm'
      : 'bg-white/35 backdrop-blur-sm';

  const cardClassName = isOverlayVariant
    ? `w-[clamp(16rem,27vw,25rem)] aspect-square bg-transparent rounded-[2.5rem] overflow-hidden border-[0.2rem] border-black cursor-pointer transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`
    : `w-72 font-helvetica-compressed bg-[#131313] text-[#f5f5f5] rounded-2xl overflow-hidden border border-gray-800 shadow-lg flex flex-col p-2 cursor-pointer transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`;

  const renderMediaBlock = (src, altText, wrapperClassName = '', imageClassName = '', objectPosition) => {
    if (src) {
      const mediaImage = (
        <img className={`w-full h-auto object-contain rounded-[1.45rem] bg-[#d9d9d9] ${imageClassName}`} src={src} alt={altText} style={objectPosition ? { objectPosition } : undefined} draggable={false} onDragStart={(e) => e.preventDefault()} />
      );

      if (mediaLinkEnabled && url && url !== '#') {
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`block ${wrapperClassName}`}>
            {mediaImage}
          </a>
        );
      }

      return (
        <div className={`block ${wrapperClassName}`}>
          {mediaImage}
        </div>
      );
    }

    return <div className={`w-full min-h-[12rem] rounded-[1.45rem] bg-[#d0d0d0] ${wrapperClassName}`} aria-hidden="true" />;
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={() => setSelected(true)}
        className={cardClassName}
        data-cursor-project={isOverlayVariant ? 'true' : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(true); }}
      >
        {isOverlayVariant ? (
          <div className="relative h-full w-full overflow-hidden">
            <img
              className={`h-full w-full object-cover ${coverImageClassName}`}
              src={thumbnail}
              alt={title}
              style={{ objectPosition: coverObjectPosition }}
            />
            <div className={`absolute top-0 left-0 p-[clamp(0.65rem,1.2vw,1rem)] ${overlayTextClass} text-left flex flex-col items-start`}>
              <h2 className="font-helvetica-compressed text-[clamp(1.1rem,1.6vw,1.75rem)] leading-none tracking-wide uppercase mb-1 text-left w-full">
                {title}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {overlayBadges.map((badge) => (
                  <p
                    key={badge}
                    className={`font-helvetica-compressed uppercase text-[clamp(0.62rem,0.82vw,0.9rem)] leading-tight opacity-95 text-left inline-flex items-center px-[clamp(0.4rem,0.75vw,0.62rem)] py-[clamp(0.12rem,0.24vw,0.2rem)] rounded-[0.42rem] ${secondaryBadgeClass}`}
                  >
                    {badge}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <img className="rounded-xl h-[230px] w-full object-cover" src={thumbnail} alt={title} style={{ objectPosition: 'center 65%' }} />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <h2 className="font-helvetica-compressed text-3xl text-left mb-20 font-extrabold tracking-wide">{title}</h2>
              <div className="border-b border-gray-600 my-2" />
              <p className="text-left leading-tight uppercase text-md font-helvetica-compressed">{description}</p>
            </div>
          </>
        )}
      </div>
  {selected && createPortal(
  <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className={`absolute inset-0 bg-white/55 backdrop-blur-sm transition-opacity duration-300 ${modalActive ? 'opacity-100' : 'opacity-0'}`} data-modal-overlay="light" onClick={closeModal} />

          <div className={`relative z-10 w-[98%] max-w-[1520px] h-[93vh] bg-[#131313] rounded-[2rem] transform transition-all duration-300 ${modalActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.985]'}`} onClick={(e) => e.stopPropagation()}>
            <div className="h-16 px-4 sticky top-0 z-10 bg-[#131313] rounded-t-[2rem]">
              <button onClick={closeModal} aria-label="Close modal" className="absolute top-4 right-4 bg-transparent rounded-full w-11 h-11 flex items-center justify-center hover:opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
                  <circle cx="21" cy="21" r="21" fill="#D9D9D9" />
                  <line x1="25.6774" y1="25.6777" x2="15.7779" y2="15.7782" stroke="black" strokeWidth={4} strokeLinecap="round" />
                  <line x1="15.7778" y1="25.6774" x2="25.6773" y2="15.7779" stroke="black" strokeWidth={4} strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <style>{`.modal-scroll-hide{scrollbar-width:none;-ms-overflow-style:none;}.modal-scroll-hide::-webkit-scrollbar{display:none;width:0;height:0;}`}</style>
            <div className="modal-scroll-hide h-[calc(100%-4rem)] overflow-y-auto px-[clamp(1rem,2vw,1.9rem)] pb-8">
              <div className="w-full rounded-b-[2rem] bg-[#131313] p-[clamp(1rem,2.1vw,1.85rem)]">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-7">
                  <div>
                    <h3 className="font-helvetica-compressed text-[clamp(2.2rem,3.6vw,3.4rem)] text-[#f5f5f5] font-extrabold uppercase leading-none tracking-wide">{title}</h3>
                    <p className="mt-4 font-spacemonobold text-[0.8rem] text-[#c8c8c8] uppercase leading-[1.55] max-w-[62ch]">{description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {popupBadges.map((badge) => (
                        <span
                          key={badge}
                          className="inline-flex rounded-[0.4rem] bg-white/20 px-3 py-1 text-[0.58rem] tracking-[0.12em] font-spacemonobold uppercase text-white/90"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-0 lg:pt-16">
                    <div className="space-y-2.5 text-[0.72rem] font-spacemonobold uppercase tracking-[0.07em] text-[#d5d5d5]">
                      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-white/45 pb-1.5">
                        <span className="text-[#d6ac42]">Client</span><span className="h-px bg-white/45" /><span>{clientLabel || title.split(' ')[0] || 'PROJECT'}</span>
                      </div>
                      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-white/45 pb-1.5">
                        <span className="text-[#d6ac42]">Year</span><span className="h-px bg-white/45" /><span>{projectYear}</span>
                      </div>
                      {showProjectLink && url && url !== '#' && (
                        <div className="grid grid-cols-[1fr] border-b border-white/45 pb-1.5 text-right">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors normal-case">
                            {projectLinkLabel || url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-[1.55rem] p-1.5 bg-[#131313]">
                  <div className={`w-full ${heroHeightClass} rounded-[1.45rem] overflow-hidden`}>
                    {renderMediaBlock(modalImages[0], `${title} hero`, 'h-full', 'h-full object-cover', heroObjectPosition) }
                  </div>
                </div>

                <div className="mt-14 mb-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <h4 className="font-helvetica-compressed text-[clamp(2rem,3.1vw,3.3rem)] text-[#f5f5f5] font-extrabold uppercase leading-[0.95]">{middleHeading || `${title}, management and execution`}</h4>
                  <p className="font-spacemonobold text-[0.8rem] text-[#c6c6c6] uppercase leading-[1.55] self-center">{middleText || bigDescription || description}</p>
                </div>

                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-[clamp(14rem,30vw,20rem)] rounded-[1.45rem] overflow-hidden">{renderMediaBlock(modalImages[1], `${title} detail 1`, 'h-full', detailImageClass)}</div>
                  <div className="h-[clamp(14rem,30vw,20rem)] rounded-[1.45rem] overflow-hidden">{renderMediaBlock(modalImages[2], `${title} detail 2`, 'h-full', detailSecondImageClass)}</div>
                </div>

                <div className={`mt-4 ${wideMediaHeightClass} rounded-[1.45rem] overflow-hidden`}>
                  {renderMediaBlock(modalImages[3] || modalImages[0], `${title} wide detail`, 'h-full', wideMediaImageClass) }
                </div>

                <p className="mt-8 font-spacemonobold text-[0.8rem] text-[#a9a9a9] uppercase leading-[1.55] text-left">
                  {bottomText || 'Project for a company. Creative direction, website design, UI system and production flow with emphasis on visual clarity and interaction quality.'}
                </p>
              </div>
            </div>
          </div>
        </div>, document.body)
      }
    </>
  );
}

