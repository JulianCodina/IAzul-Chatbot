import { useEffect, useState } from "react";
import style from './tablas.module.css'

export default function Tablas() {
    const [gestor, setGestor] = useState(true);

    function Preview({title, description, onClick}){
        return(
            <div className={style["preview"]} onClick={onClick}>
                <div className={style["detalles"]}>
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <button className={style["button"]}>Ver tabla</button>
            </div>
        )
    }

    function Tabla(){
        return(
            <div className={style["tabla"]}>
                <div className={style["header"]}>
                    <h3>Tabla Productos</h3>
                </div>
                <div className={style["body"]}>
                    <div className={style["columnas"]}>
                        <div className={style["columna"]}>Nombre</div>
                        <div className={style["columna"]}>Marca</div>
                        <div className={style["columna"]}>Precio</div>
                        <div className={style["columna"]}>Stock</div>
                        <div className={style["columna"]}>Fecha</div>
                    </div>
                    <div className={style["row"]}>
                        <div className={style["cell"]}>Celular</div>
                        <div className={style["cell"]}>Iphone</div>
                        <div className={style["cell"]}>350</div>
                        <div className={style["cell"]}>10</div>
                        <div className={style["cell"]}>2024-01-01</div>
                    </div>
                    <div className={style["row"]}>
                        <div className={style["cell"]}>Tablet</div>
                        <div className={style["cell"]}>Samsung</div>
                        <div className={style["cell"]}>200</div>
                        <div className={style["cell"]}>5</div>
                        <div className={style["cell"]}>2024-01-02</div>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className={style["main-container"]}>
            {gestor && (
                <div className={style["gestor"]}>
                    <div className={style["header"]}>
                        <h3>Gestor de Tablas</h3>
                    </div>
                    <div className={style["previews"]}>
                        <div className={style["par"]}>
                            <Preview title="Productos" description="Todos los productos que vendemos" onClick={() => setGestor(false)}/>
                            <Preview title="Inventario" description="Cantidad de stock de cada producto" onClick={() => setGestor(false)}/>
                        </div>
                        <div className={style["par"]}>
                            <Preview title="Ventas" description="Todas las ventas realizadas" onClick={() => setGestor(false)}/>
                            <Preview title="Compras" description="Todas las compras realizadas" onClick={() => setGestor(false)}/>
                        </div>
                    </div>
                </div>
            )}
            <Tabla/>
        </div>
    )
}