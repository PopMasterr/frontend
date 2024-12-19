import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Rectangle, useMap } from "react-leaflet";
import { GameContext } from "./PopGame";
import "leaflet/dist/leaflet.css";
import "../styles/ResultScreen.css";
import Cookies from "js-cookie";
import { FaRegCopy } from "react-icons/fa";

function ResultMultiplayerScreen() {
    const location = useLocation();
    const { gameId, round, gameCode } = location.state;
    const [gameScores, setGameScores] = useState([]);

    const {
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

    const getRoundsAPI = process.env.REACT_APP_API + "api/gameSessions/getGameSessionsRounds/";
    const getGameScoresAPI = process.env.REACT_APP_API + "api/gameScores/getGameScores/";
    const [maxRounds, setMaxRounds] = useState(0);

    const gameRounds = async () => {
        const rounds = await fetch(getRoundsAPI + gameId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: Cookies.get("AuthToken"),
                refreshToken: Cookies.get("RefreshToken"),
            },
        }).then((response) => response.json());
        if (!rounds.error) {
            setMaxRounds(rounds);
        }
    }

    const getGameScoresUpToRound = async () => {
        setGameScores([]);
        const nextRound = (Number(round+1)).toString(); // js durnas lmfao, neleidzia tsg pridet 1
        const response = await fetch(getGameScoresAPI + gameId + "/" + nextRound, {
            method: "GET",
        }).then((response) => response.json());
        if (!response.error) {
            const scoresArray = Object.entries(response).map(([name, totalScore]) => ({ name, totalScore }));
            setGameScores(scoresArray);
        }
    }

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
        navigate("/multiplayergame", { state: { gameId: gameId, round: round + 1, gameCode: gameCode} });
    }


    useEffect(() => {
        gameRounds(gameId);
    }, [gameId]);

    useEffect(() => {
        getGameScoresUpToRound(gameId, round);
    }, [round, gameId]);

    const copyGameCodeToClipboard = () => {
        navigator.clipboard.writeText(gameCode);
    };

    return (
        <div className="window">
            <div className="guessingWindow">
                <div className="location-info">
                    <p>Round: {round}</p>
                    <p>Code: {gameCode} <FaRegCopy onClick={copyGameCodeToClipboard} style={{cursor: 'pointer'}}/></p>
                </div>
                <p>{score} points</p>
                <h1>{new Intl.NumberFormat("en-US").format(population)}</h1>
                <p>Your guess was {new Intl.NumberFormat("en-US").format(guess)}</p>
                {round < maxRounds ? (
                    <button className="generic-button guessing-button" onClick={handleAgain}>Next round!</button>
                ) : (
                    <h2>This was the final round!</h2>
                )}
                <div>
                    <ul>
                        <h2>Here are everyone's scores:</h2>
                        {gameScores.map((player, index) => (
                            <li key={index}>{player.name}: {player.totalScore} points</li>
                        ))}
                    </ul>
                </div>
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

export default ResultMultiplayerScreen;