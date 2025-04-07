import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// pass setToken prop name inside the Register function/component
function Register({ setUserToken, userToken }) {
  const [newUserData, setNewUserData] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newUserData.password && newUserData.email) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/users/register`,
          newUserData
        )
        .then((res) => {
          console.log("new user data:", res);
          setUserToken(res.data.userToken);
          localStorage.setItem("token", res.data.userToken); // localStorage is an object built-into the browser's javascript. (browser object methods) it is accessable with javascript, without any libraries.
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
    if (userToken) {
      navigate("/account");
    }
  }, [userToken, navigate]);

  return (
    <div className="register-container">
      <h2>Register Here</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstname" onChange={handleInput} />
        </label>

        <label>
          Last Name:
          <input type="text" name="lastname" onChange={handleInput} />
        </label>

        <label>
          Username:
          <input type="text" name="username" onChange={handleInput} />
        </label>

        <label>
          Email:
          <input type="email" name="email" onChange={handleInput} />
        </label>

        <label>
          Password:
          <input type="password" name="password" onChange={handleInput} />
        </label>

        <button>Register Now!</button>
      </form>
    </div>
  );
}

export default Register;
