import { useEffect } from "react";
export function useKey(action, key) {
    useEffect(function () {
        const callback = function (e) {
            if (e.key === key) {
                action()
            }
        }
        document.addEventListener("keydown", callback)
        return () => document.removeEventListener("keydown", callback)
    }, [action, key])
}