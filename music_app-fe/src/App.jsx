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

  return (
    <>
      {/* <h2>Warm Welcome to Wonderful Widgets!</h2>
      {widgets.map((widget) => (
        <p key={widget.id}>{widget.name}</p>
      ))} */}

      <h1>MUSIC APP</h1>
      <Navigations></Navigations>
      <Routes>
        <Route path="/" element={<Songs />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/category/:id" element={<CategoryPlaylist />}></Route>
        <Route path="/song" element={<SingleSong />}></Route>
        <Route path="/account" element={<Account />}></Route>
        {/* create a "select all path" using "*" to redirect the user to the home page if no url match is found */}
        <Route path="*" element={<Songs />}></Route>
      </Routes>
    </>
  );
}

export default App;
