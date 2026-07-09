import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";
import { useEffect } from "react";

export const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div>
      {message.role === "user" ? (
        <div className="flex items-start justify-end gap-2 my-4">
          <div className="flex flex-col gap-3 px-6 py-3 bg-linear-to-br from-violet-500 via-fuchsia-500 to-blue-500 text-white rounded-2xl rounded-br-sm shadow-[0_10px_30px_rgba(124,58,237,0.35)] max-w-2xl">
            <p className="text-sm text-white wrap-break-word">{message.content}</p>
            <span className="text-xs text-white/70 self-end">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img
            src={assets.user_icon}
            alt="User Icon"
            className="w-10 h-10 rounded-full ring-2 ring-violet-400 shadow-md"
          />
        </div>
      ) : (
        <div className="flex items-start gap-3 my-6">
          <div className="flex flex-col gap-4 p-4 bg-white dark:bg-[#1B1624]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl rounded-bl-sm shadow-[0_10px_30px_rgba(0,0,0,0.15)] max-w-2xl">
            {message.isImage ? (
              <img
                src={message.content}
                alt="Content Image"
                className="w-full max-w-sm rounded-2xl border border-white/10 shadow-xl"
              />
            ) : (
              <div className="reset-tw text-sm text-gray-800 dark:text-gray-100 wrap-break-word"><Markdown>{message.content}</Markdown></div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">{moment(message.timestamp).fromNow()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
