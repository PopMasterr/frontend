import React, {useState} from "react";
import { Gamemodes } from "../helpers/Gamemodes";
import MenuItem from "../components/MenuItem";
import { Link } from "react-router-dom";
import "../styles/Menu.css";
import CreateOrJoinMultiplayerGame from "../components/CreateOrJoinMultiplayerGame";

function Play() {
    const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);

  return (
    <div className="menu">
      <h1 className="menuTitle">Gamemodes</h1>
        <div className="menuList">
            {Gamemodes.map((menuItem, key) => {
                return (
                    <Link to={menuItem.link}>
                        <MenuItem key={key} image={menuItem.image}/>
                    </Link>
                );
            })}
            <div className="profile">
                <button
                    className="edit-button"
                    onClick={() => setIsMultiplayerOpen(!isMultiplayerOpen)}
                >
                </button>
                {isMultiplayerOpen && (
                    <CreateOrJoinMultiplayerGame
                        onClose={() => setIsMultiplayerOpen(false)}
                    />
                )}
            </div>
        </div>

    </div>
  );
}

export default Play;
