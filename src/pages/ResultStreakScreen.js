import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Rectangle, useMap } from "react-leaflet";
import { GameContext } from "./PopGame";
import Cookies from "js-cookie";
import "leaflet/dist/leaflet.css";
import "../styles/ResultScreen.css";

function ResultScreen() {
  const {
    correct,
    streakScore,
    populationBlue,
    populationRed,
    cx1,
    cy1,
    cx2,
    cy2,
    cxr1,
    cyr1,
    cxr2,
    cyr2,
  } = useContext(GameContext);

  function FitBounds({ bounds }) {
    const map = useMap();
    useEffect(() => {
      map.fitBounds(bounds);
    }, [map, bounds]);
  }

  const navigate = useNavigate();

  const [highestStreak, setHighestStreak] = useState(0);

  const apiGetProfileStatistics =
    process.env.REACT_APP_API + "api/userMetrics/getMetrics";

  const getHighScore = async () => {
    try {
      const response = await fetch(apiGetProfileStatistics, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("AuthToken"),
          refreshToken: Cookies.get("RefreshToken"),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.error) {
        setHighestStreak(result.data.highest_streak);
      }
    } catch (error) {
      console.error(
        "There was an error fetching the profile statistics!",
        error
      );
    }
  };

  function handleAgain() {
    navigate("/streak");
    sessionStorage.removeItem("reloadas");
  }

  useEffect(() => {
    // Check if the page is reloaded
    const isReload =
      performance.getEntriesByType("navigation")[0].type === "reload";

    if (isReload && sessionStorage.getItem("reloadas")) {
      handleAgain();
    } else {
      sessionStorage.setItem("reloadas", true);
    }
  }, []);

  function displayScore() {
    getHighScore();
    if (correct) {
      return (
        <span>
          Correct! <br />
          <span className={"resultText"} style={{ color: "blue"}}>
            {new Intl.NumberFormat("en-US").format(populationBlue)}
          </span>
            &nbsp;vs&nbsp;
          <span className={"resultText"} style={{ color: "red"}}>
            {new Intl.NumberFormat("en-US").format(populationRed)}
          </span>
        </span>
      );
    } else {
      return (
        <span>
          Incorrect! <br />
          <span style={{ color: "blue" }}>
            {new Intl.NumberFormat("en-US").format(populationBlue)}
          </span>
             &nbsp;vs&nbsp;
          <span style={{ color: "red" }}>
            {new Intl.NumberFormat("en-US").format(populationRed)}
          </span>
        </span>
      );
    }
  }

  return (
    <div className="window">
        <div className="guessingWindow">
            <h1>{displayScore()}</h1>
            <div className="streak-container">
                <h1>Current Streak: {streakScore}</h1>
                <p>High Score: {highestStreak}</p>
            </div>
            <button className="generic-button guessing-button" onClick={handleAgain}>
                {correct ? "Continue" : "Play again"}
            </button>
        </div>
        <div className="mapWindow">
            <MapContainer
                center={[51.505, -0.09]}
                zoom={10}
                className="map-container"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Rectangle
            bounds={[
              [cy1, cx1],
              [cy2, cx2],
            ]}
            pathOptions={{ color: "blue", weight: 2 }}
          />
          <Rectangle
            bounds={[
              [cyr1, cxr1],
              [cyr2, cxr2],
            ]}
            pathOptions={{ color: "red", weight: 2 }}
          />
          <FitBounds
            bounds={[
              [cy1, cx1],
              [cy2, cx2],
            ]}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default ResultScreen;
