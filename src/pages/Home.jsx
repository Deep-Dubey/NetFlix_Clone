import React from 'react'
import Hero from "../components/Hero"
import MovieRow from '../components/MovieRow'
import endpoints from '../services/movieServices'

function home() {
  return (
    <>
      <Hero />
      <MovieRow title="upcoming" url={endpoints.upcoming}/>
      <MovieRow title="trending" url={endpoints.trending}/>
      <MovieRow title="topRated" url={endpoints.topRated}/>
      <MovieRow title="popular" url={endpoints.popular}/>
    </>
  )
}

export default home