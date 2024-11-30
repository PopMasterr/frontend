import React, {createContext, useContext, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {MapContainer, TileLayer, Rectangle, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";
import "../styles/PopGame.css";
import { FaGamepad } from "react-icons/fa";
import CreateOrJoinMultiplayerGame from "../components/CreateOrJoinMultiplayerGame";

function Multiplayer() {

    const getCoordinatesAPI = process.env.REACT_APP_API + "api/gameRounds/getGameRoundCoordinates";
    const getPopulationAPI = process.env.REACT_APP_API + "api/gameRounds/getGameRoundPopulationAndScore";
    const getGameScoresAPI = process.env.REACT_APP_API + "api/gameScores/getGameScores/";

    const getAuthHeaders = {
        authorization: Cookies.get("AuthToken"),
        refreshToken: Cookies.get("RefreshToken"),
    };


    const getCoordinates = async (gameId, round) => {
        const Coordinates = await fetch(getCoordinatesAPI + "?gameSessionId=" + gameId + "&round=" + round, {
            method: "GET",
            headers: {
                ...getAuthHeaders,
                "Content-Type": "application/json"
            },
        }).then((Coordinates) => Coordinates.json());
        if (!Coordinates.error) {
            console.log("Coordinates", Coordinates);
        }
    }

    const getPopulation = async (gameId, round, guess) => {
        const Population = await fetch(getPopulationAPI + "?gameSessionId=" + gameId + "&round=" + round + "&guess=" + guess, {
            method: "GET",
            headers: {
                ...getAuthHeaders,
                "Content-Type": "application/json"
            },
        }).then((Population) => Population.json());
        if (!Population.error) {
            console.log("Population and score", Population);
        }
    }

    const getGameScoresUpToRound = async (gameId, round) => {
        const gameScores = await fetch(getGameScoresAPI + gameId + "/" + round, {
            method: "GET",
        }).then((gameScores) => gameScores.json());
        if (!gameScores.error) {
            console.log("Game scores", gameScores);
        }
    }

    const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);

        return (
            <div>
                <h1>Multiplayer</h1>

                <div className="centras">
                    <div className="profile">
                        {/* Other profile content */}
                        <button
                            className="edit-button"
                            onClick={() => setIsMultiplayerOpen(!isMultiplayerOpen)}
                        >
                            <FaGamepad />
                        </button>
                        {isMultiplayerOpen && (
                            <CreateOrJoinMultiplayerGame
                                onClose={() => setIsMultiplayerOpen(false)}
                            />
                        )}
                    </div>
                </div>
                );



                <h1>GET COORDINATES. ENTER GAME ID, ROUND ID</h1>
                <div><input type="text" id="gameIdForCoord"/></div>
                <div><input type="number" id="roundForCoord"/></div>
                <input type="button" id="submitGameId" value="Submit" onClick={() => {
                    const gameId = document.getElementById("gameIdForCoord").value;
                    const round = document.getElementById("roundForCoord").value;
                    getCoordinates(gameId, round);
                }}/>
                <h1>GET POPULATION. ENTER GAME ID, ROUND ID, GUESS</h1>
                <div><input type="text" id="gameIdForPop" required/></div>
                <div><input type="number" id="roundForPop" required/></div>
                <div><input type="number" id="guess" required/></div>
                <input type="button" id="submitGameId" value="Submit" onClick={() => {
                    const gameIdForPop = document.getElementById("gameIdForPop").value;
                    const roundForPop = document.getElementById("roundForPop").value;
                    const guess = document.getElementById("guess").value;
                    getPopulation(gameIdForPop, roundForPop, guess);
                }}/>
                <h1>GET ALL USER SCORES UP TO ROUND. ENTER GAME ID, ROUND ID</h1>
                <div><input type="text" id="gameIdForScores"/></div>
                <div><input type="number" id="roundForScores"/></div>
                <input type="button" id="submitGameId" value="Submit" onClick={() => {
                    const gameIdForScores = document.getElementById("gameIdForScores").value;
                    const roundForScores = document.getElementById("roundForScores").value;
                    getGameScoresUpToRound(gameIdForScores, roundForScores);
                }}/>
            </div>
        )
}

export default Multiplayer;