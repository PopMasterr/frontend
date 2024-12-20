import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Rectangle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";
import "../styles/PopGame.css";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [guess, setGuess] = useState(0);
  const [population, setPopulation] = useState(0);
  const [populationBlue, setPopulationBlue] = useState(0);
  const [populationRed, setPopulationRed] = useState(0);
  const [streakScore, setStreakScore] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [cx1, setcx1] = useState(0);
  const [cy1, setcy1] = useState(0);
  const [cx2, setcx2] = useState(0);
  const [cy2, setcy2] = useState(0);
  const [cxr1, setcxr1] = useState(0);
  const [cyr1, setcyr1] = useState(0);
  const [cxr2, setcxr2] = useState(0);
  const [cyr2, setcyr2] = useState(0);
  const [value, setValue] = useState("");

  return (
    <GameContext.Provider
      value={{
        correct,
        setCorrect,
        guess,
        setGuess,
        population,
        setPopulation,
        populationBlue,
        setPopulationBlue,
        populationRed,
        setPopulationRed,
        score,
        setScore,
        streakScore,
        setStreakScore,
        cx1,
        setcx1,
        cy1,
        setcy1,
        cx2,
        setcx2,
        cy2,
        setcy2,
        cxr1,
        setcxr1,
        cyr1,
        setcyr1,
        cxr2,
        setcxr2,
        cyr2,
        setcyr2,
        value,
        setValue,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

function PopGame() {
  sessionStorage.removeItem("reloadas");
  const apiURL = process.env.REACT_APP_API + "api/population";
  const navigate = useNavigate();
  const {
    guess,
    setGuess,
    setPopulation,
    setScore,
    cx1,
    setcx1,
    cy1,
    setcy1,
    cx2,
    setcx2,
    cy2,
    setcy2,
    value,
    setValue,
  } = useContext(GameContext);

  const [loaded, isLoaded] = useState(false);
  const [sentRequest, setSendRequest] = useState(false);

  const formatNumber = (num) => {
    if (!num) return "";
    return new Intl.NumberFormat("en-US").format(num.replace(/,/g, "")); // Format as US-style number with commas
  };

  const MAX_POPULATION = 8191988252;

  function handleGuess(event) {
    setGuess(event.target.value.replace(/,/g, ""));
    const numericValue = event.target.value.replace(/[^0-9.]/g, "");
    if (numericValue < MAX_POPULATION) {
      setValue(formatNumber(numericValue));
    } else {
      setValue(formatNumber(MAX_POPULATION.toString()));
      setGuess(MAX_POPULATION);
    }
  }

  async function getCoordinates() {
    const result = await fetch(apiURL + "/getCoordinates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: Cookies.get("AuthToken"),
        refreshToken: Cookies.get("RefreshToken"),
      },
    }).then((response) => response.json());
    if (result.error) {
      navigate("/error");
      console.log(result.error);
    } else {
      console.log(result);
      setcx1(result.x1);
      setcy1(result.y1);
      setcx2(result.x2);
      setcy2(result.y2);
      isLoaded(true);
    }
  }

  async function getPopulation() {
    if (loaded && !sentRequest) {
        setSendRequest(true);
      const result = await fetch(apiURL + "/getScore?guess=" + guess, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("AuthToken"),
          refreshToken: Cookies.get("RefreshToken"),
        },
      }).then((response) => response.json());
      if (result.error) {
        navigate("/error");
      } else {
        console.log(result);
        setPopulation(result.data.population);
        setScore(result.data.score);
        navigate("/resultscreen");
      }
    }
  }

  useEffect(() => {
    getCoordinates();
  }, []);

  useEffect(() => {
    setValue("");
  }, []);

  function FitBounds({ bounds }) {
    const map = useMap();

    useEffect(() => {
      map.fitBounds(bounds);
    }, [map, bounds]);
  }

  return (
    <div className="window">
      <div className="guessingWindow">
        <h1>Guess the population within the rectangle</h1>
        <input
          type="text"
          placeholder="Enter your guess"
          value={value}
          onChange={handleGuess}
          onKeyDown={(e) => {
            e.key === "Enter" && getPopulation();
          }}
        />
        <button className="generic-button guessing-button" onClick={getPopulation}>
          Guess
        </button>
      </div>
      <div className="mapWindow">
        <MapContainer
          className="map-container"
          worldCopyJump={true}
        >
          {loaded ? (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          ) : (
            <div className="loader" />
          )}
          {loaded && (
            <Rectangle
              bounds={[
                [cy1, cx1],
                [cy2, cx2],
              ]}
              pathOptions={{ color: "blue", weight: 2 }}
            />
          )}
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

export default PopGame;
