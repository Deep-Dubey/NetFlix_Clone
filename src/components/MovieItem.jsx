import React, { useState, useEffect } from "react";
import { createImageUrl } from "../services/movieServices";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import YouTube from "react-youtube";
import axios from "axios";

function MovieItem({ movie }) {
  // Ensure hooks are called unconditionally
  const { user } = useAuth();
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    if (movie) {
      fetchTrailerKey(movie.id);
    }
  }, [movie]);

  const fetchTrailerKey = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=f4526a9280246aee4441453e9dbf1c20&language=en-US`
      );
      const results = response.data.results;
      const trailer = results.find((video) => video.type === "Trailer");
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  const playTrailer = () => {
    setTrailerOpen(true);
  };

  const closeTrailer = () => {
    setTrailerOpen(false);
  };

  if (!movie) {
    return null;
  }

  const { title, poster_path, backdrop_path } = movie;

  return (
    <div className="relative w-[160px] sm:w-[200px] lg:w-[280px] inline-block rounded-lg overflow-hidden cursor-pointer m-2">
      <img
        className="w-full h-40 block object-cover object-top"
        src={createImageUrl(backdrop_path ?? poster_path, "w500")}
        alt={title}
        onClick={playTrailer}
      />
      <div className="absolute top-0 left-0 w-full h-40 bg-black/80 opacity-0 hover:opacity-100">
        <p className="whitespace-normal text-xs md:text-sm flex justify-center items-center h-full">
          {title}
        </p>
      </div>
      {trailerOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-90 z-50">
          <div className="relative" style={{ maxWidth: "80%" }}>
            <YouTube videoId={trailerKey} />
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={closeTrailer}
            >
              &#10005;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieItem;