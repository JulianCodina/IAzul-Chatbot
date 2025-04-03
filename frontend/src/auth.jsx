import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import style from "./auth.module.css";
import { useAuthContext } from "./AuthContext";

function Auth({setModal, tipoLogin, setTipoLogin, setAlerta, setAlertaText}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuthContext();

  // Función para registrar un usuario
  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setAlertaText("Revisa tu correo para confirmar tu cuenta.");
    setAlerta(2);
    setModal(false);
  };

  // Función para iniciar sesión
  const handleSignIn = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setUser(data.user);
      setAlertaText("Inicio exitoso. Bienvenido!");
      setLoading(false);
  };
  
  useEffect(() => {
    if (user) {
      setAlerta(1);
      setModal(false);
    }
  }, [user]);

  return (
    <>
      <div className={style.authContainer}>
        {tipoLogin === "signin" ? (
          <h2>Iniciar Sesión</h2>
        ) : (
          <h2>Registrarse</h2>
        )}
        <img src="./assets/x.png" alt="close" className={style.close} onClick={() => setModal(false)}/>
        <form>
          <div className={style.txt_field}>
            <img src="./assets/email.png" alt="mail" />
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />
          </div>
          <div className={style.txt_field}>
            <img src="./assets/password.png" alt="lock" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={style.error}>
            {error && <p>{error.charAt(0).toUpperCase() + error.slice(1)}</p>}
          </div>
          {tipoLogin === "signin" ? (
            <>
              <div className={style.btn} onClick={handleSignIn}>
                <p>Iniciar Sesión</p>
            </div>
            <div className={style.signup_link}>
              No tienes una cuenta? <a href="#" onClick={() => setTipoLogin("signup")}>Registrarse</a>
            </div>
          </>
          ) : (
          <>
            <div className={style.btn} onClick={handleSignUp}>
              <p>Registrarse</p>
            </div>
            <div className={style.signup_link}>
                Ya tienes una cuenta? <a href="#" onClick={() => setTipoLogin("signin")}>Iniciar Sesión</a>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default Auth;
