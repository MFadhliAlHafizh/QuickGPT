import { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import toast from "react-hot-toast";

export const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, user, theme, setTheme, navigate, setToken, token, axios, setChats, fetchUserChats, createNewChat } = useAppContext();
  const [search, setSearch] = useState("");

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged Out Successfully");
  }

  const deleteChatHandler = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirm = window.confirm("Are you sure you want to delete this chat?");
      if (!confirm) return 
      
      const { data } = await axios.post("/api/chat/delete", {chatId}, {headers: {Authorization: token}});
      
      if (data.success) {
        setChats(prev => prev.filter((chat) => chat._id !== chatId));
        await fetchUserChats();
        toast.success(data.message);
      }
    } catch (error) {
        toast.error(error.message);
    }
  }

  return (
    <div
      className={`flex flex-col min-w-72 h-screen p-5 bg-white/70 dark:bg-[#131018]/75 backdrop-blur-3xl border-r border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.25)] transition-all duration-500 max-md:absolute left-0 z-10 ${!isMenuOpen && "max-md:-translate-x-full"}`}
    >
      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="Logo"
        className="w-full max-w-42 drop-shadow-lg"
      />

      {/* Button */}
      <button onClick={createNewChat} className="flex justify-center items-center w-full py-1.5 mt-10 rounded-md bg-linear-to-r from-violet-500 via-fuchsia-500 to-blue-500 text-sm text-white font-sm shadow-lg hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
        <span className="text-xl mr-2">+</span>New Chat
      </button>

      {/* Search Input */}
      <div className="flex items-center gap-2 p-3 mt-2.5 bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-gray-300 dark:border-white/10 rounded-md shadow-sm">
        <img
          src={assets.search_icon}
          alt="Search Icon"
          className="w-4 not-dark:invert"
        />
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search conversations..."
          className="flex-1 bg-transparent text-xs placeholder:text-gray-400 outline-none"
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase()),
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
              className="group flex justify-between items-center p-2 rounded-md bg-gray-200/40 dark:bg-[#57317C]/15 border border-gray-300 dark:border-white/10 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all cursor-pointer shadow-sm"
            >
              <div>
                <p className="truncate w-full text-xs font-medium">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                src={assets.bin_icon}
                alt="Trash Icon"
                onClick={e => toast.promise(deleteChatHandler(e, chat._id), {loading: "deleting..."})}
                className="w-4 opacity-0 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer not-dark:invert"
              />
            </div>
          ))}
      </div>

      {/* Community Images */}
      <div
        onClick={() => {
          navigate("/community");
          setIsMenuOpen(false);
        }}
        className="group flex items-center gap-2 p-3 mt-4 text-sm rounded-md bg-white/5 border border-gray-300 dark:border-white/10 hover:bg-violet-500/10 hover:border-violet-500/30 hover:scale-[1.02] transition-all cursor-pointer"
      >
        <img
          src={assets.gallery_icon}
          alt="Gallery Icon"
          className="w-4 not-dark:invert"
        />
        <p className="text-xs">Community Images</p>
      </div>

      {/* Credit Purchase Option */}
      <div
        onClick={() => {
          navigate("/credits");
          setIsMenuOpen(false);
        }}
        className="group flex items-center gap-2 p-3 mt-2.5 text-sm rounded-md bg-white/5 border border-gray-300 dark:border-white/10 hover:bg-violet-500/10 hover:border-violet-500/30 hover:scale-[1.02] transition-all cursor-pointer"
      >
        <img
          src={assets.diamond_icon}
          alt="Diamond Icon"
          className="w-4 dark:invert"
        />
        <div className="flex flex-col text-sm">
          <p className="text-xs">Credits : {user?.credits}</p>
          <p className="text-[10px] text-gray-400">
            Purchase credits to use QuickGPT
          </p>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between gap-2 p-3 mt-2.5 rounded-md bg-white/5 border border-gray-300 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2 text-sm">
          <img
            src={assets.theme_icon}
            alt="Theme Icon"
            className="w-4 not-dark:invert"
          />
          <p className="text-xs">{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
        </div>

        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            checked={theme === "dark"}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-500 peer-checked:bg-purple-600 rounded-full transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      {/* User Account */}
      <div className="group flex items-center gap-3 p-3 mt-2.5 text-sm rounded-md bg-white/5 border border-gray-300 dark:border-white/10 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all cursor-pointer">
        <img
          src={assets.user_icon}
          alt="User Icon"
          className="w-5 rounded-full ring-2 ring-violet-400"
        />
        <p className="flex-1 text-sm font-medium dark:text-primary truncate">
          {user ? user.name : "Login your account"}
        </p>
        <img
          src={assets.logout_icon}
          alt="Logout Icon"
          onClick={logoutHandler}
          className="h-5 opacity-0 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer not-dark:invert"
        />
      </div>

      {/* Close Icon */}
      <img
        src={assets.close_icon}
        alt="Close Icon"
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden opacity-70 hover:opacity-100 hover:rotate-90 transition-all not-dark:invert"
      />
    </div>
  );
};
