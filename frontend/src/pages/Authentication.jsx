import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export const Authentication = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { axios, setToken } = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const url = state === "login" ? "/api/user/login" : "/api/user/register";

    try {
      const { data } = await axios.post(url, { name, email, password });
      if (data.success) {
        if (state === "login") {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        } else {
          toast.success(data.message);
          setState("login");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, [state]);  

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-[#09090B] via-[#1A1624] to-[#2E1065] px-4">
      <form onSubmit={onSubmitHandler} className="flex w-full max-w-125 flex-col rounded-3xl border border-white/10 bg-white/5 px-10 py-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <img src="/favicon.svg" alt="Logo" className="mx-auto mb-5 w-16 drop-shadow-[0_0_25px_rgba(168,85,247,.45)]" />

        <h2 className="text-center text-4xl font-bold tracking-tight text-white">
          {state === "login" ? "Sign In" : "Sign Up"}
        </h2>

        <p className="mt-3 mb-8 text-center leading-6 text-gray-400">
          {state === "login"
            ? "Please enter email and password to access."
            : "Please provide your details to create an account."}
        </p>

        {state === "register" && (
          <div className="mb-4">
            <label className="font-medium tracking-wide text-gray-200">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Please enter your name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-gray-500 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
              required
              type="name"
              name="name"
            />
          </div>
        )}

        <div>
          <label className="font-medium tracking-wide text-gray-200">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Please enter your email"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-gray-500 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
            required
            type="email"
            name="email"
          />
        </div>

        <div className="mt-4">
          <label className="font-medium tracking-wide text-gray-200">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Please enter your password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-gray-500 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
            required
            type="password"
            name="password"
          />
        </div>

        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-blue-500 py-3 font-semibold text-white shadow-lg hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          {state === "login" ? "Sign In" : "Sign Up"}
        </button>
        {state === "register" ? (
          <p className="pt-2 text-center text-gray-400">
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="font-medium text-purple-400 transition-colors hover:text-purple-300 hover:underline cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p className="pt-2 text-center text-gray-400">
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="font-medium text-purple-400 transition-colors hover:text-purple-300 hover:underline cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
      </form>
    </main>
  );
};
