import { useState } from "react";
import { supabase } from "../utils/supabase";
import style from "./auth.module.css";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para registrar un usuario
  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setError(error.message);
    else alert("Revisa tu correo para verificar la cuenta");
    setLoading(false);
  };

  // Función para iniciar sesión
  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else alert("Inicio de sesión exitoso");
    setLoading(false);
  };

  return (
    <>
      <div className={style.authContainer}>
        <h2>Iniciar Sesión</h2>
        <form>
          <div className={style.txt_field}>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={style.txt_field}>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={style.btn} onClick={handleSignIn}>
            <p>Iniciar Sesión</p>
          </div>
          <div className={style.signup_link}>
            No tienes una cuenta? <a href="#">Registrarse</a>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </>
  );
};

export default Auth;
