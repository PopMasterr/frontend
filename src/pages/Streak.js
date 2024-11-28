import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Rectangle, useMap } from "react-leaflet";
import { GameContext } from "../pages/PopGame";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";
import "../styles/PopGame.css";

function Streak() {
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

  const [x1, setx1] = useState(0);
  const [y1, sety1] = useState(0);
  const [x2, setx2] = useState(0);
  const [y2, sety2] = useState(0);

  const [loaded, isLoaded] = useState(false);

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
    if (loaded) {
      const result = await fetch(apiURL + "/getScore" + "?guess=" + guess, {
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
        navigate("/resultstreakscreen");
      }
    }
  }

  useEffect(() => {
    getCoordinates();
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
        <h1>Press the rectangle with larger population</h1>
        <button className="color1" onClick={getPopulation}>
          Blue rectangle
        </button>
        <button className="color2" onClick={getPopulation}>
          Red rectangle
        </button>
      </div>
      <div className="mapWindow">
        <MapContainer
          style={{ height: "93vh", width: "100%" }}
          worldCopyJump={true}
        >
          {loaded ? (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          ) : (
            <div class="loader" />
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
          {loaded && (
            <Rectangle
              bounds={[
                [10, 10],
                [100, 100],
              ]}
              pathOptions={{ color: "red", weight: 2 }}
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

export default Streak;
