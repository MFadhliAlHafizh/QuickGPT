import { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();

  const fetcPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan");
      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Failed to fetch plans.");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetcPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="px-5 sm:px-8 lg:px-10 pb-14 pt-0 md:pt-10 mx-auto overflow-y-auto scroll-smooth max-md:mt-16">
      <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
        Credit Plans
      </h2>
      <div className="flex flex-wrap justify-center items-stretch gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`relative flex flex-col min-w-80 max-w-96 p-7 rounded-3xl backdrop-blur-xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(124,58,237,0.25)] ${
              plan._id === "pro"
                ? "bg-linear-to-br from-violet-500/15 to-fuchsia-500/10 border-violet-400/40 shadow-[0_15px_35px_rgba(124,58,237,0.20)]"
                : "bg-white dark:bg-[#1A1624]/80 border-gray-200 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            }`}
          >
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {plan.name}
              </h3>
              <p className="text-4xl font-extrabold text-violet-600 dark:text-violet-300">
                ${plan.price}{" "}
                <span className="text-base font-medium text-gray-500 dark:text-gray-300">
                  {" "}
                  / {plan.credits} credits
                </span>
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-200">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() =>
                toast.error("Sorry, this feature is not yet available")
              }
              className="mt-8 w-full rounded-xl bg-linear-to-r from-violet-500 via-fuchsia-500 to-blue-500 py-2 font-semibold text-white shadow-lg hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
