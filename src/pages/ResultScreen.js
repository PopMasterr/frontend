import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Rectangle, useMap } from "react-leaflet";
import { GameContext } from "../pages/PopGame";
import "leaflet/dist/leaflet.css";
import "../styles/ResultScreen.css";

function ResultScreen() {
  const {
    value,
    setValue,
    guess,
    setGuess,
    population,
    score,
    cx1,
    cy1,
    cx2,
    cy2,
  } = useContext(GameContext);

  function FitBounds({ bounds }) {
    const map = useMap();
    useEffect(() => {
      map.fitBounds(bounds);
    }, [map, bounds]);
  }

  const navigate = useNavigate();

  function handleAgain() {
    setValue("");
    setGuess(0);
    navigate("/popgame");
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

  return (
    <div className="window">
      <div className="guessingWindow">
        <p>{score} points</p>
        <h1>{new Intl.NumberFormat("en-US").format(population)}</h1>
        <p>Your guess was {new Intl.NumberFormat("en-US").format(guess)}</p>
        <button onClick={handleAgain}>Play again</button>
      </div>
      <div className="mapWindow">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={10}
          style={{ height: "94vh", width: "100%" }}
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
