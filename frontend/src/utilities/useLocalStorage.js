import { useState, useEffect } from "react";

/** Custom hook for keeping state data synced with localStorage.
*   const [myThing, setMyThing] = useLocalStorage("myThing")
*   eg - setToken at login; this triggers useEffect and sets the item in LS
*   eg - setToken at logout; this triggers useEffect and removes the item from LS
*/

function useLocalStorage(key, firstValue = null) {
  const initialValue = localStorage.getItem(key) || firstValue;

  const [item, setItem] = useState(initialValue);

  useEffect(function setKeyInLocalStorage() {
    console.debug("hooks useLocalStorage useEffect", "item=", item);

    if (item === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, item);
    }
  }, [key, item]);

  return [item, setItem];
}

export default useLocalStorage;
