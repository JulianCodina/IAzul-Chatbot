import { useEffect, useState } from "react";
import style from './App.module.css'
import Chatbot from './chatbot.jsx'
import Tablas from './tablas.jsx'
import Auth from './auth.jsx'
import { supabase } from '../utils/supabase'
import { useAuthContext } from './AuthContext';

export default function App() {
  const { user, setUser, loading } = useAuthContext();
  const [login, setLogin] = useState(false);
  const [tipoLogin, setTipoLogin] = useState("signin");
  const [alerta, setAlerta] = useState(0);
  const [alertaText, setAlertaText] = useState("");
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (alerta) {
      const timer = setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => {
          setAlerta(false);
          setIsHiding(false);
        }, 500);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  return (
    <div className={style["app"]}>
      {login && <div className={style["dark"]} onClick={() => setLogin(false)}/>}
      {alerta === 1 && (
        <div className={`${style.alerta} ${style.success} ${isHiding ? style.hide : ''}`}>
          <img src="./assets/ok.png" alt="alerta"/>
          <p>{alertaText}</p>
        </div>
      )}
      {alerta === 2 && (
        <div className={`${style.alerta} ${style.warning} ${isHiding ? style.hide : ''}`}>
          <img src="./assets/warn.png" alt="alerta"/>
          <p>{alertaText}</p>
        </div>
      )}
      {alerta === 3 && (
        <div className={`${style.alerta} ${style.error} ${isHiding ? style.hide : ''}`}>
          <img src="./assets/error.png" alt="alerta"/>
          <p>{alertaText}</p>
        </div>
      )}
      <div className={style["header"]}>
        {!user ? (
          <>
            <button className={style["register"]} onClick={() => {setTipoLogin("signup"), setLogin(true)}}>Registrarse</button>
            <button className={style["login"]} onClick={() => {setTipoLogin("signin"), setLogin(true)}}>
              <p>Iniciar sesión</p>
            </button>
          </>
        ) : (
          <button className={style["login"]} onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
            setAlerta(1);
            setAlertaText("Sesión cerrada correctamente");
          }}>
            <p>Cerrar sesión</p>
          </button>
        )}
      </div>
      <div className={style["chat-table"]}>
          {login && <Auth setModal={setLogin} tipoLogin={tipoLogin} setTipoLogin={setTipoLogin} setAlerta={setAlerta} setAlertaText={setAlertaText}/>}
          <Chatbot/>
          <Tablas setAlerta={setAlerta} setAlertaText={setAlertaText} setTipoLogin={setTipoLogin} setLogin={setLogin}/>
      </div>
    </div>
  )
}
