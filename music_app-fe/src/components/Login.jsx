import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//In your Login.jsx file, update your handleSubmit to send the email and password to the login endpoint.
function Login({ setUserToken, userToken }) {
  const [userData, setUserData] = useState({});
  // useNavigate lets us programmatically send the user to a different route with react router dom
  const navigate = useNavigate();

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
          localStorage.setItem("token", res.data.userToken);
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
    if (userToken) {
      navigate("/account"); // if the user is logged in, redirect to /account (don't allow a logged in user to access the "log in page")
    }
  }, [userToken, navigate]);

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
