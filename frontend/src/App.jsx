import { Route, Routes, useLocation } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { ChatBox } from "./components/ChatBox"
import { Credits } from "./pages/Credits"
import { Community } from "./pages/Community"
import { useState } from "react"
import { assets } from "./assets/assets"
import "./assets/prism.css";
import { Loading } from "./pages/Loading"
import { useAppContext } from "./context/AppContext"
import { Authentication } from "./pages/Authentication"
import { Toaster } from "react-hot-toast";

function App() {
  const { user, loadingUser } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {pathname} = useLocation(); 

  if (pathname === "/loading" || loadingUser) return <Loading />

  return (
    <>
      <Toaster />
      {(!isMenuOpen && user) && <img src={assets.menu_icon} alt="Menu Icon" onClick={() => setIsMenuOpen(true)} className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert z-10" />}
    
      <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
        {user ? (
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />}></Route>
              <Route path="/credits" element={<Credits />}></Route>
              <Route path="/community" element={<Community />}></Route>
            </Routes>
          </div>
        ) : (
          <div className="w-screen h-screen flex justify-center items-center bg-linear-to-b from-[#242124] to-[#000000]">
            <Authentication />
          </div>
        )}
      </div>
    </>
  )
}

export default App
