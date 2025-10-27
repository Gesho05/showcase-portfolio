import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Projects from './components/Projects'
import Header from './components/Header'
import Showcase from './components/Showcase'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div>
      <Header />
      <Showcase  />
     </div>
    </>
  )
}

export default App
