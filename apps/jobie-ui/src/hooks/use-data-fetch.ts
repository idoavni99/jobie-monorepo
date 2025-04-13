import { useCallback, useRef, useState } from 'react';

export const useDataFetch = <T>(fetcher: () => Promise<T>) => {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const staticFetcher = useRef(fetcher);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await staticFetcher.current();
      setData(result);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};
