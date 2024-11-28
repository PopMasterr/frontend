import React, { useContext, useState, useEffect } from "react";
import Logo from "../assets/5.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { LoginContext } from "../pages/Login";
import Cookies from "js-cookie";

function Navbar() {
  const { logged, setLogged } = useContext(LoginContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API + "api/auth/logout";

  function handleLogout() {
    if (logged) {
      setLogged(false);
      fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("AuthToken"),
          refresh_token: Cookies.get("RefreshToken"),
        },
      });
      Cookies.remove("AuthToken");
      Cookies.remove("RefreshToken");
      navigate("/");
    }
  }

  useEffect(() => {
    if (Cookies.get("AuthToken")) {
      setLogged(true);
      console.log("Logged in");
    }
  }, []);

  function handlePic() {
    navigate("/");
  }

  return (
    <div className="navbar">
      <div className="leftSide">
        <img src={Logo} onClick={handlePic} />
        <Link to="/">
          <h3>POPMASTERR</h3>
        </Link>
      </div>
      <div className="rightSide">
        <Link to="/">Home</Link>
        <Link to="/play">Play</Link>
        {!Cookies.get("AuthToken") ? (
          <Link to="/login">Log in</Link>
        ) : (
          <Link to="/profile">Profile</Link>
        )}
        <Link
          id="button"
          to={!Cookies.get("AuthToken") ? "/signup" : "/"}
          onClick={handleLogout}
        >
          {!Cookies.get("AuthToken") ? "Sign Up" : "Log out"}
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
