import React, { useState } from 'react';
import './App.css'


function App() {
  const [artistName, setArtistName] = useState(''); // Default artist name is empty
  const [artistData, setArtistData] = useState(null); // State to hold artist data
  const [tracklist, setTracklist] = useState([]); // State to hold tracklist
  const [play, setPlay] = useState(false)
  const getArtist = async () => {
    const encodedArtist = encodeURIComponent(artistName);
    // Use the search endpoint to find the artist by name
    const searchUrl = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/artist?q=${encodedArtist}`;
    try {
      // Search for the artist by name
      const searchRes = await fetch(searchUrl);
      if(!searchRes.ok) {
        throw new Error(`HTTP error! status: ${searchRes.status}`);
      }
      const searchArtist = await searchRes.json();
      console.log('Search Data:', searchArtist);

      if(searchArtist.data.length === 0) {
        throw new Error('Artist not found');
      }

      // Get the first artist ID from the search results
      const artistId = searchArtist.data[0].id;

      // Fetch artist data using the artist ID
      const artistUrl = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/${artistId}`;
      const artistRes = await fetch(artistUrl);
      if(!artistRes.ok) {
        throw new Error(`HTTP error! status: ${artistRes.status}`);
      }
      const artist = await artistRes.json();
      console.log('Artist Data:', artist);
      setArtistData(artist);

      // Fetch tracklist using the artist ID
      const tracklistUrl = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/${artistId}/top?limit=50`;
      const tracklistRes = await fetch(tracklistUrl);
      if(!tracklistRes.ok) {
        throw new Error(`HTTP error! status: ${tracklistRes.status}`);
      }
      const tracklistData = await tracklistRes.json();
      console.log('Tracklist Data:', tracklistData);
      setTracklist(tracklistData.data);
    } catch(err) {
      console.error('Fetch error:', err);
      alert(err.message);
      setArtistData(null);
      setTracklist([]);
    }
  };

  const handleSearch = () => {
    if(artistName.trim() !== '') {
      // getArtist();
    }
  };

  return (
    <div>
      <h1>Allen's Music Player</h1>
      <input
        type="text"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
        placeholder="Enter artist name"
      />
      <button onClick={handleSearch}>
        Search
      </button>

      {artistData && (
        <div>
          <h2>{artistData.name}</h2>
          <img src={artistData.picture_medium} alt={artistData.name} />
          <p>Number of fans: {artistData.nb_fan.toLocaleString()}</p>
          <h3>Top Tracks</h3>
          <ul>
            {tracklist.map((track) => (
              <li key={track.id}>
                <strong>{track.title}</strong> from the album <em>{track.album.title}</em>
                <br />
                {track.preview &&(
                  <audio controls src={track.preview}>
                    Your browser does not support the audio element.
                  </audio>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default App;
