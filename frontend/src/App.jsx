import { useEffect, useState } from "react";
import style from './App.module.css'
import Chatbot from './chatbot.jsx'
import Tablas from './tablas.jsx'
import Auth from './auth.jsx'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState(false);
  const [tipoLogin, setTipoLogin] = useState("signin");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  
  return (
    <div className={style["app"]}>
      {login && <div className={style["dark"]} onClick={() => setLogin(false)}/>}
      <div className={style["header"]}>
        <button className={style["register"]} onClick={() => {setTipoLogin("signup"), setLogin(true)}}>Registrarse</button>
        <button className={style["login"]} onClick={() => {setTipoLogin("signin"), setLogin(true)}}>
          <p>Iniciar sesión</p>
        </button>
      </div>
      <div className={style["chat-table"]}>
          {login && <Auth setModal={setLogin} tipoLogin={tipoLogin} setTipoLogin={setTipoLogin}/>}
          <Chatbot/>
          <Tablas/>
      </div>
    </div>
  )
}
