"use client";
import React from "react";

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

export default function MenuItem({ onClick, label }: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="py-2 px-3 w-[124px] md:w-[180px] cursor-pointer font-semibold md:text-[14px] bg-neutral-100 text-[10px] hover:bg-neutral-50 transition"
    >
      {label}
    </div>
  );
}
