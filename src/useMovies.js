import { useState, useEffect } from "react"


export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setisLoading] = useState(false)
    const [Errors, seterror] = useState("")
    useEffect(function () {
        const controller = new AbortController()
        seterror('')
        const fetching = async function () {
            try {
                setisLoading(true)
                const res = await fetch(`https://www.omdbapi.com/?apikey=${process.env.REACT_APP_KEY}&s=${query}`, { signal: controller.signal })
                if (!res.ok) {
                    throw new Error("no internet connection")
                }

                const data = await res.json()
                console.log(data)
                if (data.Response === "False") {
                    console.log('not found')
                    throw new Error("movie not found")
                }
                setMovies(data.Search)
                console.log('heheheh')
            }
            catch (err) {
                if (err.name !== "AbortError") {
                    console.log(err)
                    seterror(err.message)
                }
            }
            finally {
                setisLoading(false)
            }
        }
        if (query.length < 3) return
        fetching()
        return function () {
            controller.abort()
        }
    }, [query]
    )
    return { movies, isLoading, Errors }

}