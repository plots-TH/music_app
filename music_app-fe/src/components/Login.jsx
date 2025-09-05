import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
//In your Login.jsx file, update your handleSubmit to send the email and password to the login endpoint.
//Route path="/login"
function Login({ setUserToken, userToken, setUserId, userId }) {
  const [userData, setUserData] = useState({});

  // useNavigate lets us programmatically send the user to a different route with react router dom
  const navigate = useNavigate();

  // use useLocation to read track ID if user was logged out but came from "add track to pp button"
  const location = useLocation();

  // If redirected here with a trackId (from "Add to playlist" while logged out), stash it
  const incomingTrackId = location.state?.trackId;
  if (incomingTrackId) {
    sessionStorage.setItem("postLoginTrackId", incomingTrackId);
  }

  useEffect(() => {
    if (incomingTrackId) {
      console.log("Redirected with trackId:", incomingTrackId);
    }
  }, [incomingTrackId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userData.password || !userData.email) {
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/users/login`,
        userData,
      )
      .then((res) => {
        console.log("[Login] user data:", res);
        console.log("[Login] Login successful!");
        console.log("[Login] userToken:", res.data.userToken);
        console.log("[Login] userId:", res.data.user.id);
        console.log("[Login] username:", res.data.user.username);
        setUserToken(res.data.userToken);
        setUserId(res.data.user.id);
        localStorage.setItem("token", res.data.userToken);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("username", res.data.user.username);

        // decide where to redirect the user
        const stashedTrackId = sessionStorage.getItem("postLoginTrackId");
        if (stashedTrackId) {
          sessionStorage.removeItem("postLoginTrackId");
          navigate(`/track/${stashedTrackId}`, { replace: true });
        } else {
          navigate("/account", { replace: true });
        }
      })

      .catch((err) => {
        console.error("Login error:", err);
      });
  };

  const handleInput = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value }); // setNewUserData to a new object that spreads in any existing user data,
    // then sets any new input selected (by name) to the value of whatever is typed
  };

  return (
    <div className="register-container">
      <h2>Login Here</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" onChange={handleInput} />
        </label>

        <label>
          Password:
          <input type="password" name="password" onChange={handleInput} />
        </label>

        <button>Login</button>
        <p>
          Don't have an account? <Link to="/register">Register Now!</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
