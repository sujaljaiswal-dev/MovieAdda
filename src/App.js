import { use, useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";



const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0).toFixed(1);

function NavBar({ children, query, setquery }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <SearchBar query={query} setQuery={setquery} />
      {children}
    </nav>
  )
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}
function SearchBar({ query, setQuery }) {
  const inputEl = useRef(null)
  const callback = function (e) {
    if (document.activeElement != inputEl.current) {
      inputEl.current.focus()
      setQuery("")
    }
  }
  useKey(callback, "Enter")
  return (<input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    ref={inputEl}
    // onKeyDown={(e) => {
    //   if (e.key == 'Enter') {
    //     console.log('works')
    //     console.log(e.target.value)
    //   }
    // }}
    onChange={(e) => {
      setQuery(e.target.value)
    }}
  />)
}
function NumResult({ movies }) {
  return (<p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>)
}
function ListBox({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  )
}

function MoviesList({ movies, onselecthandler }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} onselecthandler={onselecthandler} movie={movie} />
      ))}
    </ul>
  )
}

function Main({ children }) {

  return (
    <main className="main">
      {children}
      {/* <WatchedBox watched={watched} /> */}
    </main>)
}

function WatchedList({ watched, deletehandler }) {
  return (
    <>
      <Watchedsummary watched={watched} />
      <ul className="list">
        {watched.map((movie) => (
          <WactehdMovie key={movie.imdbID} movie={movie} deletehandler={deletehandler} />
        ))}
      </ul>
    </>
  )
}
function WactehdMovie({ movie, deletehandler }) {
  return (<li key={movie.imdbID}>
    <button className="btn-delete" onClick={() => deletehandler(movie.imdbID)}>X</button>
    <img src={movie.poster} alt={`${movie.title} poster`} />
    <h3>{movie.title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
    </div>
  </li>)
}
function Watchedsummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (<div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>)
}


function Movie({ movie, onselecthandler }) {
  return (<li onClick={() => onselecthandler(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>)
}
export default function App() {
  const [watched, setWatched] = useLocalStorage([], "watched")

  const [query, setQuery] = useState("");
  const [selectedid, setselectedid] = useState(null)
  const { movies, isLoading, Errors } = useMovies(query)
  // const query = 'snbfebfsfeh'

  function addWatchlist(movie) {
    setWatched(arr => [...arr, movie])
  }
  function setIdHandler(id) {
    setselectedid((selectedid) => selectedid == id ? null : id)
  }
  function backhandle() {
    setselectedid(null)
  }
  function removeWatchmovie(id) {
    setWatched(watched.filter(val => val.imdbID !== id))
  }

  return (
    <>
      <NavBar query={query} setquery={setQuery}>
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <ListBox>
          {/* {isLoading ? <Loading /> : <MoviesList movies={movies} />} */}
          {isLoading && <Loading />}
          {!isLoading && !Errors && <MoviesList onselecthandler={setIdHandler} movies={movies} />}
          {Errors && <Errormsg msg={Errors} />}
        </ListBox>
        <ListBox>
          {selectedid ?
            <MoviesDetails
              id={selectedid}
              backhandle={backhandle}
              addWatchlist={addWatchlist}
              watchedlist={watched}
            /> :
            <WatchedList watched={watched} deletehandler={removeWatchmovie} />}
        </ListBox>
      </Main>
    </>
  );
}
function Loading() {
  return (
    <div className="loader">Loading...</div>
  )
}
function Errormsg({ msg }) {
  return (
    <p className="loader">{msg}</p>
  )
}
function MoviesDetails({ id, backhandle, addWatchlist, watchedlist }) {
  const [details, setdetails] = useState({})
  const [isLoading, setisLoading] = useState(false)
  const [rate, setrate] = useState(0)
  const iswatched = watchedlist.some(val => val.imdbID === id)
  const watchedrating = watchedlist.find(el => el.imdbID === id)?.userRating

  const DecisionCount = useRef(0)
  useEffect(function () {
    if (rate)
      DecisionCount.current += 1
  }, [rate])
  const {
    Title: title,
    Poster: poster,
    Genre: genre,
    Plot: plot,
    Rated: rated,
    imdbRating,
    Year: year,
    Director: directer,
    Actors: actors,
    Runtime: runtime,
    imdbID

  } = details
  const movie = {
    title,
    poster,
    imdbRating: Number(imdbRating),
    userRating: rate,
    imdbID,
    runtime: Number(runtime?.split(" ").at(0)),
    DecisionCount

  }
  useKey(backhandle, "Escape")
  useEffect(function () {
    const fetchdetails = async function (id) {
      setisLoading(true)
      const res = await fetch(`https://www.omdbapi.com/?apikey=${process.env.REACT_APP_KEY}&i=${id}`)
      const data = await res.json()
      setdetails(data)
      setisLoading(false)
    }
    fetchdetails(id)
    setdetails({})

  }, [id])
  useEffect(function () {
    if (!title) return
    document.title = `Movie: ${title}`
    return function () {
      document.title = 'Usepopcorn'
    }
  }
    , [title])
  return (
    <div className="details">
      <button className="btn-back" onClick={backhandle}>&larr;</button>
      {isLoading ? <Loading /> :
        <>
          <header>
            <img src={poster} alt="img of movie"></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{year} &bull; {runtime}</p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>{imdbRating} IMDb Rating
              </p>
              <p>Rated: {rated}</p>
            </div>
          </header>
          <section>
            <div className="rating">

              {!iswatched ? (
                <>
                  <StarRating maxlenght={10} size={25} color="yellow" setrate={setrate} rate={rate} />
                  {rate ? <button className="btn-add"
                    onClick={() => {

                      addWatchlist(movie)
                      backhandle()
                    }}>Add to watchlist</button> : ''}
                </>
              ) :
                <p>You have alredy rated this movie {watchedrating} ⭐ </p>}
            </div>
            <p>{plot}</p>
            <p>Starring {actors}</p>
            <p>Directed by {directer}</p>
          </section>
        </>
      }
    </div >
  )
}