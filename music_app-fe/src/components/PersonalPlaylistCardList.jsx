import React from "react";
import PersonalPlaylistCard from "./PersonalPlaylistCard";

function PersonalPlaylistCardList({
  personalPlaylists,
  userToken,
  onUpdateTitle,
  onRemoveTrack,
  onDeletePlaylist,
  onEditDescription,
  onTogglePublic,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {personalPlaylists.map((personalPlaylist) => (
        <div key={personalPlaylist.id} className="self-start">
          <PersonalPlaylistCard
            personalPlaylist={personalPlaylist}
            userToken={userToken}
            onUpdateTitle={onUpdateTitle}
            onRemoveTrack={onRemoveTrack}
            onDeletePlaylist={onDeletePlaylist}
            onEditDescription={onEditDescription}
            onTogglePublic={onTogglePublic}
          />
        </div>
      ))}
    </div>
  );
}

export default PersonalPlaylistCardList;
