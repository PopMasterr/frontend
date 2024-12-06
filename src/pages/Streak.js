import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Rectangle, useMap } from "react-leaflet";
import { GameContext } from "./PopGame";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";
import "../styles/PopGame.css";

function Streak() {
  sessionStorage.removeItem("reloadas");
  const apiURL = process.env.REACT_APP_API + "api/streak";
  const navigate = useNavigate();
  const {
    setCorrect,
    setPopulationBlue,
    setPopulationRed,
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
  } = useContext(GameContext);

  const [loaded, isLoaded] = useState(false);

  async function getCoordinates() {
    const result = await fetch(apiURL + "/getStreakCoordinates", {
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
      setcx1(result.coordinates1.x1);
      setcy1(result.coordinates1.y1);
      setcx2(result.coordinates1.x2);
      setcy2(result.coordinates1.y2);
      setcxr1(result.coordinates2.x1);
      setcyr1(result.coordinates2.y1);
      setcxr2(result.coordinates2.x2);
      setcyr2(result.coordinates2.y2);
      isLoaded(true);
    }
  }

  async function getPopulation(kuriSpalva) {
    if (loaded) {
      const result = await fetch(
        apiURL + "/getAnswerIsCorrectAndScore/" + kuriSpalva,
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
        navigate("/error");
      } else {
        console.log(result);
        setCorrect(result.answerIsCorrect);
        setPopulationRed(result.population2);
        setPopulationBlue(result.population1);
        setStreakScore(result.score);
        console.log(kuriSpalva);
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
        <button className="generic-button streak-button color1" onClick={() => getPopulation("blue")}>
          Blue rectangle
        </button>
        <button className="generic-button streak-button color2" onClick={() => getPopulation("red")}>
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
          {loaded && (
            <Rectangle
              bounds={[
                [cyr1, cxr1],
                [cyr2, cxr2],
              ]}
              pathOptions={{ color: "red", weight: 2 }}
            />
          )}
          <FitBounds
            bounds={[
              [Math.min(cy1, cyr1), Math.min(cx1, cxr1)],
              [Math.max(cy2, cyr2), Math.max(cx2, cxr2)],
            ]}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default Streak;
