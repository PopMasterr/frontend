import React from "react";

function MenuItem({ image }) {
  return (
    <div className="menuItem">
      <img src={image}></img>
    </div>
  );
}

export default MenuItem;
