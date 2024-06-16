import express from 'express';
import https from 'https'; // Use https instead of http 
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const API_KEY = 'b4d80c8d17d6e112ba9f16613ec5baf9';
const BASE_URL = 'https://api.themoviedb.org/3/';
const PORT = 3000;
const header = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNGQ4MGM4ZDE3ZDZlMTEyYmE5ZjE2NjEzZWM1YmFmOSIsInN1YiI6IjY2Njk5OWIyNzU4MTA2YTRhYWM4MzBhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sSl5LeZXCkUFJCUmzNtL_u0wHrdZtbDiU1g0kR4LuUQ';

// Middleware to parse JSON bodies
app.use(express.json());

// Function to make HTTP GET request
const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Authorization': `Bearer ${header}` } }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

// Route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the HTML file
});

// Route to handle GET requests for similar movies by movie ID
// ":" Acts like a template 
app.get('/movie/:movie_id/similar', async (req, res) => {
  try {
    const { movie_id } = req.params;
    // console.log(movie_id);
    const response = await fetchData(`${BASE_URL}movie/${movie_id}/similar?api_key=${API_KEY}`);
    res.json(response.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set up static file serving for the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});


