import { useState, useEffect } from "react"

export function useLocalStorage(initialVal, key) {
    const [value, setValue] = useState(function () {
        const stored = localStorage.getItem("value")
        return stored ? JSON.parse(stored) : initialVal
    });
    useEffect(function () {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value])
    return [value, setValue]
}