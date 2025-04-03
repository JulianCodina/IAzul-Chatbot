import { useEffect, useState } from "react";
import style from './tablas.module.css'
import { supabase } from '../utils/supabase'

export default function Tablas() {
    const [gestor, setGestor] = useState(true);
    const [isHiding, setIsHiding] = useState(false);
    const [tablas, setTablas] = useState([{
        productos: [
            {id: 1, nombre: 'samsung galaxy s23', categoria: 'celulares', marca: 'samsung', precio: 900},
            {id: 2, nombre: 'samsung galaxy a15', categoria: 'celulares', marca: 'samsung', precio: 200},
            {id: 3, nombre: 'iphone 14 pro', categoria: 'celulares', marca: 'apple', precio: 1000},
            {id: 4, nombre: 'iphone 12', categoria: 'celulares', marca: 'apple', precio: 800},
            {id: 5, nombre: 'iphone 10 pro', categoria: 'celulares', marca: 'apple', precio: 500},
            {id: 6, nombre: 'xiaomi poco x5', categoria: 'celulares', marca: 'xiaomi', precio: 280},
            {id: 7, nombre: 'xiaomi redmi 9', categoria: 'celulares', marca: 'xiaomi', precio: 200},
            {id: 8, nombre: 'google pixel 7a', categoria: 'celulares', marca: 'google', precio: 500},
            {id: 9, nombre: 'google pixel 7', categoria: 'celulares', marca: 'google', precio: 700},
            {id: 10, nombre: 'google pixel 6', categoria: 'celulares', marca: 'google', precio: 600},
            {id: 11, nombre: 'google pixel 5', categoria: 'celulares', marca: 'google', precio: 400},
            {id: 12, nombre: 'google pixel 4', categoria: 'celulares', marca: 'google', precio: 300},
        ]
    }]);
    const [tabla, setTabla] = useState("");

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

    useEffect(() => {
        async function getTablas(tabla) {
            const {data, error } = await supabase
                .from(tabla)
                .select()
                .order('id', { ascending: true })
            if (error) {
                console.error("Error al obtener las tablas:", error);
                return;
            }
            setTablas(prevTablas => ({
                ...prevTablas,
                [tabla]: data
            }));
        }
        getTablas('productos')
        getTablas('inventario')
        getTablas('ventas')
        getTablas('compras')
    }, [])

    useEffect(() => {
        if (gestor) {
            setIsHiding(false);
        }else{
            setIsHiding(true);
        }
      }, [gestor]);

    function Tabla(){
        return(
            <div className={style["tabla-container"]}>
                <div className={style["header"]}>
                    <div className={style["tabla-buttons"]}>
                        <h4 className={style["tabla-button"]} onClick={() => setGestor(true)}>← Atras</h4>
                        <h4 className={`${style["tabla-button"]} ${style.new}`}>Nuevo Item</h4>
                    </div>
                    <h3>Tabla {tabla.charAt(0).toUpperCase() + tabla.slice(1)}</h3>
                </div>
                <div className={style["tabla"]}>
                    <table>
                        <thead>
                            <tr>
                                {tablas[tabla] && tablas[tabla][0] && Object.keys(tablas[tabla][0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tablas[tabla] && tablas[tabla].map((row, rowIndex) => (
                                <tr key={row.id} className={rowIndex % 2 === 0 ? style.par : style.impar}>
                                    {Object.values(row).map((value) => (
                                        <td key={value}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={style["cards-container"]}>
                    {tablas[tabla] && tablas[tabla].map((row) => (
                        <div key={row.id} className={style["card"]}>
                            {Object.entries(row).map(([key, value]) => (
                                <div key={key} className={style["card-row"]}>
                                    <span className={style["card-label"]}>{key}</span>
                                    <span className={style["card-value"]}>{value}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    
    return (
        <div className={style["main-container"]}>
            <div className={`${style.gestor} ${!gestor ? style.hide : ''}`}>
                <div className={style["header"]}>
                    <h3>Gestor de Tablas</h3>
                </div>
                <div className={style["previews"]}>
                    <div className={style["par"]}>
                        <Preview title="Productos" description="Todos los productos que vendemos" onClick={() => {setGestor(false); setTabla('productos')}}/>
                        <Preview title="Inventario" description="Cantidad de stock de cada producto" onClick={() => {setGestor(false); setTabla('inventario')}}/>
                    </div>
                    <div className={style["par"]}>
                        <Preview title="Ventas" description="Todas las ventas realizadas" onClick={() => {setGestor(false); setTabla('ventas')}}/>
                        <Preview title="Compras" description="Todas las compras realizadas" onClick={() => {setGestor(false); setTabla('compras')}}/>
                    </div>
                </div>
            </div>
            <Tabla tabla="productos"/>
        </div>
    )
}