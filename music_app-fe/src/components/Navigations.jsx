import React from "react";
import { Link } from "react-router-dom"; // allows us to link to any of the routes created in App.jsx

function Navigations() {
  return (
    <nav>
      <Link to="/">Explore All Music</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navigations;
