import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Play from "./pages/Play";
import Login, { LoginContext } from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PopGame from "./pages/PopGame";
import Error from "./pages/Error";
import Streak from "./pages/Streak";
import ResultScreen from "./pages/ResultScreen";
import ResultStreakScreen from "./pages/ResultStreakScreen";
import { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { IdleTimerProvider, useIdleTimer } from "react-idle-timer";
import IdleOverlay from "./helpers/IdleOverlay";
import Multiplayer  from "./pages/Multiplayer";
import MultiplayerGame from "./pages/MultiplayerGame";
import ResultMultiplayerScreen from "./pages/ResultMultiplayerScreen";

function App() {
  const { logged, setLogged, isIdle, setIsIdle, username, setUsername } =
    useContext(LoginContext);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleOnIdle = () => {
    if (Cookies.get("AuthToken")) {
      setIsIdle(true);
    }
  };

  const handleOnActive = () => {
    setIsIdle(false);
  };

  return (
    <IdleTimerProvider
      timeout={20 * 60 * 1000} // 20 seconds idle time causes handleOnIdle
      onIdle={handleOnIdle}
      debounce={500} // Debounce delay of 500ms
    >
      <div className="App">
        <Router>
          <Navbar />
          {isIdle && <IdleOverlay onStayActive={handleOnActive} />}
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/play" element={<Play />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/popGame" element={<PopGame />} />
            <Route exact path="/streak" element={<Streak />} />
            <Route exact path="/error" element={<Error />} />
            <Route exact path="/resultscreen" element={<ResultScreen />} />
            <Route exact path="/multiplayer" element={<Multiplayer />} />
            <Route exact path="/multiplayergame" element={<MultiplayerGame />} />
            <Route
              exact
              path="/resultstreakscreen"
              element={<ResultStreakScreen />}
            />
            <Route exact path="/resultmultiplayerscreen" element={<ResultMultiplayerScreen />} />
          </Routes>
        </Router>
      </div>
    </IdleTimerProvider>
  );
}

export default App;
