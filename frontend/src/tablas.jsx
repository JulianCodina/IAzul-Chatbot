import { useEffect, useState } from "react";
import style from './tablas.module.css'

export default function Tablas() {

    function Preview({title, description}){
        return(
            <div className={style["preview"]}>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        )
    }
    
    return (
        <div className={style["main-container"]}>
            <div className={style["header"]}>
                <h3>Gestor de Tablas</h3>
            </div>
            <div className={style["previews"]}>
                <div className={style["par"]}>
                    <Preview title="Productos" description="Todos los productos que vendemos"/>
                    <Preview title="Inventario" description="Cantidad de stock de cada producto"/>
                </div>
                <div className={style["par"]}>
                    <Preview title="Ventas" description="Todas las ventas realizadas"/>
                    <Preview title="Compras" description="Todas las compras realizadas"/>
                </div>
            </div>
        </div>
    )
}