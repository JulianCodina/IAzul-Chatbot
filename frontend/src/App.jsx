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
      <nav>
          <div className={style["logo"]} onClick={() => {window.location.href = "#chatbot"}}>
            <img src="./assets/chatbot.png" alt="logo"/> 
            <h4>IAzul</h4>
          </div>
          <a href="#chatbot" style={{display: "flex", alignItems: "center", gap: "5px"}}>
            <p>Conversá con la </p> <p style={{fontWeight: "bold"}}>IA</p>
          </a>
          <a href="https://github.com/JulianCodina/IAzul-Chatbot" target="_blank" style={{display: "flex", alignItems: "center", gap: "5px"}}>
            <p>Ver </p> <p style={{fontWeight: "bold"}}>GitHub</p>
          </a>
          <a href="https://codina-portfolio.vercel.app/" target="_blank" style={{display: "flex", alignItems: "center", gap: "5px"}}>
            <p>Visitar </p> <p style={{fontWeight: "bold"}}>Portafolio</p>
          </a>
      </nav>
      <main>
        <div className={style["encabezado"]}>
          <h1>Hablar con Inteligencia Artificial en línea</h1>
          <p>Simplemente pregunta a tu chatbot de IA para generar contenido!</p>
          <div className={style["card"]}>
            <div className={style["card-inner"]}>
                <img src="./assets/logo3d2.png" className={style["card-front"]} alt="chatbot"/>
                <img src="./assets/logo3d1.png" className={style["card-back"]} alt="chatbot"/>
            </div>
          </div>
        </div>
        <section className={style["section1"]}>
          <article className={style["article1"]}>
            <h1>Chatbot de IA: Pregunta y habla sobre cualquier cosa con la IA</h1>
            <p>
              El chatbot gratuito de AI Chatting que puede responder cualquier pregunta que puedas tener. 
              Es fácil de usar e interactuar con él, simplemente escribe tu pregunta y obtén una respuesta. 
              ¡Pruébalo ahora y descubre cómo puede ayudarte!
            </p>
            <div className={style["ideas"]}>
              <p>Cuando nació Michael Jackson</p>
              <p>Cual es el color del cielo</p>
              <p>Quién es el presidente de Argentina</p>
              <p>Recomendaciones de peliculas</p>
              <p>Quién es el presidente de Argentina</p>
              <p>Recomendaciones de peliculas</p>
            </div>
          </article>
          <div>
            <img src="./assets/img.png" alt="chatbot" />
          </div>
        </section>
        <section className={style["section2"]}>
          <div>
            <img src="./assets/img.png" alt="data base"/>
          </div>
          <article className={style["article2"]}>
            <h1>Añade nuevos productos a la base de datos</h1>
            <p>
              Añade nuevos productos a la base de datos para que la IA pueda responder preguntas sobre ellos.
              Es fácil de usar e interactuar con él, simplemente escribe tu pregunta y obtén una respuesta. 
              Solo necesitas iniciar sesion.
            </p>
          </article>
        </section>
      </main>
      <div className={style["chat-table"]}>
          {login && <Auth setModal={setLogin} tipoLogin={tipoLogin} setTipoLogin={setTipoLogin} setAlerta={setAlerta} setAlertaText={setAlertaText}/>}
          <Chatbot/>
          <Tablas setAlerta={setAlerta} setAlertaText={setAlertaText} setTipoLogin={setTipoLogin} setLogin={setLogin}/>
      </div>
        <section className={style["section3"]}>
          <article className={style["article3"]}>
            <h1>AI Chatting: Chatea, Responde, Crea, Inspira y más</h1>
            <p>¡Descubre ahora el potencial ilimitado de la IA con AI Chatting!</p>
              <div className={style["tarjetas"]}>
                <p>Imagínense todos los campos en los que se puede aplicar este programa. Seria de muchísima ayuda para cualquier empresa</p>
                <p>Poder hablarle en el idioma que te apetezca y obtener aun asi el resultado correcto.</p>
                <p>Lo lindo de obtener la información que nos interesa de forma tan eficiente e instantánea.</p>
              </div>
          </article>
        </section>
    </div>
  )
}
