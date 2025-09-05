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
  const trackId = location.state?.trackId;
  // stash the trackId from state so it exists after login or page refresh
  if (location.state?.trackId)
    sessionStorage.setItem("postLoginTrackId", location.state.trackId);
  // after successful login, retrieve stashed track Id
  const stashedTrackId = sessionStorage.getItem("postLoginTrackId");

  useEffect(() => {
    if (trackId) {
      console.log("Redirected with trackId:", trackId);
    }
  }, [trackId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userData.password && userData.email) {
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
        })
        .catch((err) => {
          console.error("Login error:", err);
        });
    }
  };

  const handleInput = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value }); // setNewUserData to a new object that spreads in any existing user data,
    // then sets any new input selected (by name) to the value of whatever is typed
  };

  // wrap useNavigate logic in a useEffect so the logic doesnt run immediately during render
  useEffect(() => {
    if (!userToken || !userId) return;

    if (stashedTrackId) {
      navigate(`/track/${stashedTrackId}`, { replace: true });
      sessionStorage.removeItem("postLoginTrackId");
    } else {
      navigate("/account", { replace: true });
    }
  }, [userToken, userId, navigate]);

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
