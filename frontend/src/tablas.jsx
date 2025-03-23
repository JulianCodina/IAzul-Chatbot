import { useEffect, useState } from "react";
import style from './tablas.module.css'

export default function Tablas() {
    
    /*useEffect(() => {
        fetch("http://127.0.0.1:8000/consultar")
          .then((res) => res.json())
          .then((data) => setText(data.mensaje))
          .catch((err) => console.error(err));
      }, []);*/
    
    return (
        <div className={style["main-container"]}>
            <div className={style["header"]}>
                <h4>Tabla x</h4>
            </div>
            <div className={style["table"]}>
                
            </div>
        </div>
    )
}