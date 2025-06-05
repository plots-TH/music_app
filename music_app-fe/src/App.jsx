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
  // widgets are an example slice
  //const [widgets, setWidgets] = useState([]);
  //useEffect(() => {
  //  axios
  //    .get(`${import.meta.env.VITE_API_BASE_URL}/api/widgets`)
  //    .then((data) => {
  //      setWidgets(data.data);
  //    })
  //    .catch((err) => console.log(err));
  //}, []);
  // widgets are an example slice ^^^^

  const [userToken, setUserToken] = useState(null);
  useEffect(() => {
    const localToken = localStorage.getItem("token"); // we localStorage.setItem(token) to data.data.userToken in Register.jsx. Now we localStorage.getItem(token).

    if (localToken) {
      //  if the token doesn't exist, it is set to null. If it already exists in the browser's local storage, we setUserToken to the value of the token in localStorage. this keeps the user logged in with their token even if the page refreshes.
      setUserToken(localToken);
    }
  }, []);

  return (
    <>
      {/* <h2>Warm Welcome to Wonderful Widgets!</h2>
      {widgets.map((widget) => (
        <p key={widget.id}>{widget.name}</p>
      ))} */}

      <h1>MUSIC APP</h1>

      <Navigations
        userToken={userToken}
        setUserToken={setUserToken}
      ></Navigations>
      <Routes>
        <Route path="/" element={<Songs />}></Route>
        {/* create a prop called setUserToken and pass in the "setUserToken" function to the authentication routes (register and signup) */}
        <Route
          path="/login"
          element={<Login setUserToken={setUserToken} userToken={userToken} />}
        ></Route>
        <Route
          path="/register"
          element={
            <Register setUserToken={setUserToken} userToken={userToken} />
          }
        ></Route>
        <Route path="/category/:id" element={<CategoryPlaylist />}></Route>
        <Route path="/playlist" element={<SinglePlaylist />}></Route>
        <Route
          path="/track/:id"
          element={<SingleSong userToken={userToken} />}
        ></Route>
        <Route
          path="/account"
          element={<Account userToken={userToken} />}
        ></Route>
        {/* create a "select all path" using "*" to redirect the user to the home page if no url match is found */}
        <Route path="*" element={<Songs />}></Route>

        <Route
          path="/publicPlaylists"
          element={<ExplorePublic userToken={userToken} />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
