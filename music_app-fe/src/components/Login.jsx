import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
//In your Login.jsx file, update your handleSubmit to send the email and password to the login endpoint.
function Login({ setUserToken }) {
  const [userData, setUserData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userData.password && userData.email) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/users/login`,
          userData
        )
        .then((res) => {
          console.log("user data:", res);
          console.log("Login successful!", res.data.userToken);
          console.log(res.data.userToken);
          setUserToken(res.data.userToken);
        })
        .catch((err) => {
          console.error("Login error:", err.response?.data || err.message);
        });
    }
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
