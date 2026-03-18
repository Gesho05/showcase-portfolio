import { useEffect, useState } from 'react'
import Header from './components/Header'
import Showcase from './components/Showcase'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logoLifted, setLogoLifted] = useState(false)
  const [shouldFlyLogo, setShouldFlyLogo] = useState(true)
  const [loaderLogoMarkup, setLoaderLogoMarkup] = useState('')

  useEffect(() => {
    if (!isLoading) return

    let attempts = 0
    const tryCaptureLogo = () => {
      const headerLogo = document.querySelector('#section-header svg[viewBox="0 0 5016 381"]')
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
    const inHeaderSection = window.scrollY <= window.innerHeight * 0.35
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
  }, [])

  useEffect(() => {
    if (!isLoading) {
      setShowContent(true)
    }
  }, [isLoading])

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
        <Header />
        <Showcase />
        <Footer />
      </div>
    </>
  )
}

export default App
