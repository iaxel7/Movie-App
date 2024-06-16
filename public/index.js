
// Add an event listener to the form for the 'submit' event
document.getElementById('movieForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const movieTitle = document.getElementById('movieTitle').value; // Get the movie title from the input field

    try {
        // Fetch the movie ID based on the title entered by the user
        const movieId = await getMovieId(movieTitle);

        // Make a request to fetch similar movies using the movie_id parameter
        const response = await fetch(`/movie/${movieId}/similar`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Throw an error if the response is not ok
        }

        const contentType = response.headers.get('content-type'); // Get the content type of the response
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json(); // Parse the response JSON

            console.log('Data received:', data); // Log the data received from the server

            // Display similar movies in the result div
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = ''; // Clear previous results

            if (data.error) {
                resultDiv.textContent = data.error; // Display error message if there is an error in the response
            } else {
                // Iterate over the array of similar movies and create elements for each movie
                data.forEach(movie => {
                    const movieElement = document.createElement('div');
                    movieElement.textContent = movie.title; // Set the text content to the movie title
                    resultDiv.appendChild(movieElement); // Append the movie element to the result div
                });
            }
        } else {
            throw new Error('Unexpected response from server'); // Throw an error if the response is not JSON
        }
    } catch (error) {
        console.error('Error fetching data:', error); // Log the error to the console
        // Display error message to the user
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = 'An unexpected error occurred. Please try again later.';
    }
});

// Function to get the movie ID from the server based on the movie title
async function getMovieId(title) {
    const API_KEY = 'b4d80c8d17d6e112ba9f16613ec5baf9'; // Your TMDB API key
    const BASE_URL = 'https://api.themoviedb.org/3/'; // Base URL for TMDB API

    // Fetch the movie ID from the TMDB API based on the title
    const response = await fetch(`${BASE_URL}search/movie?api_key=${API_KEY}&query=${title}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Throw an error if the response is not ok
    }
    const data = await response.json(); // Parse the response JSON
    if (data.results && data.results.length > 0) {
        return data.results[0].id; // Return the ID of the first search result
    } else {
        throw new Error('Movie not found'); // Throw an error if no movie is found
    }
}

  
  









