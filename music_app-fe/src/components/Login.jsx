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

  const handleGuestClick = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <h2 className="dark:text-slate-200">Login Here</h2>
      <form onSubmit={handleSubmit}>
        <label className="dark:text-slate-200">
          Email:
          <input
            className="dark:bg-neutral-700 dark:text-slate-200"
            type="email"
            name="email"
            onChange={handleInput}
          />
        </label>

        <label className="dark:text-slate-200">
          Password:
          <input type="password" name="password" onChange={handleInput} />
        </label>

        <div className="flex flex-wrap justify-center gap-2">
          <button className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50">
            Sign in
          </button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
            to="/register"
          >
            Create Account
          </Link>
        </div>
      </form>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={handleGuestClick}
          className="inline-flex items-center rounded-md border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
        >
          Continue as a guest{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Login;
