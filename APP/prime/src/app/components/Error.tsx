"use client";

import { useEffect } from "react";
import EmptyState from "./EmptyState";

interface ErrorPageProps{
  error: Error
}


export default function Error({ error }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <EmptyState title="Uh oh" subtitle="Something went wrong" />;
}
