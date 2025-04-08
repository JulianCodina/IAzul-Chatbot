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
  const [showTopButton, setShowTopButton] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Altura total del documento
      const documentHeight = document.documentElement.scrollHeight;
      // Altura de la ventana
      const windowHeight = window.innerHeight;
      // Posición actual del scroll
      const scrollPosition = window.scrollY;
      
      // Calculamos el 30% de la altura total del documento
      const thirtyPercentPoint = documentHeight * 0.2;
      
      // Mostramos el botón cuando el scroll supera el 30% de la página
      if (scrollPosition > thirtyPercentPoint) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Ejecutamos handleScroll al montar el componente para verificar la posición inicial
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
      <div 
        className={`${style["footer"]} ${showTopButton ? style.show : ''}`}
        onClick={scrollToTop}
      >
        <img src="./assets/top.png" alt="top" />
      </div>
      <nav id="nav">
          <div className={style["logo"]} onClick={() => {window.location.href = "#chatbot"}}>
          <img src="./assets/chatbot.png" alt="logo"/> 
          <h4>IAzul</h4>
        </div>
        <a href="#chatbot" onClick={(e) => {
          e.preventDefault();
          scrollToSection('chatbot');
        }} style={{display: "flex", alignItems: "center", gap: "5px"}}>
          <p className={style["plano"]}>Conversá con la </p> <p className={style["plano"] + " " + style["bold"]}>IA</p>
        </a>
        <a href="https://github.com/JulianCodina/IAzul-Chatbot" target="_blank" style={{display: "flex", alignItems: "center", gap: "5px"}}>
          <p className={style["plano"]}>Ver </p> <p className={style["bold"]}>GitHub</p>
        </a>
        <a href="https://codina-portfolio.vercel.app/" target="_blank" style={{display: "flex", alignItems: "center", gap: "5px"}}>
          <p className={style["plano"]}>Visitar </p> <p className={style["bold"]}>Portafolio</p>
        </a>
      </nav>
      <main>
        <div className={style["encabezado"]}>
          <h1>Habla con IAzul, el asistente virtual</h1>
          <p>Explorá el poder de la inteligencia artificial aplicada a un negocio real.</p>
          <div className={style["card"]}>
            <div className={style["card-inner"]}>
                <img src="./assets/logo3d2.png" className={style["card-front"]} alt="chatbot"/>
                <img src="./assets/logo3d1.png" className={style["card-back"]} alt="chatbot"/>
            </div>
          </div>
        </div>
        <section className={style["section1"]}>
          <article className={style["article1"]}>
            <h1>Chatbot IAzul: Una asistente con conocimiento total del local</h1>
            <p>
            IAzul no solo entiende lo que decís, también conoce el funcionamiento del local de electrónica en profundidad. 
            Puede ayudarte con dudas sobre productos, gestionar operaciones y ofrecer atención personalizada como si estuvieras 
            hablando con una persona real.
            </p>
            <div className={style["ideas"]}>
              <p>¿Cuando nació Michael Jackson?</p>
              <p>¿Cual es el color del cielo?</p>
              <p>¿Quién es el presidente de Argentina?</p>
              <p>¿Qué productos tenes en stock?</p>
              <p>¿Cuáles fueron las últimas compras?</p>
              <p>¿Tenes el iphone 15?</p>
            </div>
          </article>
          <div>
            <img src="./assets/img.png" alt="chatbot" />
          </div>
        </section>
        <section className={style["section2"]}>
          <div className={style["img1"]}>
            <img src="./assets/img.png" alt="data base"/>
          </div>
          <article className={style["article2"]}>
            <h1>Una base de datos viva, conectada al asistente</h1>
            <p>
            Modificá el inventario, ingresá productos o registrá ventas en tiempo real. Cada cambio que hagas se refleja de 
            inmediato en el conocimiento de IAzul, quien siempre tendrá información actualizada para responderte. Esto convierte 
            tu gestión en algo mucho más dinámico, simple e intuitivo.
            </p>
          </article>
          <div className={style["img2"]}>
            <img src="./assets/img.png" alt="data base"/>
          </div>
        </section>
        <section className={style["section3"]}>
          <article className={style["article3"]}>
            <h1>IA en tu empresa: eficiencia, velocidad y visión de futuro</h1>
            <p>¡Descubre el potencial ilimitado de la IA con IAzul, transformando cómo operamos y accedemos a la información!</p>
              <div className={style["tarjetas"]}>
                <div className={style["tarjeta"]}>
                  <h4>¿Y si pudiera hacer mucho más?</h4>
                  <p>Aun con todo lo que ya puede hacer, IAzul tiene muchísimo potencial sin explotar.</p>
                </div>
                <div className={style["tarjeta"]}>
                  <h4>Imagina las posibilidades</h4>
                  <p>Desde un simple portfolio personal hasta un sistema de inventario de múltiples depósitos.</p>
                </div>
                <div className={style["tarjeta"]}>
                  <h4>Disponible TOTAL</h4>
                  <p>Sin esperas. Sin barreras. Consultá lo que necesites, cuando lo necesites, y en el idioma que prefieras.</p>
              </div>
            </div>
          </article>
        </section>
      </main>
      <div className={style["chat-table"]}>
          {login && <Auth setModal={setLogin} tipoLogin={tipoLogin} setTipoLogin={setTipoLogin} setAlerta={setAlerta} setAlertaText={setAlertaText}/>}
          <Chatbot/>
          <Tablas setAlerta={setAlerta} setAlertaText={setAlertaText} setTipoLogin={setTipoLogin} setLogin={setLogin}/>
      </div>
      <div style={{height: "0px"}} id="chatbot"/>
    </div>
  )
}
