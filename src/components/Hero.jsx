import React, { useEffect, useState } from "react";
import axios from "axios";
import endpoints, { createImageUrl } from "../services/movieServices";
import ReactLoading from "react-loading";

function Hero() {
  const [movie, setMovie] = useState({});
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    axios
      .get(endpoints.popular)
      .then((response) => {
        const movies = response.data.results;
        const randomIndex = Math.floor(Math.random() * movies.length);
        setMovie(movies[randomIndex]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (movie.id) {
      fetchTrailerKey();
    }
  }, [movie]);

  const fetchTrailerKey = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=f4526a9280246aee4441453e9dbf1c20&language=en-US`
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
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    } else {
      console.log("Trailer not found");
    }
  };

  if (!movie.id) {
    return (
      <>
        <ReactLoading type="cylon" color="#0000FF" height={100} width={50} />
      </>
    );
  }

  const { title, backdrop_path, release_date, overview } = movie;

  return (
    <div className="w-full h-[550px] lg:h-[850px] relative">
      <div className="absolute w-full h-full">
        <div className="absolute w-full h-[550px] lg:h-[850px] bg-gradient-to-r from-black" />
        <img
          className="w-full h-full object-cover origin-top"
          src={createImageUrl(backdrop_path, "original")}
          alt={title}
        />
        <div className="absolute w-full top-[10%] lg:top-[25%] p-4 md:p-8">
          <h1 className="text-3xl md:text-6xl font-nsans-bold ml-4">{title}</h1>
          <div className="mt-8 mb-4">
            <button
              className="capitalize border bg-gray-300 text-black py-2 px-5 ml-4"
              onClick={playTrailer}
            >
              Play
            </button>
            <button className="capitalize border bg-gray-300 text-black py-2 px-5 ml-4">
              Watch Later
            </button>
          </div>
          <p className="text-gray-400 text-sm ml-4">{release_date}</p>
          <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200 ml-4">
            {overview}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
