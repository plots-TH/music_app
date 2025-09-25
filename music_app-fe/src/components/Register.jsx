import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// pass setToken prop name inside the Register function/component
// Route path="/register"
function Register({ setUserToken, userToken, setUserId, userId }) {
  const [newUserData, setNewUserData] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newUserData.password && newUserData.email) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/users/register`,
          newUserData,
        )
        .then((res) => {
          console.log("new user data:", res);
          setUserToken(res.data.userToken);
          setUserId(res.data.user.id);
          localStorage.setItem("token", res.data.userToken); // localStorage is an object built-into the browser's javascript. (browser object methods) it is accessable with javascript, without any libraries.
          localStorage.setItem("userId", res.data.user.id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleInput = (event) => {
    setNewUserData({ ...newUserData, [event.target.name]: event.target.value }); // setNewUserData to a new object that spreads in any existing user data,
    // then sets any new input selected (by name) to the value of whatever is typed
  };

  useEffect(() => {
    if (userToken && userId) {
      navigate("/account");
    }
  }, [userToken, userId, navigate]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-neutral-900">
      <h2 className="py-2 text-center text-4xl font-bold text-slate-800 dark:text-slate-200">
        Register Here
      </h2>
      <form onSubmit={handleSubmit} className="mx-auto mt-4 w-full max-w-sm">
        <label>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            onChange={handleInput}
            className="mb-4 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100"
          />
        </label>

        <label>
          <input
            type="text"
            name="lastname"
            placeholder="Last name"
            onChange={handleInput}
            className="mb-4 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100"
          />
        </label>

        <label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleInput}
            className="mb-4 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100"
          />
        </label>

        <label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInput}
            className="mb-4 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100"
          />
        </label>

        <label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInput}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100"
          />
        </label>

        <button className="mx-auto mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-neutral-700 dark:text-slate-100 dark:hover:bg-neutral-600">
          Register Now!
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
              d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default Register;
