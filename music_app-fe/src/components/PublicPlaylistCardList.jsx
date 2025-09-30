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
    <div className="mt-2 grid grid-cols-1 gap-6 rounded-lg border border-black p-5 dark:border-slate-700 dark:bg-neutral-900 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
