import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import axios from "axios";

export default function AdSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ads, setAds] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

  // Fetch active ads from backend
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/ads/active`);
        if (res.data && res.data.length > 0) {
          setAds(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch ads:", err);
      }
    };

    fetchAds();
  }, [API_BASE]);

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
          src={`${API_BASE}${ads[currentIndex].imageUrl}`}
          alt={ads[currentIndex].title}
          className="h-16 w-full object-fill rounded-2xl shadow-md"
        />
      </a>

      <button
        onClick={handleNext}
        className="p-2 rounded-full bg-blue-950 hover:bg-blue-200 shadow"
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
}

