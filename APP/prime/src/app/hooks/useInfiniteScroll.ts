import { useEffect, useCallback, useState } from 'react';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { useInView } from 'react-intersection-observer';
import { listings } from '../contracts/getPlatformInfo';

interface InfiniteScrollOptions<T> {
  fetchData: (key: string) => Promise<{ items: T[]; totalCount: number }>;
  initialTotalCount: number | null;
  revalidateKey: string;
}

export function useInfiniteScroll<T>({
  fetchData,
  initialTotalCount,
  revalidateKey,
}: InfiniteScrollOptions<T>) {
  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '100px' // Start loading 100px before the element is visible
  });
  const [totalCount, setTotalCount] = useState<number | null>(initialTotalCount);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const getKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex, previousPageData) => {
      // Don't fetch if not mounted or no total count yet
      if (!isMounted || totalCount === null) return null;
      
      // Reached the end
      if (previousPageData && !previousPageData.items.length) return null;
      
      // Generate key with page index
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
    persistSize: false, // Changed to false to prevent caching issues
  });

  const handleMutation = useCallback(async() => {
    try{
      const newTotalListings = await listings()
      if(newTotalListings){
        setTotalCount(newTotalListings.length) 
      }
      return originalMutate();
    } catch(error) {
      console.error('Error updating after mutation', error)
    }
  }, [originalMutate])

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