import { useEffect, useState } from 'react';

/**
 * Custom hook to manage state synchronized with localStorage.
 *
 * @template T - The type of the stored value.
 * @param {string} keyName - The key under which the value is stored in localStorage.
 * @param {T} [initialValue] - The initial value to be stored if no value is found in localStorage.
 * @returns {[T | undefined, (value: T | ((prev: T | undefined) => T)) => void]} - A tuple containing the stored value and a function to update it.
 *
 * @example
 * const [value, setValue] = useLocalStorage<string>('myKey', 'defaultValue');
 *
 * // To update the value
 * setValue('newValue');
 *
 * // Or using a function
 * setValue(prevValue => prevValue ? prevValue + ' updated' : 'initial');
 */
export const useLocalStorage = <T,>(
  keyName: string,
  initialValue?: T,
): [T | undefined, (value: T | ((prev: T | undefined) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value && value !== 'undefined') {
        return JSON.parse(value) as T;
      }
      if (initialValue !== undefined) {
        window.localStorage.setItem(keyName, JSON.stringify(initialValue));
        return initialValue;
      }
      return undefined;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T | undefined) => T)) => {
    const newValue =
      typeof value === 'function'
        ? (value as (prev: T | undefined) => T)(storedValue)
        : value;

    window.localStorage.setItem(keyName, JSON.stringify(newValue));
    setStoredValue(newValue);

    window.dispatchEvent(
      new CustomEvent(`localstorage:${keyName}`, { detail: newValue }),
    );
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === keyName && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      setStoredValue(customEvent.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(`localstorage:${keyName}`, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(`localstorage:${keyName}`, handleCustomEvent);
    };
  }, [keyName]);

  return [storedValue, setValue];
};