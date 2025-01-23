"use client";

interface HeadingProps {
  title?: string;
  subtitle?: string;
  center?: boolean;
}
export default function Heading({ title, subtitle, center }: HeadingProps) {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="md:text-2xl text-lg font-bold">{title}</div>
      <div className="font-light md:text-base text-sm text-neutral-500 mt-2">{subtitle}</div>
    </div>
  );
}
