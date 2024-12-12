import React, {useState} from "react";
import { Gamemodes } from "../helpers/Gamemodes";
import MenuItem from "../components/MenuItem";
import { Link } from "react-router-dom";
import "../styles/Menu.css";
import CreateOrJoinMultiplayerGame from "../components/CreateOrJoinMultiplayerGame";
import multiplayer from "../assets/play/Multiplayer.svg";

function Play() {
    const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);

    return (
        <div className="menu">
        <h1 className="menuTitle">Gamemodes</h1>
            <div className="menuList">
                {Gamemodes.map((menuItem, key) => {
                    return (
                        <Link to={menuItem.link} key={key}>
                            <MenuItem image={menuItem.image}/>
                        </Link>
                    );
                })}
                <div className="menuItem">
                    <img
                        src={multiplayer}
                        alt="multiplayer"
                        onClick={() => setIsMultiplayerOpen(!isMultiplayerOpen)}
                    />
                </div>
                {isMultiplayerOpen && (
                    <CreateOrJoinMultiplayerGame
                        onClose={() => setIsMultiplayerOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default Play;
