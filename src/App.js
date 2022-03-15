import React, { useEffect, useReducer } from "react";
import { authReducer } from "./components/auth/authReducer";
import { AuthContext } from "./components/auth/authContext";
import { AppRouter } from "./components/router/AppRouter";

const init = () =>{
  return JSON.parse(localStorage.getItem("user")) ||  {logged: false}
}

const App = () => {
  const [user, dispatch] = useReducer(authReducer, {}, init);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user))
  }, [user])
  
  return (
    <authContext.provider value={{dispatch, user}}>
      <AppRouter/>
    </authContext.provider>
  );
};

export default App;
