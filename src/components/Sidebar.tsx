"use client";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MoveToInboxOutlinedIcon from "@mui/icons-material/MoveToInboxOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const getButtonClass = (targetPath: string) => {
    const isActive = pathname === targetPath;
    return `w-full text-left px-3 py-2 rounded transition-colors duration-200 ${
      isActive
        ? "bg-blue-500 text-white"
        : "hover:bg-blue-100 hover:text-blue-700"
    }`;
  };

  const getIconClass = (targetPath: string) => {
    const isActive = pathname === targetPath;
    return isActive ? "text-white" : "text-black";
  };

  return (
    <div className="flex flex-col gap-3 p-3  text-gray-500 border rounded-lg h-full ">
      <p>MENÜ</p>
      <ul className=" space-y-2">
        <li>
          <button
            className={getButtonClass("/")}
            onClick={() => navigateTo("/")}
          >
            <HomeOutlinedIcon sx={{ mr: 1 }} className={getIconClass("/")} />
            Dashboard
          </button>
        </li>
        <li>
          <button className={getButtonClass("/products")}>
            <MoveToInboxOutlinedIcon
              sx={{ mr: 1 }}
              className={getIconClass("/products")}
            />
            Ürünler
          </button>
        </li>
      </ul>
      <p>Satış</p>
      <ul className=" space-y-2">
        <li>
          <button
            className={getButtonClass("/collections")}
            onClick={() => navigateTo("/collections")}
          >
            <ShoppingCartOutlinedIcon
              sx={{ mr: 1 }}
              className={getIconClass("/collections")}
            />
            Koleksiyon
          </button>
        </li>
      </ul>
    </div>
  );
}
