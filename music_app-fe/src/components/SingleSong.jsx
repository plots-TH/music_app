import React from "react";
import { useLocation, Link } from "react-router-dom";

// --------------------helper function below --------------------------
// For Deezer, duration is provided in seconds, so we format accordingly.
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}
// ------------------helper function ^^^^ -----------------------

function SingleSong() {
  const location = useLocation();
  const { track } = location.state;
  console.log(track);

  return (
    <div>
      <h2>
        {track.title} by {track.artist?.name}
      </h2>
      <p>
        Album: {track.album?.title}{" "}
        {/* Deezer doesn't usually provide release_date */}
      </p>
      <h3>Rank: {track.rank}</h3>
      <h3>Duration: {formatDuration(track.duration)}</h3>
      <img src={track.album?.cover_medium} width={150} alt={track.title} />
      <p>
        {/* "noopener noreferrer" improves security when opening a new tab */}
        <a href={track.link} target="_blank" rel="noopener noreferrer">
          Listen on Deezer
        </a>
      </p>
      <p>
        <a href={track.album?.link} target="_blank" rel="noopener noreferrer">
          Check out the album
        </a>
      </p>
    </div>
  );
}

export default SingleSong;
