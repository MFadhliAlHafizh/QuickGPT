import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { Message } from "./Message";
import toast from "react-hot-toast";

export const ChatBox = () => {
  const { selectedChat, theme, user, setUser, token, axios } = useAppContext();

  const containerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      if (!user) return toast("Login to send message");
      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedChat._id, prompt, isPublished },
        { headers: { Authorization: token } },
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);
        // Decrease Credits
        if (mode === "image") {
          setUser((prev) => [{ ...prev, credits: prev.credits - 2 }]);
        } else {
          setUser((prev) => [{ ...prev, credits: prev.credits - 1 }]);
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-8 xl:mx-28 2xl:mx-36 max-md:mt-16 transition-all duration-300">
      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 mb-6 overflow-y-auto pr-2 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-primary animate-fade-in">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="Logo"
              className="w-full max-w-56 sm:max-w-68 drop-shadow-[0_0_30px_rgba(168,85,247,0.35)]"
            />

            <p className="mt-2 text-4xl sm:text-6xl font-semibold tracking-tight text-center text-gray-500 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* Three Dots Loading */}
        {loading && (
          <div className="loader flex items-center gap-2 py-3">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-300 animate-bounce shadow-md"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-300 animate-bounce shadow-md"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-300 animate-bounce shadow-md"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-3 px-4 py-2 mb-4 mx-auto rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="cursor-pointer"
          />
        </label>
      )}

      <form
        onSubmit={onSubmitHandler}
        className="w-full px-5 py-2 rounded-full bg-white/70 dark:bg-[#1A1624]/80 backdrop-blur-xl border border-gray-300 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.18)] flex items-center gap-4 transition-all"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="px-3 py-2 rounded-lg bg-transparent text-sm outline-none hover:bg-white/5 transition-colors"
        >
          <option value="text" className="bg-white dark:bg-[#2A2036]">
            Text
          </option>
          <option value="image" className="bg-white dark:bg-[#2A2036]">
            Image
          </option>
        </select>
        <input
          type="text"
          placeholder="Type your prompt here..."
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          className="flex-1 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
        <button type="submit" disabled={loading} className="rounded-full hover:scale-110 active:scale-95 transition-all">
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="Send Button"
            className="w-8 cursor-pointer"
          />
        </button>
      </form>
    </div>
  );
};
