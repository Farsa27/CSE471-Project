import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

const imageList = [
  "http://localhost:5000/uploads/ad1.png",
  "http://localhost:5000/uploads/ad2.png",
  "http://localhost:5000/uploads/ad3.png",
  "http://localhost:5000/uploads/ad4.png",
];

export default function AdSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    const startSlider = () => {
      return setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
      }, 2000); // or whatever interval you prefer
    };

    let interval = startSlider();

    return () => clearInterval(interval); // cleanup
  }, []);

  // const handleNext = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  // };
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };


  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner p-4 flex items-center justify-center gap-4">
    <img
    src={imageList[currentIndex]}
    alt="Advertisement"
    //className="h-24 object-contain rounded-2xl shadow-md"
    className="h-16 w-full object-cover rounded-2xl shadow-md"
    />

      <button
        onClick={handleNext}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow"
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
}
