import { useCallback, useState } from 'react';

type TUseSessionStorage<TData> = {
  queryParams: TData;
  setQueryParams: (key: keyof TData, value: string) => void;
  setMultiQueryParams: (values: { key: keyof TData; value: string }[]) => void;
  clearQueryParams: () => void;
};

export const useSessionQuery = <TData>(
  sessionKey: string,
  initialData: TData,
): TUseSessionStorage<TData> => {
  const getValueFromSessionStorage = useCallback((): TData => {
    const data = sessionStorage.getItem(sessionKey);
    return data ? JSON.parse(data) : initialData;
  }, [sessionKey, initialData]);

  const [sessionValue, setSessionValue] = useState(
    getValueFromSessionStorage(),
  );

  const setValue = useCallback(
    (key: keyof TData, value: string) => {
      const oldSessionData = getValueFromSessionStorage();
      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({ ...oldSessionData, [key]: value }),
      );
      setSessionValue((prev) => ({ ...prev, [key]: value }));
    },
    [getValueFromSessionStorage, sessionKey],
  );

  const setValues = useCallback(
    (values: { key: keyof TData; value: string }[]) => {
      values.forEach((value) => {
        setValue(value.key, value.value);
      });
    },
    [setValue],
  );

  const clearSessionStorage = useCallback(() => {
    sessionStorage.removeItem(sessionKey);
    setSessionValue(initialData);
  }, [initialData, sessionKey]);

  return {
    queryParams: sessionValue,
    setQueryParams: setValue,
    setMultiQueryParams: setValues,
    clearQueryParams: clearSessionStorage,
  };
};
