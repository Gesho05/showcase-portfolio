import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import CrossyImg from "../assets/images/OB-cover.png";
import CrossyComputer from "../assets/images/OB-computer.png";
import CrossyComputer2 from "../assets/images/computer-crossy2.png";
import CrossyPhone from "../assets/images/phone-crossy.png";

export default function Projects2() {
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const cardRef = React.useRef(null);

  // Close modal with exit animation then unmount
  const closeModal = () => {
    setModalActive(false);
    // match CSS duration (300ms)
    setTimeout(() => setSelected(null), 300);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Animate cards on mount
  // Animate cards when they enter the viewport
  useEffect(() => {
    const node = cardRef.current;
    if (!node) {
      // fallback: show if ref not available
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(node);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Control modal enter animation when `selected` changes
  useEffect(() => {
    if (selected) {
      // ensure modal mounts first (selected controls mount), then activate animation
      requestAnimationFrame(() => setModalActive(true));
    } else {
      // when unmounted externally, ensure modalActive is false
      setModalActive(false);
    }
  }, [selected]);

  const projectData = {
    title: "OWEN BRYCE PROJECT",
    description:
      'A PROTOTYPE WEBSITE CREATED FOR THE ARTIST OWEBN BRTYCE',
    image: CrossyImg,
    // set this to the live/demo URL for the project
    url: 'https://crossy-road-clone-steel.vercel.app'
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={() => setSelected(projectData)}
        className={`w-72 font-helvetica-compressed bg-[#131313] text-[#f5f5f5] rounded-2xl overflow-hidden border border-gray-800 shadow-lg flex flex-col p-2 cursor-pointer transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setSelected(projectData);
        }}
      >
        <img
          className="rounded-xl h-[230px] w-full object-cover"
          src={CrossyImg}
          alt="Project Crossy Clone Thumbnail"
          style={{ objectPosition: "center 10%" }}
        />
        <div className="p-4 flex flex-col justify-between flex-grow">
          <h2 className="font-helvetica-compressed text-3xl text-left mb-20 font-extrabold tracking-wide">{projectData.title}</h2>
          <div className="border-b border-gray-600 my-2"></div>
          <p className="text-left leading-tight uppercase text-md font-helvetica-compressed">
            {projectData.description}
          </p>
        </div>
      </div>

      {selected && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Overlay (lighten the page behind the modal) */}
          <div
            className={`absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${modalActive ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => closeModal()}
          />

          {/* Modal Content - animate scale/fade/slide */}
          <div
            className={`relative z-10 bg-transparent w-[96%] max-w-[1400px] h-[85vh] rounded-3xl transform transition-all duration-300 ${modalActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top black bar with close */}
              <div className="bg-[#131313] rounded-t-3xl h-16 px-6 flex items-center justify-end">
              <button
                onClick={() => closeModal()}
                className="bg-white text-black rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold hover:opacity-90"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Main white/light area containing three panels */}
            <div className="bg-[#131313] rounded-b-3xl pt-6 pb-0 h-[calc(100%-92px)] flex items-start">
              <div className="flex flex-col gap-4 px-8 w-full">
                  <div className="flex gap-6 w-full px-2">
                    {/* Left big panel (with blue border highlight) */}
                    <div className="flex-1 bg-[#e6e6e6] rounded-sm h-full min-h-[360px]">
                        <a href={projectData.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <img className="w-full h-[360px] object-cover rounded-sm bg-[#e6e6e6]" src={CrossyComputer} alt="Project Crossy Clone" />
                        </a>
                    </div>
                    {/* Center panel */}
                    <div className="flex-1 bg-[#e6e6e6] rounded-sm h-full min-h-[360px]">
                        <a href={projectData.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <img className="w-full h-[360px] object-cover rounded-sm bg-[#e6e6e6]" src={CrossyPhone} alt="Project Crossy Clone" />
                        </a>
                    </div>
                    {/* Right skinny panel */}
                    <div className="w-[120px] bg-[#e6e6e6] rounded-sm h-full min-h-[360px]">
                        <a href={projectData.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <img className="w-full h-[360px] object-cover rounded-sm bg-[#e6e6e6]" src={CrossyComputer2} alt="Project Crossy Clone"  />
                        </a>
                    </div>
                  </div>
                  <div className="text-left mt-4 mb-6 ml-2">
                    <h3 className="font-helvetica-compressed text-2xl text-[#f5f5f5] font-extrabold uppercase tracking-wide mb-2">{selected.title}</h3>
                    <p className="font-helvetica-compressed text-sm text-gray-300 uppercase leading-tight max-w-full">{selected.description}</p>
                  </div>
              </div>
            </div>

          </div>
        </div>, document.body)
      }
    </>
  );
}
