import React, { useState } from "react";
import "../styles/CreateOrJoinMultiplayerGame.css";
import Cookies from "js-cookie";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function CreateOrJoinMultiplayerGame(params){

    const navigate = useNavigate();
    const [gameId, setGameId] = useState(null);
    const [isInputVisible, setIsInputVisible] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const createGameSessionAPI = process.env.REACT_APP_API + "api/gameSessions/createGameSession";
    const getGameSessionIdAPI = process.env.REACT_APP_API + "api/gameSessions/getGameSessionByCode/";

    const getAuthHeaders = {
        authorization: Cookies.get("AuthToken"),
        refreshToken: Cookies.get("RefreshToken"),
    };

    const createNewGame = async () => {
        const roundCount = document.getElementById("roundCount").value;

        const response = await fetch(createGameSessionAPI, {
            method: "POST",
            headers: {
                ...getAuthHeaders,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({numberOfRounds: roundCount}),
        }).then((response) => response.json());
        if (!response.error) {
            setGameId(response);
            setIsInputVisible(false);
        }
    }

    const getGameSessionId = async () => {
        const gameCode = document.getElementById("gameCode").value;
        const gameIdResponse = await fetch(getGameSessionIdAPI + gameCode, {
            method: "GET",
            headers: {
                ...getAuthHeaders,
                "Content-Type": "application/json"
            },
        }).then((gameIdResponse) => gameIdResponse.json());
        if (!gameIdResponse.error) {
            navigate("/multiplayergame", { state: { gameId: gameIdResponse, round: 1 } });
        } else {
            setErrorMessage("Code doesn't exist");
        }
    }

    return(
        <div className="create-multiplayer-background">
            <div className="create-multiplayer-container">
                <button className="close-button" onClick={params.onClose}><IoCloseCircleOutline/></button>
                <h1 className="c-mp-text">Create a new multiplayer game!</h1>
                {isInputVisible ? (
                    <>
                        <h2>Enter round count:</h2>
                        <input type="number" id="roundCount" className="input-text" max="15" min="0" />
                        <input type="button" id="submitRoundCount" value="Submit" onClick={createNewGame} />
                    </>
                ) : (
                    <h2>Game ID: {gameId}</h2>
                )}
                <h1 className="c-mp-text">Join a multiplayer game!</h1>
                <h2>Enter game code:</h2>
                <input type="text" id="gameCode" className="input-text" />
                <input type="button" id="submitGameCode" value="Submit" onClick={getGameSessionId} />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    )
}

export default CreateOrJoinMultiplayerGame;