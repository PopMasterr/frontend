import React from "react";

function AuthError(params) {
  return (
    <div className="errorWrap">
      <p>{params.message}</p>
    </div>
  );
}

export default AuthError;
