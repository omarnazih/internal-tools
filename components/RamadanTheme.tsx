'use client'
import { useEffect, useState } from 'react';

const CrescentMoon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-pulse">
        <path
            d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.83 21 13.63 20.88 14.39 20.67C13.52 19.85 13 18.69 13 17.4C13 14.98 14.98 13 17.4 13C18.69 13 19.85 13.52 20.67 14.39C20.88 13.63 21 12.83 21 12C21 7.03 16.97 3 12 3Z"
            fill="#FFD700"
            filter="    "
        />
    </svg>
);

const Lantern = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-swing">
        <path
            d="M8 2H16V4C16 5.1 15.1 6 14 6H10C8.9 6 8 5.1 8 4V2Z"
            fill="#FFD700"
            filter="    "
        />
        <path
            d="M4 7H20V14C20 16.21 18.21 18 16 18H8C5.79 18 4 16.21 4 14V7Z"
            fill="#FFD700"
            filter="    "
        />
        <path
            d="M9 19H15V22H9V19Z"
            fill="#FFD700"
            filter="    "
        />
    </svg>
);

const RamadanTheme = () => {
  const isRamadan = () => {
    const today = new Date();

    const hijriFormatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
      month: "numeric",
      day: "numeric",
    });

    const hijriParts = hijriFormatter.formatToParts(today);
    const hijriMonth = parseInt(
      hijriParts.find((part) => part.type === "month")?.value || "0"
    );

    return hijriMonth === 9;
  };

  // Only render Ramadan-specific content if it's Ramadan
  if (!isRamadan()) {
    return null;
  }

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((v) => !v);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <CrescentMoon />
        <div
          className={`text-2xl font-arabic transition-opacity duration-1000 ${
            isVisible ? "opacity-100" : "opacity-60"
          }`}
          style={{
            color: "#FFD700",
            textShadow: "0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700",
          }}
        >
          رمضان مبارك
        </div>
        <Lantern />
      </div>
    </div>
  );
};

export default RamadanTheme;