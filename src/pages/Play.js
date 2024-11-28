import React from "react";
import { Gamemodes } from "../helpers/Gamemodes";
import MenuItem from "../components/MenuItem";
import { Link } from "react-router-dom";
import "../styles/Menu.css";

function Play() {
  return (
    <div className="menu">
      <h1 className="menuTitle">Gamemodes</h1>
      <div className="menuList">
        {Gamemodes.map((menuItem, key) => {
          return (
            <Link to={menuItem.link}>
              <MenuItem key={key} image={menuItem.image} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Play;
