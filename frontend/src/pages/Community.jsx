import { useEffect, useState } from "react";
import { Loading } from "./Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios } = useAppContext();

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/user/published-images");

      if (data.success) {
        setImages(data.images);
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="w-full h-full mx-auto overflow-y-auto p-6 md:pt-10 xl:px-12 2xl:px-20 max-md:mt-16 scroll-smooth">
      <h2 className="mb-8 text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
        Community Images
      </h2>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {images.map((item, index) => (
            <a
              key={index}
              href={item.imageUrl}
              target="_blank"
              className="group relative block overflow-hidden rounded-lg bg-white dark:bg-[#1A1624]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(124,58,237,0.20)] transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={item.imageUrl}
                alt="Community Images"
                className="w-full h-60 md:h-50 2xl:h-62 object-cover transition-transform duration-500 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <p className="absolute inset-x-0 bottom-0 px-4 py-3 bg-linear-to-t from-black/80 via-black/40 to-transparent text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                Created by {item.userName}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-24 text-center text-lg text-gray-500 dark:text-gray-400">
          No Images Available.
        </p>
      )}
    </div>
  );
};
