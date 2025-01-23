"use client"
import UserMenu from "./UserMenu";
import  useWindowScroll  from "@/app/hooks/useWindowScroll";

export default function NavBar() {
  const  height  = useWindowScroll();

  return (
    <div className={`${height > 1 ? "fixed w-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border-b border-gray-100 z-40 shadow-sm" : "bg-white"} transition-all duration-300 ease-in-out`}>
      <div className="py-2 border-b-[1px]">
        <div className="flex flex-row items-center justify-between">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}