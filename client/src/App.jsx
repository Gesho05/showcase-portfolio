import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Showcase from './components/Showcase'
import About from './components/About'
import Footer from './components/Footer'
import './App.css'

function App() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [routeOpacity, setRouteOpacity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logoLifted, setLogoLifted] = useState(false)
  const [shouldFlyLogo, setShouldFlyLogo] = useState(true)
  const [loaderLogoMarkup, setLoaderLogoMarkup] = useState('')
  const [headerGhostMarkup, setHeaderGhostMarkup] = useState('')
  const [showHeaderGhost, setShowHeaderGhost] = useState(false)
  const [customCursorEnabled, setCustomCursorEnabled] = useState(false)
  const [cursorProjectMode, setCursorProjectMode] = useState(false)
  const [cursorLabel, setCursorLabel] = useState('')
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const cursorRef = useRef(null)
  const cursorProjectModeRef = useRef(false)
  const effectiveCustomCursorEnabled = customCursorEnabled && !isProjectModalOpen

  useEffect(() => {
    if (!isLoading) return

    let attempts = 0
    const tryCaptureLogo = () => {
      const headerLogo = document.querySelector('#section-header svg[viewBox="0 0 5016 381"], [data-persistent-header="true"] svg[viewBox="0 0 5016 381"]')
      if (headerLogo) {
        setLoaderLogoMarkup(headerLogo.outerHTML)
        return true
      }
      return false
    }

    if (tryCaptureLogo()) return

    const intervalId = window.setInterval(() => {
      attempts += 1
      if (tryCaptureLogo() || attempts > 25) {
        window.clearInterval(intervalId)
      }
    }, 60)

    return () => window.clearInterval(intervalId)
  }, [isLoading])

  useEffect(() => {
    setLogoLifted(false)
    const inHeaderSection = location.pathname === '/' && window.scrollY <= window.innerHeight * 0.35
    setShouldFlyLogo(inHeaderSection)

    let current = 0

    const progressInterval = window.setInterval(() => {
      current = Math.min(100, current + Math.floor(Math.random() * 10) + 5)
      setProgress(current)

      if (inHeaderSection && current >= 90) {
        setLogoLifted(true)
      }

      if (current >= 100) {
        window.clearInterval(progressInterval)
      }
    }, 110)

    const showContentTimer = window.setTimeout(() => {
      setShowContent(true)
    }, 2500)

    const startExitTimer = window.setTimeout(() => {
      setIsExiting(true)
    }, 2850)

    const removeLoaderTimer = window.setTimeout(() => {
      setIsLoading(false)
    }, 3600)

    return () => {
      window.clearInterval(progressInterval)
      window.clearTimeout(showContentTimer)
      window.clearTimeout(startExitTimer)
      window.clearTimeout(removeLoaderTimer)
    }
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return

    const persistentHeaderNode = document.querySelector('[data-persistent-header="true"]')
    if (persistentHeaderNode) {
      setHeaderGhostMarkup(persistentHeaderNode.outerHTML)
      setShowHeaderGhost(true)
    } else {
      setHeaderGhostMarkup('')
      setShowHeaderGhost(false)
    }

    setRouteOpacity(0)

    const swapTimer = window.setTimeout(() => {
      setDisplayLocation(location)
      requestAnimationFrame(() => {
        setRouteOpacity(1)
      })
    }, 360)

    const hideGhostTimer = window.setTimeout(() => {
      setShowHeaderGhost(false)
      setHeaderGhostMarkup('')
    }, 520)

    return () => {
      window.clearTimeout(swapTimer)
      window.clearTimeout(hideGhostTimer)
    }
  }, [location, displayLocation.pathname])

  useEffect(() => {
    if (!isLoading) {
      setShowContent(true)
    }
  }, [isLoading])

  useEffect(() => {
    const prefersFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!prefersFinePointer) {
      setCustomCursorEnabled(false)
      return
    }

    setCustomCursorEnabled(true)

    const handleMove = (event) => {
      const cursor = cursorRef.current
      if (!cursor) return
      cursor.style.left = `${event.clientX}px`
      cursor.style.top = `${event.clientY}px`
      cursor.style.opacity = '1'

      const el = event.target?.closest?.('[data-cursor-project="true"]')
      const overProjectCard = !!el
      if (overProjectCard !== cursorProjectModeRef.current) {
        cursorProjectModeRef.current = overProjectCard
        setCursorProjectMode(overProjectCard)
      }

      if (overProjectCard && el) {
        const label = el.getAttribute('data-cursor-label') || 'SEE PROJECT ↗'
        setCursorLabel(label)
      } else {
        setCursorLabel('')
      }
    }

    const hideCursor = () => {
      const cursor = cursorRef.current
      if (!cursor) return
      cursor.style.opacity = '0'
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseenter', handleMove)
    window.addEventListener('mouseleave', hideCursor)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseenter', handleMove)
      window.removeEventListener('mouseleave', hideCursor)
    }
  }, [])

  useEffect(() => {
    const syncModalState = () => {
      const modalNode = document.querySelector('[data-modal-overlay="light"]')
      const isOpen = Boolean(modalNode)
      setIsProjectModalOpen(isOpen)
      if (isOpen) {
        cursorProjectModeRef.current = false
        setCursorProjectMode(false)
        setCursorLabel('')
      }
    }

    syncModalState()
    const observer = new MutationObserver(syncModalState)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (effectiveCustomCursorEnabled) {
      document.body.classList.add('custom-cursor-enabled')
      document.documentElement.classList.add('custom-cursor-enabled')
    } else {
      document.body.classList.remove('custom-cursor-enabled')
      document.documentElement.classList.remove('custom-cursor-enabled')
    }

    return () => {
      document.body.classList.remove('custom-cursor-enabled')
      document.documentElement.classList.remove('custom-cursor-enabled')
    }
  }, [effectiveCustomCursorEnabled])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    if (isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = previousOverflow || ''
    }

    return () => {
      document.body.style.overflow = previousOverflow || ''
    }
  }, [isLoading])

  useEffect(() => {
    // Clear any accidental inline zoom/transform previously applied
    try {
      document.documentElement.style.transform = ''
      document.documentElement.style.zoom = ''
      document.body.style.transform = ''
      document.body.style.zoom = ''
    } catch (e) {
      // ignore
    }
  }, [location.pathname, isLoading])

  useEffect(() => {
    const preventAction = (event) => {
      event.preventDefault()
    }

    document.addEventListener('copy', preventAction)
    document.addEventListener('cut', preventAction)
    document.addEventListener('selectstart', preventAction)
    document.addEventListener('contextmenu', preventAction)
    document.addEventListener('dragstart', preventAction)

    return () => {
      document.removeEventListener('copy', preventAction)
      document.removeEventListener('cut', preventAction)
      document.removeEventListener('selectstart', preventAction)
      document.removeEventListener('contextmenu', preventAction)
      document.removeEventListener('dragstart', preventAction)
    }
  }, [])

  return (
    <>
      {isLoading && (
        <div
          className={`fixed inset-0 z-[300] bg-[#131313] text-[#f5f5f5] flex flex-col items-center justify-center px-6 transition-opacity duration-700 ${
            isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div
            className={`fixed transition-[left,top,width,transform] duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-center ${
              logoLifted && shouldFlyLogo
                ? 'left-1 top-1 w-[calc(100vw-0.5rem)] translate-x-0 translate-y-0 scale-100'
                : 'left-1/2 top-[calc(50%-5.35rem)] w-[min(72vw,980px)] -translate-x-1/2 -translate-y-1/2 scale-[0.72]'
            }`}
          >
            {loaderLogoMarkup ? (
              <div
                className="w-full [&_path]:fill-[#f5f5f5]"
                dangerouslySetInnerHTML={{ __html: loaderLogoMarkup }}
              />
            ) : (
              <div className="font-helvetica-compressed uppercase tracking-[0.22em] text-[clamp(2.2rem,7vw,5.4rem)] leading-none text-center">
                LOADING
              </div>
            )}
          </div>

          <div className="w-[min(72vw,460px)] mt-10">
            <div className="h-[2px] bg-white/25 overflow-hidden">
              <div
                className="h-full bg-[#f5f5f5] transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="font-spacemonobold text-[0.65rem] tracking-widest text-right mt-2 opacity-80">
              {progress}%
            </div>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-900 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="transition-opacity duration-[360ms] ease-in-out" style={{ opacity: routeOpacity }}>
          <Routes location={displayLocation} key={displayLocation.pathname}>
            <Route
              path="/"
              element={(
                <>
                  <Header />
                  <Showcase />
                  <Footer />
                </>
              )}
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>

      {showHeaderGhost && headerGhostMarkup && (
        <div
          className="fixed inset-0 z-[140] pointer-events-none transition-opacity duration-150 ease-out"
          style={{ opacity: routeOpacity === 0 ? 1 : 0 }}
          aria-hidden="true"
        >
          <div className="pointer-events-none" dangerouslySetInnerHTML={{ __html: headerGhostMarkup }} />
        </div>
      )}

      {effectiveCustomCursorEnabled && (
        <div
          ref={cursorRef}
          className={`fixed z-[500] pointer-events-none opacity-0 transition-[width,height,border-radius,background-color,box-shadow,opacity] duration-200 ease-out flex items-center justify-center ${
            cursorProjectMode
              ? 'w-[7.35rem] h-[2.3rem] rounded-[0.58rem] bg-white border border-white/20 mix-blend-difference shadow-[0_8px_24px_rgba(0,0,0,0.35)] px-[0.78rem]'
              : 'w-4 h-4 rounded-[0.3rem] bg-white mix-blend-difference border-0'
          }`}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
            {cursorProjectMode && (
            <span
              className="uppercase text-black text-[0.82rem] tracking-[0.01em] leading-none whitespace-nowrap"
              style={{ fontFamily: "'SpaceMonoBold', sans-serif" }}
            >
              {cursorLabel || 'SEE PROJECT ↗'}
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default App
