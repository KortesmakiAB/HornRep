import { proxy } from "valtio";

export const localStorageState = proxy({
    item: '', 
    setItem(item) {localStorageState.item = item},
});


/** Custom hook for keeping state data synced with localStorage.
*   const [myThing, setMyThing] = useLocalStorage("myThing")
*   eg - setToken() in LS at login, this causes token to be set in proxy.
*   eg - removeToken() token at logout, this causes token to be set to null.
*/
function useLocalStorage(key, firstValue = null) {
    const initialValue = localStorage.getItem(key) || firstValue;

    localStorageState.setItem(initialValue);
    console.log(localStorageState.item)
 
    if (localStorageState.item === null) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, localStorageState.item);
    }
}

export default useLocalStorage;
