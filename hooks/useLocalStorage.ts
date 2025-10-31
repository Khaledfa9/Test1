import { useState, Dispatch, SetStateAction, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error)
        {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
        try {
            // We use the functional update form of useState's setter to ensure we always have the latest state.
            setStoredValue(currentState => {
                const valueToStore = value instanceof Function ? value(currentState) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                return valueToStore;
            });
        } catch (error) {
             if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                console.error(`Error setting localStorage key “${key}”: Quota exceeded.`);
                alert("Error: Storage limit exceeded. Please free up space by deleting some saved meals.");
            } else {
                 console.error(error);
            }
        }
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;