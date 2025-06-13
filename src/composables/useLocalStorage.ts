import { ref, watch, type Ref } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T): [Ref<T>, (value: T) => void] {
  const storedValue = localStorage.getItem(key);
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue;
  
  const storedRef = ref<T>(initialValue) as Ref<T>;
  
  const setValue = (value: T) => {
    storedRef.value = value;
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  watch(storedRef, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });
  
  return [storedRef, setValue] as const;
}