import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Rectangle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";
import "../styles/PopGame.css";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [guess, setGuess] = useState(0);
  const [population_1, setpopulation_1] = useState(0);
  const [population_2, setpopulation_2] = useState(0);
  const [score, setScore] = useState(0);
  const [first_cx1, set_first_cx1] = useState(0);
  const [first_cy1, set_first_cy1] = useState(0);
  const [first_cx2, set_first_cx2] = useState(0);
  const [first_cy2, set_first_cy2] = useState(0);

  const [second_cx1, set_second_cx1] = useState(0);
  const [second_cy1, set_second_cy1] = useState(0);
  const [second_cx2, set_second_cx2] = useState(0);
  const [second_cy2, set_second_cy2] = useState(0);
  const [value, setValue] = useState("");

  return (
    <GameContext.Provider
      value={{
        guess,
        setGuess,
        population_1,
        setpopulation_1,
        population_2,
        setpopulation_2,
        score,
        setScore,
        first_cx1,
        set_first_cx1,
        first_cy1,
        set_first_cy1,
        first_cx2,
        set_first_cx2,
        first_cy2,
        set_first_cy2,
        second_cx1,
        set_second_cx1,
        second_cy1,
        set_second_cy1,
        second_cx2,
        set_second_cx2,
        second_cy2,
        set_second_cy2,
        value,
        setValue,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

function PopGame() {
  const apiURL = process.env.REACT_APP_API + "api/population";
  const navigate = useNavigate();
  const {
    guess,
    setGuess,
    setpopulation_1,
    population_1,
    population_2,
    setpopulation_2,
    setScore,
    first_cx1,
    set_first_cx1,
    first_cy1,
    set_first_cy1,
    first_cx2,
    set_first_cx2,
    first_cy2,
    set_first_cy2,
    second_cx1,
    set_second_cx1,
    second_cy1,
    set_second_cy1,
    second_cx2,
    set_second_cx2,
    second_cy2,
    set_second_cy2,
    value,
    setValue,
  } = useContext(GameContext);


  const [loaded, isLoaded] = useState(false);

  async function getCoordinates() {
    const result = await fetch(apiURL + "/getStreak", {
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
      set_first_cx1(result.coordinates.first_cx1);
      set_first_cy1(result.coordinates.first_cy1);
      set_first_cx2(result.coordinates.first_cx2);
      set_first_cy2(result.coordinates.first_cy2);

      set_second_cx2(result.coordinates.second_cx2);
      set_second_cy2(result.coordinates.second_cy2);
      set_second_cx1(result.coordinates.second_cx1);
      set_second_cy1(result.coordinates.second_cy1);
      isLoaded(true);
    }
  }

  async function getPopulation() {
    const result = await fetch(
      apiURL +
        "/getPopulation" +

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("AuthToken"),
          refreshToken: Cookies.get("RefreshToken"),
        },
      }
    ).then((response) => response.json());
    if (result.error) {
      console.log(guess);
      navigate("/error");
      console.log(result.error);
    } else {
      console.log(guess);
      setpopulation_1(result.guessData.population_1);
      setScore(result.guessData.score);
      navigate("/resultscreen");
    }
  }

  useEffect(() => {
    getCoordinates();
  }, []);

  if (loaded) {
    function FitBounds({ bounds }) {
      const map = useMap();

      useEffect(() => {
        map.fitBounds(bounds);
      }, [map, bounds]);
    }

    return (
      <div className="window">
        <div className="guessingWindow">
          <h1>Which rectangle has a higher population?</h1>
          <button onClick={}>Rectangle 1</button>
            <button >Rectangle 2</button>
        </div>
        <div className="mapWindow">
          <MapContainer
            style={{ height: "93vh", width: "100%" }}
            worldCopyJump={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Rectangle
              bounds={[
                [first_cy1, first_cx1],
                [first_cy2, first_cx2],
              ]}
              pathOptions={{ color: "blue", weight: 2 }}
            />
              <FitBounds
                  bounds={[
                      [first_cy1, first_cx1],
                      [first_cy2, first_cx2],
                  ]}
              />
              <Rectangle
                  bounds={[
                      [second_cy1, second_cx1],
                      [second_cy2, second_cx2],
                  ]}
                  pathOptions={{ color: "red", weight: 2 }}
              />
              <FitBounds
                  bounds={[
                      [second_cy1, second_cx1],
                      [second_cy2, second_cx2],
                  ]}
              />
          </MapContainer>
        </div>
      </div>
    );
  }
}

export default PopGame;
