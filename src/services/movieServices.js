const key = "f4526a9280246aee4441453e9dbf1c20";
const baseUrl = "https://api.themoviedb.org/3";

const endpoints = {
    popular: `${baseUrl}/movie/popular?api_key=${key}`,
    topRated: `${baseUrl}/movie/top_rated?api_key=${key}`,
    trending: `${baseUrl}/movie/popular?api_key=${key}&language=en-US&page=2`,
    comedy: `${baseUrl}/search/movie?api_key=${key}&language=en-US&uery=comedy&page=1&include_adult=false`,
    upcoming: `${baseUrl}/movie/upcoming?api_key=${key}`,    
}

export function createImageUrl(filename,size){
    return `https://image.tmdb.org/t/p/${size}/${filename}`
}

export default endpoints;