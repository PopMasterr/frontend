import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Rectangle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";
import "../styles/PopGame.css";
import { GameContext } from "./PopGame";
import { FaRegCopy } from "react-icons/fa";

function MultiplayerGame() {
    const location = useLocation();
    const [sentRequest, setSendRequest] = useState(false);
    const { gameId, round, gameCode } = location.state;

    const getAuthHeaders = {
        authorization: Cookies.get("AuthToken"),
        refreshToken: Cookies.get("RefreshToken"),
    };

    sessionStorage.removeItem("reloadas");
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
        const getCoordinatesAPI = process.env.REACT_APP_API + "api/gameRounds/getGameRoundCoordinates";
        const result = await fetch(getCoordinatesAPI + "?gameSessionId=" + gameId + "&round=" + round, {
            method: "GET",
            headers: {
                ...getAuthHeaders,
                "Content-Type": "application/json"
            },
        }).then((result) => result.json());
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
        const getPopulationAPI = process.env.REACT_APP_API + "api/gameRounds/getGameRoundPopulationAndScore";
        if (loaded && !sentRequest) {
            setSendRequest(true);
            const result = await fetch(getPopulationAPI + "?gameSessionId=" + gameId + "&round=" + round + "&guess=" + guess, {
                method: "GET",
                headers: {
                    ...getAuthHeaders,
                    "Content-Type": "application/json"
                },
            }).then((result) => result.json());
            if (result.error) {
                navigate("/error");
            } else {
                console.log(result);
                setPopulation(result.population);
                setScore(result.score);
                navigate("/resultmultiplayerscreen", { state: { gameId: gameId, round: round, gameCode: gameCode} });
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

    const copyGameCodeToClipboard = () => {
        navigator.clipboard.writeText(gameCode);
    };

    return (
        <div className="window">
            <div className="guessingWindow">
                <div className="location-info">
                    <p>Round: {round}</p>
                    <p>Code: {gameCode} <FaRegCopy onClick={copyGameCodeToClipboard} style={{ cursor: 'pointer' }} /></p>
                </div>
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

export default MultiplayerGame;