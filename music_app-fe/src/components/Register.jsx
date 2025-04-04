import React, { useState } from "react";
import axios from "axios";

// pass setToken prop name inside the Register function/component
function Register({ setToken }) {
  const [newUserData, setNewUserData] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newUserData.password && newUserData.email) {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_API_BASE_URL}/users/register`,
          newUserData
        )
        .then((data) => {
          console.log("new user data:", data);
          setToken(data.data.userToken);
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
