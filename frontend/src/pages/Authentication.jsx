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
    <main className="flex items-center justify-center w-full px-4">
      <form onSubmit={onSubmitHandler} className="flex w-full flex-col max-w-125 px-8 py-4 bg-[#57317C]/30 rounded-lg border border-[#80609F]/30">
        <img src="/favicon.svg" alt="Logo" className="w-12 mb-4 mx-auto" />

        <h2 className="text-4xl font-medium text-white text-center">
          {state === "login" ? "Sign In" : "Sign Up"}
        </h2>

        <p className="mt-2 mb-6 text-base text-gray-300 text-center">
          {state === "login"
            ? "Please enter email and password to access."
            : "Please provide your details to create an account."}
        </p>

        {state === "register" && (
          <div className="mb-4">
            <label className="font-medium text-white">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Please enter your name"
              className="mt-2 text-gray-300 rounded-md ring ring-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-2 w-full"
              required
              type="name"
              name="name"
            />
          </div>
        )}

        <div>
          <label className="font-medium text-white">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Please enter your email"
            className="mt-2 text-gray-300 rounded-md ring ring-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-2 w-full"
            required
            type="email"
            name="email"
          />
        </div>

        <div className="mt-4">
          <label className="font-medium text-white">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Please enter your password"
            className="mt-2 text-gray-300 rounded-md ring ring-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-2 w-full"
            required
            type="password"
            name="password"
          />
        </div>

        <button
          type="submit"
          className="mt-6 py-2 w-full cursor-pointer rounded-md bg-indigo-600 text-white transition hover:bg-indigo-700"
        >
          {state === "login" ? "Sign In" : "Sign Up"}
        </button>
        {state === "register" ? (
          <p className="text-center text-gray-300 py-2">
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-purple-400 cursor-pointer hover:underline"
            >
              click here
            </span>
          </p>
        ) : (
          <p className="text-center text-gray-300 py-2">
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-purple-400 cursor-pointer hover:underline"
            >
              click here
            </span>
          </p>
        )}
      </form>
    </main>
  );
};
