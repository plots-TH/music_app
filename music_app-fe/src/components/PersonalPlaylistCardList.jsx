import React from "react";
import PersonalPlaylistCard from "./PersonalPlaylistCard";

function PersonalPlaylistCardList({
  personalPlaylists,
  userToken,
  onUpdateTitle,
  onRemoveTrack,
  onDeletePlaylist,
}) {
  return (
    <div className="category-playlist-card-list">
      {personalPlaylists.map((personalPlaylist) => (
        <PersonalPlaylistCard
          key={personalPlaylist.id}
          personalPlaylist={personalPlaylist}
          userToken={userToken}
          onUpdateTitle={onUpdateTitle}
          onRemoveTrack={onRemoveTrack}
          onDeletePlaylist={onDeletePlaylist}
        />
      ))}
    </div>
  );
}

export default PersonalPlaylistCardList;

// import React from "react";
// import CategoryPlaylistCard from "./CategoryPlaylistCard";

// function CategoryPlaylistCardList({ playlists }) {
//   return (
//     <div className="category-playlist-card-list">
//       {playlists.map((playlist) => (
//         <CategoryPlaylistCard key={playlist.id} playlist={playlist} />
//       ))}
//     </div>
//   );
// }

// export default CategoryPlaylistCardList;
