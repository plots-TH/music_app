import React, { useEffect, useState } from "react";
import { Routes, Route, Router } from "react-router-dom";
import Account from "./components/Account";
import Login from "./components/Login";
import Navigations from "./components/Navigations";
import Register from "./components/Register";
import SingleSong from "./components/SingleSong";
import Songs from "./components/Songs";
import CategoryPlaylist from "./components/CategoryPlaylist";
import axios from "axios";
import SinglePlaylist from "./components/SinglePlaylist";

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

  return (
    <>
      {/* <h2>Warm Welcome to Wonderful Widgets!</h2>
      {widgets.map((widget) => (
        <p key={widget.id}>{widget.name}</p>
      ))} */}

      <h1>MUSIC APP</h1>
      <p>{userToken}</p>
      <Navigations></Navigations>
      <Routes>
        <Route path="/" element={<Songs />}></Route>
        {/* create a prop called setToken and pass in the "setToken" function */}
        <Route
          path="/login"
          element={<Login setUserToken={setUserToken} />}
        ></Route>
        <Route
          path="/register"
          element={<Register setUserToken={setUserToken} />}
        ></Route>
        <Route path="/category/:id" element={<CategoryPlaylist />}></Route>
        <Route path="/playlist" element={<SinglePlaylist />}></Route>
        <Route path="/track/:id" element={<SingleSong />}></Route>
        <Route path="/account" element={<Account />}></Route>
        {/* create a "select all path" using "*" to redirect the user to the home page if no url match is found */}
        <Route path="*" element={<Songs />}></Route>
      </Routes>
    </>
  );
}

export default App;
