import { useCallback, useEffect, useState } from 'react';

export const useMemoOnce = <T extends unknown = unknown>(data: T) => {
  const [state, setState] = useState<T | null>(null);

  let setter = useCallback((arg: T) => {
    setState(arg);
  }, []);

  useEffect(() => {
    if (!state && data) {
      setter(data);
      setter = () => {};
    }
  }, [state, data, setter]);

  return state;
};
