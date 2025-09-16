import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Route path="/login"
function Login({ setUserToken, userToken, setUserId, userId }) {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
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
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  const handleGuestClick = () => {
    navigate("/");
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-neutral-900">
      <h2 className="py-2 text-center text-4xl font-bold text-slate-800 dark:text-slate-200">
        Login Here
      </h2>

      {/* Center the form content with a fixed max width */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-4 w-full max-w-sm space-y-4"
      >
        {/* Email field: label above input, input fills the centered container */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-center text-lg text-slate-800 dark:text-slate-200"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            onChange={handleInput}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100"
            autoComplete="email"
          />
        </div>

        {/* Password field */}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-center text-lg text-slate-800 dark:text-slate-200"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={handleInput}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100"
            autoComplete="current-password"
          />
        </div>

        {/* Actions */}
        <div className="pt-2">
          <button className="mx-auto inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600">
            Sign in
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>

        <div>
          <Link
            to="/register"
            className="mx-auto inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-center text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600"
          >
            Create Account
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </Link>
        </div>
      </form>

      <div className="mx-auto mt-4 w-full max-w-sm">
        <button
          onClick={handleGuestClick}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600"
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
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Login;
