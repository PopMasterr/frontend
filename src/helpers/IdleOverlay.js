import "../styles/IdleOverlay.css";
import { IdleTimerProvider, useIdleTimer } from "react-idle-timer";
import Cookies from "js-cookie";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../pages/Login";

const IdleOverlay = ({ onStayActive }) => {
  const { logged, setLogged, setIsIdle } = useContext(LoginContext);
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
      setIsIdle(false);
      navigate("/");
    }
  }

  return (
    <IdleTimerProvider
      timeout={10 * 1000} // 10 minutes in milliseconds
      onIdle={handleLogout}
      debounce={500} // Debounce delay of 500ms
    >
      <div className="idle-overlay">
        <div className="idle-popup">
          <h2>Are you still playing?</h2>
          <p>Click the button below to stay grinding!</p>
          <button onClick={onStayActive}>I’m still playing</button>
        </div>
      </div>
    </IdleTimerProvider>
  );
};

export default IdleOverlay;
