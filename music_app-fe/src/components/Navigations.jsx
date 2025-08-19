import React from "react";
import { Link, useNavigate } from "react-router-dom"; // allows us to link to any of the routes created in App.jsx

function Navigations({ userToken, setUserToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserToken(null);
    navigate("/");
  };
  return (
    <nav>
      <Link to="/">Explore All Music</Link>
      {/* show "my account" link in navbar, only if i am loged in */}
      {userToken && <Link to="/account">Account</Link>}

      <Link to="/publicPlaylists">Browse User-Playlists</Link>

      {userToken ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
      {!userToken && <Link to="/register">Register</Link>}
    </nav>
  );
}

export default Navigations;
