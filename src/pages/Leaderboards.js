import React, { useEffect, useMemo, useState, useContext } from "react";
import { LoginContext } from "./Login";
import Cookies from "js-cookie";
import "../styles/Leaderboards.css";
import BannerImage from "../assets/homeBack.png";
import "../styles/Home.css";

function Leaderboards() {
  const apiGetTotalScoreLead =
    process.env.REACT_APP_API + "api/leaderboards/getTopPlayersOfTotalScore";
  const apiGetHighestStreakLead =
    process.env.REACT_APP_API + "api/leaderboards/getTopPlayersOfHighestStreak";
  const apiGetPerfectGuessesLead =
    process.env.REACT_APP_API +
    "api/leaderboards/getTopPlayersOfPerfectGuesses";
  const apiGetGamesPlayedLead =
    process.env.REACT_APP_API + "api/leaderboards/getTopPlayersOfGamesPlayed";

  const [totalScoreList, setTotalScoreList] = useState([]);
  const [highStreakList, setHighStreakList] = useState([]);
  const [perfectGuessList, setPerfectGuessList] = useState([]);
  const [gamesPlayedList, setGamesPlayedList] = useState([]);

  const [pasirinktas, setPasirinktas] = useState(totalScoreList);

  const [uzkroveTotalScore, setUzkroveTotalScore] = useState(0);
  const [uzkroveHighStreak, setUzkroveHighStreak] = useState(0);
  const [uzkrovePerfectGuesses, setUzkrovePerfectGuesses] = useState(0);
  const [uzkroveGamesPlayed, setUzkroveGamesPlayed] = useState(0);
  const { username } = useContext(LoginContext);

  const getAuthHeaders = useMemo(
    () => ({
      authorization: Cookies.get("AuthToken"),
      refreshToken: Cookies.get("RefreshToken"),
    }),
    []
  );

  const getTotalScoreList = async () => {
    try {
      const response = await fetch(apiGetTotalScoreLead, {
        method: "GET",
        headers: getAuthHeaders,
      });
      const result = await response.json();
      setTotalScoreList(result);
      setPasirinktas(result);
    } catch (error) {
      console.error("There was an error fetching the leadeboard!", error);
    }
    setUzkroveTotalScore(1);
  };

  const getHighStreakList = async () => {
    try {
      const response = await fetch(apiGetHighestStreakLead, {
        method: "GET",
        headers: getAuthHeaders,
      });
      const result = await response.json();
      setHighStreakList(result);
    } catch (error) {
      console.error("There was an error fetching the leadeboard!", error);
    }
    setUzkroveHighStreak(1);
  };

  const getPerfectGuessList = async () => {
    try {
      const response = await fetch(apiGetPerfectGuessesLead, {
        method: "GET",
        headers: getAuthHeaders,
      });
      const result = await response.json();
      setPerfectGuessList(result);
    } catch (error) {
      console.error("There was an error fetching the leadeboard!", error);
    }
    setUzkrovePerfectGuesses(1);
  };

  const getGamesPlayesList = async () => {
    try {
      const response = await fetch(apiGetGamesPlayedLead, {
        method: "GET",
        headers: getAuthHeaders,
      });
      const result = await response.json();
      setGamesPlayedList(result);
    } catch (error) {
      console.error("There was an error fetching the leadeboard!", error);
    }
    setUzkroveGamesPlayed(1);
  };

  const displayStuff = () => {
    getTotalScoreList();
    getHighStreakList();
    getPerfectGuessList();
    getGamesPlayesList();
  };

  const chooseScore = () => {
    setPasirinktas(totalScoreList);
  };

  const chooseStreak = () => {
    setPasirinktas(highStreakList);
  };

  const chooseGuesses = () => {
    setPasirinktas(perfectGuessList);
  };

  const choosePlayed = () => {
    setPasirinktas(gamesPlayedList);
  };

  useEffect(() => {
    displayStuff();
  }, []);

  const secondRowName = () => {
    if (pasirinktas === totalScoreList) {
      return "Score";
    } else if (pasirinktas === highStreakList) {
      return "Highest Streak";
    } else if (pasirinktas === perfectGuessList) {
      return "Perfect Guesses";
    } else if (pasirinktas === gamesPlayedList) {
      return "Games Played";
    }
  };

  const secondRow = (params) => {
    if (pasirinktas === totalScoreList) {
      return new Intl.NumberFormat("en-US").format(params.score);
    } else if (pasirinktas === highStreakList) {
      return new Intl.NumberFormat("en-US").format(params.highestStreak);
    } else if (pasirinktas === perfectGuessList) {
      return new Intl.NumberFormat("en-US").format(params.perfectGuesses);
    } else if (pasirinktas === gamesPlayedList) {
      return new Intl.NumberFormat("en-US").format(params.gamesPlayed);
    }
  };

  return (
    <div className="home" style={{ backgroundImage: `url(${BannerImage})` }}>
      <div className="leaderboards">
        {uzkroveTotalScore +
        uzkroveHighStreak +
        uzkrovePerfectGuesses +
        uzkroveGamesPlayed ? (
          <div className="leaderboards-buttons">
            <button
              onClick={chooseScore}
              className={pasirinktas === totalScoreList ? "selected" : ""}
            >
              Total Score
            </button>
            <button
              onClick={chooseStreak}
              className={pasirinktas === highStreakList ? "selected" : ""}
            >
              Highest Streak
            </button>
            <button
              onClick={chooseGuesses}
              className={pasirinktas === perfectGuessList ? "selected" : ""}
            >
              Total Perfect Guesses
            </button>
            <button
              onClick={choosePlayed}
              className={pasirinktas === gamesPlayedList ? "selected" : ""}
            >
              Total Games Played
            </button>
          </div>
        ) : (
          <div>Loading...</div>
        )}
        <div>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>{secondRowName()}</th>
              </tr>
            </thead>
            <tbody>
              {pasirinktas.map((item, key) => (
                <tr
                  key={key}
                  className={item.username === username ? "glowing-border" : ""}
                >
                  <td>{item.username}</td>
                  <td>{secondRow(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboards;
