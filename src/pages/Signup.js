import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FaUser } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff, IoMdMail } from "react-icons/io";
import AuthError from "../components/AuthError";
import "../styles/PasswordMatchError.css";
import BannerImage from "../assets/homeBack.png";

function Signup() {
  const apiUrl = process.env.REACT_APP_API + "api/auth/register";
  const navigate = useNavigate();

  const [pasleptas1, setPasleptas1] = useState(1);
  const [pasleptas2, setPasleptas2] = useState(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [registerFailed, setRegisterFailed] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);

  function slaptazodis1() {
    setPasleptas1(!pasleptas1);
  }
  function slaptazodis2() {
    setPasleptas2(!pasleptas2);
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword1Change = (event) => {
    setPassword1(event.target.value);
  };

  const handlePassword2Change = (event) => {
    setPassword2(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("You have to enter a valid email");
      return;
    }
    if (password1 !== password2) {
      setPasswordsMatch(false);
    } else {
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, email: email, password: password1 }),
      })
          .then((data) => {
            console.log("Response data:", data);
            if (data.status === 201) {
              navigate("/login");
            } else if (data.status === 400) {
              setUsernameTaken(true);
            } else {
              setRegisterFailed(true);
            }
          })
          .catch((error) => console.log(error));
    }
  };

  return (
    <div className="back" style={{backgroundImage: `url(${BannerImage})`}} >
      <div className="wrapper">
        <form action="" onSubmit={handleFormSubmit}>
          <h1>Create an account!</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter your username"
              onChange={handleUsernameChange}
              required
            ></input>
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="text"
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
            ></input>
            <IoMdMail className="icon" />
          </div>
          <div className="input-box">
            <input
              type={pasleptas1 ? "password" : "text"}
              placeholder="Enter password"
              onChange={handlePassword1Change}
              required
            ></input>
            <IoMdEye
              className={pasleptas1 ? "pass" : "hidden"}
              onClick={slaptazodis1}
            />
            <IoMdEyeOff
              className={pasleptas1 ? "hidden" : "pass"}
              onClick={slaptazodis1}
            />
          </div>
          <div className="input-box">
            <input
              type={pasleptas2 ? "password" : "text"}
              placeholder="Confirm password"
              onChange={handlePassword2Change}
              required
            ></input>
            <IoMdEye
              className={pasleptas2 ? "pass" : "hidden"}
              onClick={slaptazodis2}
            />
            <IoMdEyeOff
              className={pasleptas2 ? "hidden" : "pass"}
              onClick={slaptazodis2}
            />
          </div>
          {!passwordsMatch && <AuthError message="Passwords do not match!" />}
          {usernameTaken && <AuthError message="Username already taken!" />}
          {registerFailed && <AuthError message="Server error, try again!" />}
          <button type="submit">Sign up</button>
          <div className="register-link">
            <Link to="/login">
              <a>Already have an account? Log in!</a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
