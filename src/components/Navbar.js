import React, { useContext, useState, useEffect } from "react";
import Logo from "../assets/5.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { LoginContext } from "../pages/Login";
import Cookies from "js-cookie";

function Navbar() {
  const { logged, setLogged } = useContext(LoginContext);
  const [menuOpen, setMenuOpen] = useState(false);
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

  function toggleMenu() {
    setMenuOpen(!menuOpen);
    const navbar = document.querySelector('.navbar');
    if (navbar) {
    navbar.classList.toggle('expanded', !menuOpen);
    }
  }

  return (
    <div className="navbar">
      <div className="leftSide">
        <img src={Logo} alt="Logo" onClick={handlePic} />
        <Link to="/">
          <h3>POPMASTERR</h3>
        </Link>
      </div>
      <div className="rightSide">
      <button className="hamburger" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
      </button>
        <Link className="rightButton" to="/">Home</Link>
        <Link className="rightButton" to="/play">Play</Link>
        {!Cookies.get("AuthToken") ? (
          <Link className="rightButton" to="/login">Log in</Link>
        ) : (
          <Link className="rightButton" to="/profile">Profile</Link>
        )}
        <Link className="rightButton" id="button" to={!Cookies.get("AuthToken") ? "/signup" : "/"} onClick={handleLogout}>
          {!Cookies.get("AuthToken") ? "Sign Up" : "Log out"}
        </Link>
        
      </div>
      <div className={menuOpen ? "mobileMenu" : "mobileMenu hidden"}>
        <Link className="rightButton2" to="/">Home</Link> 
        <Link className="rightButton2" to="/play">Play</Link>
        {!Cookies.get("AuthToken") ? (
          <Link className="rightButton2" to="/login">Login</Link>
        ) : (
          <Link className="rightButton2" to="/profile">Profile</Link>
        )}
        <Link className="rightButton2" to={!Cookies.get("AuthToken") ? "/signup" : "/"}
          onClick={handleLogout}>
            {!Cookies.get("AuthToken") ? "SignUp" : "Logout"}
            </Link>
        </div>
    </div>
  );
}

export default Navbar;
