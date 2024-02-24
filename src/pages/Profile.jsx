import React, { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { createImageUrl } from "../services/movieServices";
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { FaHeart } from "react-icons/fa";

function Profile() {
  const [movies, setMovies] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const docRef = doc(db, "users", `${user.email}`);

      unsubscribe = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            if (userData && userData.favShows) {
              setMovies(userData.favShows);
            } else {
              console.log("No favorite shows found for the user.");
              setMovies([]);
            }
          } else {
            console.log("No such document!");
            setMovies([]);
          }
        },
        (error) => {
          console.error("Error fetching document: ", error);
          setMovies([]);
        }
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.email]);

  const slide = (offset) => {
    const slider = document.getElementById("slider");
    slider.scrollLeft += offset;
  };

  async function handleUnlikeShow(movieId) {
    try {
      const userDoc = doc(db, "users", user.email);
      await updateDoc(userDoc, {
        favShows: arrayRemove(movies, movieId),
      });
    } catch (error) {
      console.error("Error removing movie:", error);
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <img
          className="block w-full h-[500px] object-cover"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/2e07bc25-8b8f-4531-8e1f-7e5e33938793/e4b3c14a-684b-4fc4-b14f-2b486a4e9f4e/IN-en-20240219-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt="Banner"
        />
        <div className="bg-black/70 fixed top-0 left-0 w-full h-[500px]" />
        <div className="absolute top-[20%] p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold">My Shows</h1>
          <p className="text-gray-400 font-light text-lg">{user.email}</p>
        </div>

        <h2 className="font-bold md:text-xl p-4 capitalize">Favorite Shows</h2>
        <div className="relative flex items-center group">
          <MdChevronLeft
            onClick={() => slide(-500)}
            className="bg-white rounded-full absolute left-2 opacity-80 text-gray-700 z-10 hidden group-hover:block cursor-pointer"
            size={40}
          />
          <div
            id={`slider`}
            className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide flex"
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="relative flex-none w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block rounded-lg overflow-hidden cursor-pointer m-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  className="w-full h-40 block object-cover origin-top"
                  src={createImageUrl(movie.poster_path ?? movie.backdrop_path, "w500")}
                  alt={movie.title}
                />

                <div className={`absolute top-0 left-0 w-full h-40 bg-black/80 opacity-0 ${isHovered ? "hover:opacity-100" : ""} flex flex-col justify-center items-center`}>
                  <p className="whitespace-normal text-xs md:text-sm font-bold">{movie.title}</p>
                  {isHovered && (
                    <AiOutlineClose
                      size={30}
                      onClick={() => handleUnlikeShow(movie.id)}
                      className="absolute top-2 right-2 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <MdChevronRight
            onClick={() => slide(500)}
            className="bg-white rounded-full absolute right-2 opacity-80 text-gray-700 z-10 hidden group-hover:block cursor-pointer"
            size={40}
          />
        </div>
      </div>
    </>
  );
}

export default Profile;
