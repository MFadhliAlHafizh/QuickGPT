import { Route, Routes } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { ChatBox } from "./components/ChatBox"
import { Credits } from "./pages/Credits"
import { Community } from "./pages/Community"
import { useState } from "react"
import { assets } from "./assets/assets"

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {!isMenuOpen && <img src={assets.menu_icon} alt="Menu Icon" onClick={() => setIsMenuOpen(true)} className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert" />}
    
      <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
        <div className="flex h-screen w-screen">
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<ChatBox />}></Route>
            <Route path="/credits" element={<Credits />}></Route>
            <Route path="/community" element={<Community />}></Route>
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
