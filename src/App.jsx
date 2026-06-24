import { Route, Routes } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { ChatBox } from "./components/ChatBox"
import { Credits } from "./pages/Credits"
import { Community } from "./pages/Community"

function App() {

  return (
    <>
      <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white">
        <div className="flex h-screen w-screen">
          <Sidebar></Sidebar>
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
