import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Account from "./components/Account";
import Login from "./components/Login";
import Navigations from "./components/Navigations";
import Register from "./components/Register";
import SingleSong from "./components/SingleSong";
import Songs from "./components/Songs";
import CategoryPlaylist from "./components/CategoryPlaylist";
import axios from "axios";
import SinglePlaylist from "./components/SinglePlaylist";
import ExplorePublic from "./components/ExplorePublic";

function App() {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const localToken = localStorage.getItem("token"); // we localStorage.setItem(token) to data.data.userToken in Register.jsx. Now we localStorage.getItem(token).
    const currentUser = localStorage.getItem("userId");
    if (localToken && currentUser) {
      //  if the token doesn't exist, it is set to null. If it already exists in the browser's local storage, we setUserToken to the value of the token in localStorage. this keeps the user logged in with their token even if the page refreshes.
      setUserToken(localToken);
      setUserId(currentUser);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-lg font-semibold">MUSIC APP</h1>
          <Navigations
            userToken={userToken}
            setUserToken={setUserToken}
            userId={userId}
            setUserId={setUserId}
          />
        </div>
      </header>

      <main className="container py-6">
        <Routes>
          <Route path="/" element={<Songs />} />
          <Route
            path="/login"
            element={
              <Login
                setUserToken={setUserToken}
                userToken={userToken}
                userId={userId}
                setUserId={setUserId}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                setUserToken={setUserToken}
                userToken={userToken}
                userId={userId}
                setUserId={setUserId}
              />
            }
          />
          <Route path="/category/:id" element={<CategoryPlaylist />} />
          <Route path="/playlist" element={<SinglePlaylist />} />
          <Route
            path="/track/:id"
            element={<SingleSong userToken={userToken} userId={userId} />}
          />
          <Route
            path="/account"
            element={<Account userToken={userToken} userId={userId} />}
          />
          <Route
            path="/publicPlaylists"
            element={<ExplorePublic userToken={userToken} userId={userId} />}
          />
          <Route path="*" element={<Songs />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
