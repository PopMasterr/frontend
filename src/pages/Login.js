import React, { useState, useContext, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { FaUser } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Cookies from "js-cookie";
import AuthError from "../components/AuthError";
import "../styles/PasswordMatchError.css";
import BannerImage from "../assets/homeBack.png";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [isIdle, setIsIdle] = useState(false);

  return (
    <LoginContext.Provider
      value={{ logged, setLogged, username, setUsername, isIdle, setIsIdle }}
    >
      {children}
    </LoginContext.Provider>
  );
};

function Login() {
  const [pasleptas, setPasleptas] = useState(1);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const { logged, setLogged, username, setUsername } = useContext(LoginContext);

  const apiUrl = process.env.REACT_APP_API + "api/auth/login";
  const navigate = useNavigate();

  function slaptazodis() {
    setPasleptas(!pasleptas);
  }

  function handleUsername(event) {
    setUsername(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const result = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
    if (!result.error) {
      Cookies.set("AuthToken", result.token.authToken);
      Cookies.set("RefreshToken", result.token.refreshToken);

      console.log(Cookies.get("AuthToken"));
      console.log(Cookies.get("RefreshToken"));

      setLogged(true);
      setUsername(username); // Set the username in the context
      localStorage.setItem("username", username); // Store the username in localStorage
      navigate("/");
    } else {
      console.log(result.error);
      setPasswordError(true);
    }
  };

  return (
    <LoginContext.Provider value={{ username, setUsername, logged, setLogged }}>
      <div className="back" style={{backgroundImage: `url(${BannerImage})`}}>
        <div className="wrapper">
          <form action="" onSubmit={handleFormSubmit}>
            <h1>Log in</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Enter your username"
                onChange={handleUsername}
                required
              ></input>
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type={pasleptas ? "password" : "text"}
                placeholder="Enter password"
                onChange={handlePassword}
                required
              ></input>
              <IoMdEye
                className={pasleptas ? "pass" : "hidden"}
                onClick={slaptazodis}
              />
              <IoMdEyeOff
                className={pasleptas ? "hidden" : "pass"}
                onClick={slaptazodis}
              />
            </div>
            {passwordError && (
              <AuthError message="Wrong username or password!" />
            )}
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Login</button>
            <div className="register-link">
              <Link to="/signup">
                <a>Create an account</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </LoginContext.Provider>
  );
}

export default Login;
