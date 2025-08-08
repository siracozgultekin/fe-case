"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import TuneIcon from "@mui/icons-material/Tune";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useHeaderStore } from "@/store/headerStore";

export default function Navbar() {
  const { collectionName, productCount } = useHeaderStore();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const handleMenu = () => {
    // Menu handling logic here
  };

  const pathname = usePathname();

  return (
    <div className="flex justify-between  p-5 w-full  border rounded-xl ">
      <div className="flex  flex-col items-baseline ">
        {pathname === "/edit" ? (
          <div>
            <h2 className="font-bold">Sabitleri Düzenle</h2>
            <div className="flex items-center gap-3">
              <h3 className=" ">{collectionName || "Koleksiyon"}</h3>
              <span className="text-sm text-gray-600">
                /{productCount} Ürün
              </span>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-bold">Koleksiyon</h2>
            <p>Koleksiyon Listesi</p>
          </div>
        )}
      </div>
      <div className="flex items-center px-10 gap-4">
        {/* Dark/Light Theme Toggle */}
        <div className="flex items-center gap-2">
          <LightModeIcon className="w-4 h-4 text-yellow-500" />
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <DarkModeIcon className="w-4 h-4 text-gray-600" />
        </div>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          title="Dil"
          className="p-2 text-black  hover:bg-white hover:bg-opacity-10 rounded transition-colors"
        >
          <LanguageIcon className="w-5 h-5" />
        </button>
        <button
          title="Bildirimler"
          className="p-2 text-black  hover:bg-white hover:bg-opacity-10 rounded transition-colors relative"
        >
          <NotificationsNoneOutlinedIcon className="w-5 h-5" />
          <span className="absolute -top-1 -right-1  bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            12
          </span>
        </button>
        <button
          title="E-posta"
          className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded transition-colors"
        >
          <EmailOutlinedIcon className="w-5 h-5 text-black " />
        </button>
        <button
          title="Ayarlar"
          className="p-2 text-black  hover:bg-white hover:bg-opacity-10 rounded transition-colors"
        >
          <TuneIcon className="w-5 h-5" />
        </button>
        <button
          title="Profil"
          onClick={handleMenu}
          className="p-1 text-white hover:bg-white hover:bg-opacity-10 rounded transition-colors"
        >
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {" "}
          </div>
        </button>
      </div>
    </div>
  );
}
