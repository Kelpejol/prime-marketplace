
"use client"
import { useRouter } from "next/navigation";
import React from "react";
import Heading from "./Heading";
import Button from "./Button";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showButton?: boolean;
  onClick?: () => void;
  label?: string
}

export default function EmptyState({
  title = "No listing found",
  subtitle = "You haven't created a listing, Try creating one",
  showButton,
  onClick,
  label
}: EmptyStateProps) {
  const router = useRouter();
  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
        <Heading
        title={title}
        subtitle={subtitle}
        center
        />
        <div className=" flex justify-center w-48 mt-4">
            {showButton && (
                <Button
                actionLabel={label!}
                action={() => onClick && onClick()}
                size="large"
                color="primary"
                ClassName="w-auto"/>
            )}
        </div>
    </div>
  )
}
