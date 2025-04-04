import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

// --------------------helper function below --------------------------
function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}
// ------------------helper function ^^^^ -----------------------

function SingleSong() {
  const location = useLocation();
  const { track } = location.state;
  console.log(track);

  const testTrack = {
    name: "Hey Jude - Remastered 2015",
    preview_url: "https://p.scdn.co/mp3-preview/123456789abcdef",
    artists: [{ name: "The Beatles" }],
  };

  return (
    <div>
      <h2>
        {track.name} by {track.artists.map((artist) => artist.name).join(", ")}
      </h2>
      <p>
        Album: {track.album.name} released on {track.album.release_date}
      </p>
      <h3>Popularity Rating: {track.popularity}</h3>
      <h3>Duration: {formatDuration(track.duration_ms)}</h3>
      <img src={track.album.images[0]?.url} width={150} alt={track.name} />
      <p>
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer" // wtf does this mean?
        >
          Listen on Spotify
        </a>
      </p>
      <p>
        <a
          href={track.album.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          Check out the album
        </a>
      </p>
    </div>
  );
}
// loop through track.artists and return all artists instead of just the first one^^^^
export default SingleSong;
