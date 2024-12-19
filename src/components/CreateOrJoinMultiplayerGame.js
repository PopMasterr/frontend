import React, { useState } from "react";
import "../styles/CreateOrJoinMultiplayerGame.css";
import Cookies from "js-cookie";
import { IoCloseCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CreateOrJoinMultiplayerGame(params) {
    const navigate = useNavigate();
    const [gameId, setGameId] = useState(null);
    const [isInputVisible, setIsInputVisible] = useState(true);
    const [isCreateVisible, setIsCreateVisible] = useState(false);
    const [isJoinVisible, setIsJoinVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const createGameSessionAPI = process.env.REACT_APP_API + "api/gameSessions/createGameSession";
    const getGameSessionIdAPI = process.env.REACT_APP_API + "api/gameSessions/getGameSessionByCode/";

    const getAuthHeaders = {
        authorization: Cookies.get("AuthToken"),
        refreshToken: Cookies.get("RefreshToken"),
    };

    const createNewGame = async () => {
        let roundCount = document.getElementById("roundCount").value;
        if(roundCount < 1){
            roundCount = 5
        } else{
            if(roundCount > 15){
                roundCount = 15
            }
        }

        const response = await fetch(createGameSessionAPI, {
            method: "POST",
            headers: {
                ...getAuthHeaders,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ numberOfRounds: roundCount }),
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
        if (gameIdResponse.error || gameIdResponse.message) {
            setErrorMessage("Code doesn't exist");
        } else {
            navigate("/multiplayergame", { state: { gameId: gameIdResponse, round: 1, gameCode: document.getElementById("gameCode").value } });
        }
    }

    const startGame = async () => {
        const gameIdResponse = await fetch(getGameSessionIdAPI + gameId, {
            method: "GET",
            headers: {
                ...getAuthHeaders,
                "Content-Type": "application/json"
            },
        }).then((gameIdResponse) => gameIdResponse.json());
        if (gameIdResponse.error ) {
            setErrorMessage("Code doesn't exist");
        } else {
            navigate("/multiplayergame", {state: {gameId: gameIdResponse, round: 1, gameCode: gameId}});
        }
    }

    const copyGameIdToClipboard = () => {
        navigator.clipboard.writeText(gameId);
    }

    return (
        <div className="create-multiplayer-background">
            <div className="create-multiplayer-container">
                <button className="close-button" onClick={params.onClose}><IoCloseCircleOutline /></button>
                {!isCreateVisible && !isJoinVisible && (
                    <>
                        <button className="generic-button generic-bigger-button" onClick={() => setIsCreateVisible(true)}>Create Game</button>
                        <button className="generic-button generic-bigger-button" onClick={() => setIsJoinVisible(true)}>Join Game</button>
                    </>
                )}
                {isCreateVisible && (
                    <>
                        {isInputVisible ? (
                            <>
                                <h2>Enter round count:</h2>
                                <input type="number" placeholder={5} id="roundCount" className="input-text round" max="15" min="1" />
                                <input type="button" className="generic-button" id="submitRoundCount" value="Submit" onClick={createNewGame} />
                                <IoArrowBackCircleOutline onClick={() => setIsCreateVisible(false)} className="circle-button" />
                            </>
                        ) : (
                            <>
                                <h2>Game ID: {gameId} <FaRegCopy onClick={copyGameIdToClipboard}  style={{cursor: "pointer"}}/></h2>
                                <button className="generic-button" onClick={startGame}>Start Game</button>
                                <IoArrowBackCircleOutline onClick={() => {
                                    setIsCreateVisible(false);
                                    setIsInputVisible(true);
                                }} className="circle-button"/>
                            </>
                        )}
                    </>
                )}
                {isJoinVisible && (
                    <>
                        <h2>Enter game code:</h2>
                        <input type="text" id="gameCode" className="input-text" />
                        <input type="button" className="generic-button" id="submitGameCode" value="Submit" onClick={getGameSessionId} />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <IoArrowBackCircleOutline onClick={() => setIsJoinVisible(false)} className="circle-button" />
                    </>
                )}
            </div>
        </div>
    )
}

export default CreateOrJoinMultiplayerGame;