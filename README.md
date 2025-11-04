# Showcase Portfolio

A small portfolio / showcase site built with a Vite + React frontend and the prerequsites for addition og a Database with Node/Express backend (MERN-style). The frontend uses Tailwind CSS for styling and includes a modal project viewer with a draggable, scrollable carousel.

## Features

- Vite + React frontend (`client/`)
- Node + Express backend skeleton (`server/`)
- Tailwind CSS for styling
- Project modal with a light overlay (`data-modal-overlay="light"`) and a draggable, scroll-snap carousel
- Images in the modal are fixed-size, non-draggable, and the page body is locked while the modal is open
- Close button in the modal: custom SVG
- Footer links are anchors and can be wired to external URLs

## Repo layout (important paths)

- `client/` — React + Vite frontend
  - `client/src/components/ProjectCard.jsx` — project card & modal carousel logic and styles
  - `client/src/components/Header.jsx` — header (logo, shrink-on-scroll behavior may be implemented here)
  - `client/src/components/Footer.jsx` — footer (clickable anchors for social/email/whatsapp)
- `server/` — Express server


## Quick start (development)

Open two terminals (or tabs). Commands below assume you're on Windows (cmd.exe) and run from the repository root.

Frontend

```cmd
cd client
npm install
npm run dev
```

Backend

```cmd
cd server
npm install
npm run dev
```

## Build for production

Build the frontend

```cmd
cd client
npm run build
```

## What to edit (developer guide)

- Carousel behavior and sizing: edit `client/src/components/ProjectCard.jsx`
  - The carousel track uses CSS scroll-snap and pointer events for dragging.
  - The code locks body scrolling while the modal is open by setting `document.body.style.overflow = 'hidden'`.
  - Scrollbars are visually hidden via injected CSS; the track remains scrollable.
  - Images are set `draggable={false}` and user-select is disabled to avoid drag ghosts.

- Header shrink/color behavior: edit `client/src/components/Header.jsx`
  - Previous edits to the header introduced JSX issues in the past; re-open the file and test carefully when changing scroll listeners or JSX structure.

- Footer links: `client/src/components/Footer.jsx` contains anchors for INSTAGRAM / EMAIL / WHATSAPP — replace `href="#"` with real links or `mailto:`/`tel:` as needed.

## Known issues & notes

- Header edits: earlier attempts to make the header shrink on scroll introduced malformed JSX and compile errors. If you change `Header.jsx`, run the dev server and check the browser console / terminal for syntax errors.
- Global scrollbar hiding: the app injects a small stylesheet to hide native scrollbars on `html, body`. This is visual-only — scroll still works. If you'd rather not hide global scrollbars, remove the injected style in `ProjectCard.jsx`.
- Modal stacking: the implementation uses a simple body overflow lock when a modal opens. If you plan nested modals, consider implementing a modal stack counter to avoid re-enabling scrolling while another modal is still open.
- Backend: Doesent work and need to to connect to database. 

## Testing checklist

- Click a project card to open the modal. Verify:
  - The background page does not scroll while the modal is open.
  - The modal overlay uses a light background (`data-modal-overlay="light"`).
  - Drag horizontally on the carousel — it should move and snap to slides on release.
  - Hover the carousel and use the wheel — each scroll tick advances one slide (debounced).
  - Images do not produce drag ghosts (they are non-draggable).
  - Close the modal using the SVG close button.


