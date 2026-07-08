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
      className={`flex flex-col min-w-72 h-screen p-5 dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F] transition-all duration-500 backdrop-blur-3xl max-md:absolute left-0 z-1 ${!isMenuOpen && "max-md:-translate-x-full"}`}
    >
      {/* Logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="Logo"
        className="w-full max-w-48"
      />

      {/* Button */}
      <button onClick={createNewChat} className="flex justify-center items-center py-2 mt-10 w-full bg-linear-to-b from-[#A456F7] to-[#3D81F6] rounded-md text-white cursor-pointer">
        <span className="text-xl mr-2">+</span>New Chat
      </button>

      {/* Search Input */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
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
          className="text-xs placeholder:text-gray-400 outline-none"
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
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
              className="flex justify-between py-2 px-4 border border-gray-300 dark:bg-[#57317C]/10 dark:border-[#80609F]/15 rounded-md cursor-pointer group"
            >
              <div>
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                src={assets.bin_icon}
                alt="Trash Icon"
                onClick={e => toast.promise(deleteChatHandler(e, chat._id), {loading: "deleting..."})}
                className="w-4 hidden group-hover:block not-dark:invert cursor-pointer"
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
        className="flex items-center gap-2 p-3 mt-4 text-sm border border-gray-300 dark:border-white/15 rounded-md transition-all hover:scale-103 cursor-pointer"
      >
        <img
          src={assets.gallery_icon}
          alt="Gallery Icon"
          className="w-4.5 not-dark:invert"
        />
        <p>Community Images</p>
      </div>

      {/* Credit Purchase Option */}
      <div
        onClick={() => {
          navigate("/credits");
          setIsMenuOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 text-sm border border-gray-300 dark:border-white/15 rounded-md transition-all hover:scale-103 cursor-pointer"
      >
        <img
          src={assets.diamond_icon}
          alt="Diamond Icon"
          className="w-4.5 dark:invert"
        />
        <div className="flex flex-col text-sm">
          <p>Credits : {user?.credits}</p>
          <p className="text-xs text-gray-400">
            Purchase credits to use QuickGPT
          </p>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <img
            src={assets.theme_icon}
            alt="Theme Icon"
            className="w-4.5 not-dark:invert"
          />
          <p>Dark Mode</p>
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
      <div className="flex items-center gap-3 p-3 mt-4 text-sm border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
        <img
          src={assets.user_icon}
          alt="User Icon"
          className="w-7 rounded-full"
        />
        <p className="flex-1 text-sm dark:text-primary truncate">
          {user ? user.name : "Login your account"}
        </p>
        <img
          src={assets.logout_icon}
          alt="Logout Icon"
          onClick={logoutHandler}
          className="h-5 hidden group-hover:block cursor-pointer not-dark:invert"
        />
      </div>

      {/* Close Icon */}
      <img
        src={assets.close_icon}
        alt="Close Icon"
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
      />
    </div>
  );
};
