import { useEffect, useState } from "react";
import { dummyPlans } from "../assets/assets";
import { Loading } from "./Loading";

export const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetcPlans = async () => {
    setPlans(dummyPlans);
    setLoading(false);
  };

  useEffect(() => {
    fetcPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-12 mx-auto overflow-y-scroll max-md:mt-14">
      <h2 className="text-3xl text-gray-800 dark:text-white text-center font-semibold mb-10">
        Credit Plans
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`border border-gray-400 dark:border-purple-700 rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-75 flex flex-col ${plan._id === "pro" ? "bg-purple-50 dark:bg-purple-900" : "bg-white dark:bg-transparent"}`}
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-300">
                ${plan.price}{" "}
                <span className="text-base font-normal text-gray-600 dark:text-purple-200">
                  {" "}
                  / {plan.credits} credits
                </span>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-purple-200 space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button className="mt-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium py-2 rounded transition-colors cursor-pointer">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
