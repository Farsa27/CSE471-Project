import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import axios from "axios";

export default function AdSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ads, setAds] = useState([]);

  // Fetch active ads from backend
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ads/active");
        if (res.data && res.data.length > 0) {
          setAds(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch ads:", err);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;

    const startSlider = () => {
      return setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 4000);
    };

    const interval = startSlider();
    return () => clearInterval(interval);
  }, [ads]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
  };

  // Don't render if no ads available
  if (ads.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner p-4 flex items-center justify-center gap-4">
      <a
        href={ads[currentIndex].link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <img
          src={`http://localhost:5000${ads[currentIndex].imageUrl}`}
          alt={ads[currentIndex].title}
          className="h-16 w-full object-fill rounded-2xl shadow-md"
        />
      </a>

      <button
        onClick={handleNext}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow"
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
}
