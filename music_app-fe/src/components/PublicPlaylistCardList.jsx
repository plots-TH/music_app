import React from "react";
import PublicPlaylistCard from "./publicPlaylistCard";

function PublicPlaylistCardList({
  publicPlaylists,
  onClonePlaylist,
  userToken,
  userId,
  justClonedId,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {publicPlaylists.map((publicPlaylist) => (
        <div key={publicPlaylist.id} className="self-start">
          <PublicPlaylistCard
            publicPlaylist={publicPlaylist}
            userToken={userToken}
            userId={userId}
            onClonePlaylist={onClonePlaylist}
            justClonedId={justClonedId}
          />
        </div>
      ))}
    </div>
  );
}

export default PublicPlaylistCardList;
