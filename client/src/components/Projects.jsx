import React, { useState, useEffect } from "react";
import CrossyImg from "../assets/images/Crossy.png";

export default function Projects() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const projectData = {
    title: "CROSSY ROAD CLONE",
    description:
      'A CLONE OF THE POPULAR MOBILE GAME "CROSSY ROAD", BUILT AS A WEB APPLICATION USING THREE.JS',
    image: CrossyImg,
  };

  return (
    <>
      <div
        onClick={() => setSelected(projectData)}
        className="w-72 font-helvetica-compressed bg-[#131313] text-[#f5f5f5] rounded-2xl overflow-hidden border border-gray-800 shadow-lg flex flex-col p-2 cursor-pointer"
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
          style={{ objectPosition: "center 65%" }}
        />
        <div className="p-4 flex flex-col justify-between flex-grow">
          <h2 className="font-helvetica-compressed text-3xl text-left mb-20 font-extrabold tracking-wide">{projectData.title}</h2>
          <div className="border-b border-gray-600 my-2"></div>
          <p className="text-left leading-tight uppercase text-md font-helvetica-compressed">
            {projectData.description}
          </p>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Overlay (lighten the page behind the modal) */}
          <div
            data-modal-overlay="light"
            className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />

          {/* Modal Content - match attached mock: black top bar, three panels, black footer */}
          <div
            className="relative z-10 bg-transparent w-[96%] max-w-[1400px] h-[85vh] rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top black bar with close */}
            <div className="bg-[#131313] rounded-t-3xl h-16 px-6 flex items-center justify-end">
              <button
                onClick={() => setSelected(null)}
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
                    <img
                      src={CrossyImg}
                      alt={`${projectData.title} preview`}
                      className="flex-1 rounded-sm h-full min-h-[360px] object-cover border-4 border-[#0096ff]"
                      style={{ objectPosition: "center 30%" }}
                    />
                    {/* Center panel */}
                    <div className="flex-1 bg-[#e6e6e6] rounded-sm h-full min-h-[360px]"></div>
                    {/* Right skinny panel */}
                    <div className="w-[120px] bg-[#e6e6e6] rounded-sm h-full min-h-[360px]"></div>
                  </div>
                  <div className="text-left mt-4 mb-6 ml-2">
                    <h3 className="font-helvetica-compressed text-2xl text-[#f5f5f5] font-extrabold uppercase tracking-wide mb-2">{selected.title}</h3>
                    <p className="font-helvetica-compressed text-sm text-gray-300 uppercase leading-tight max-w-full">{selected.description}</p>
                  </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
