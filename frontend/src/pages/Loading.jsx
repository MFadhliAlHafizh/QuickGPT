import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export const Loading = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAppContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser();
      navigate("/");
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#09090B] via-[#1A1624] to-[#2E1065] text-white">
      <div className="relative z-10 h-14 w-14 rounded-full border-4 border-violet-300/30 border-t-violet-400 shadow-[0_0_30px_rgba(168,85,247,0.45)] animate-spin"></div>
    </div>
  );
};
