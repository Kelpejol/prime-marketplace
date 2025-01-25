

import { useEffect, useCallback, useState } from 'react';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { useInView } from 'react-intersection-observer';

interface InfiniteScrollOptions<T> {
  fetchData: (key: string) => Promise<{ items: T[]; totalCount: number }>;
  initialTotalCount?: number | null;
  revalidateKey: string;
  getTotalCount?: () => Promise<number>;
}

export function useInfiniteScroll<T>({
  fetchData,
  initialTotalCount = null,
  revalidateKey,
  getTotalCount
}: InfiniteScrollOptions<T>) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px'
  });
  
  const [totalCount, setTotalCount] = useState<number | null>(initialTotalCount);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Initialize total count if getTotalCount is provided
  useEffect(() => {
    const initializeTotalCount = async () => {
      if (getTotalCount && totalCount === null) {
        try {
          const count = await getTotalCount();
          setTotalCount(count);
        } catch (error) {
          console.error('Error fetching total count:', error);
        }
      }
    };

    initializeTotalCount();
  }, [getTotalCount, totalCount]);

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex, previousPageData) => {
      if (!isMounted || totalCount === null) return null;
      
      if (previousPageData && !previousPageData.items.length) return null;
      
      return `${revalidateKey}-page-${pageIndex}`;
    },
    [isMounted, totalCount, revalidateKey]
  );

  const {
    data: pages,
    error,
    isValidating: isLoading,
    size,
    setSize,
    mutate: originalMutate
  } = useSWRInfinite(getKey, fetchData, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    persistSize: false,
  });

  const handleMutation = useCallback(async () => {
    try {
      if (getTotalCount) {
        const newTotalCount = await getTotalCount();
        setTotalCount(newTotalCount);
      }
      return originalMutate();
    } catch (error) {
      console.error('Error updating after mutation', error);
    }
  }, [originalMutate, getTotalCount]);

  useEffect(() => {
    if (isMounted && inView && !isLoading && totalCount !== null) {
      const currentItemCount = pages?.reduce(
        (total, page) => total + (page?.items?.length || 0),
        0
      ) || 0;

      if (currentItemCount < totalCount) {
        setSize((prev) => prev + 1);
      }
    }
  }, [inView, isLoading, totalCount, pages, setSize, isMounted]);

  return {
    ref,
    pages,
    error,
    isLoading,
    size,
    setSize,
    mutate: handleMutation,
    setTotalCount,
    totalCount
  };
}