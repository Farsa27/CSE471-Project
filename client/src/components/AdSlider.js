import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

const imageList = [
  {
    image: "http://localhost:5000/uploads/ad1.png",
    link: "https://www.bkash.com/",
  },
  {
    image: "http://localhost:5000/uploads/ad2.png",
    link: "https://www.bracu.ac.bd/",
  },
  {
    image: "http://localhost:5000/uploads/ad3.png",
    link: "https://www.bracusa.org/countries/bangladesh/?utm_source=google&utm_medium=cpc&utm_campaign=Grant%20|%20Search&utm_content=Bangladesh&utm_ad=742999094797&utm_term=brac%20ngo&matchtype=b&device=c&GeoLoc=1001441&placement=&network=g&campaign_id=18827390309&adset_id=177300161957&ad_id=742999094797&gad_source=1&gad_campaignid=18827390309&gbraid=0AAAAACeQuqRaJ9tkRpXMDHBweq9wdRfJv&gclid=EAIaIQobChMIxdSvh93YkQMVEA2DAx3xKDTWEAAYASAAEgIyI_D_BwE",
  },
  {
    image: "http://localhost:5000/uploads/ad4.png",
    link: "https://www.aarong.com/bgd",
  },
];

export default function AdSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const startSlider = () => {
      return setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
      }, 4000);
    };

    const interval = startSlider();
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner p-4 flex items-center justify-center gap-4">
      <a
        href={imageList[currentIndex].link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <img
          src={imageList[currentIndex].image}
          alt="Advertisement"
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
