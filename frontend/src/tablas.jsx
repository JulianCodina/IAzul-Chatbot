import { useEffect, useState } from "react";
import style from './tablas.module.css'
import { supabase } from '../utils/supabase'
import { useAuthContext } from './AuthContext'

export default function Tablas({setAlerta, setAlertaText, setTipoLogin, setLogin}) {
    const {user} = useAuthContext();
    const [isAutenticado, setIsAutenticado] = useState(false);
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
        ]
    }]);
    const [tabla, setTabla] = useState("");
    const [newItem, setNewItem] = useState(false);

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
    function NewItemForm(){
        return(
            <>
                <div className={`${style["new-item-form"]} ${newItem ? style.show : style.hide}`}>
                    Añadir nuevo item
                    <p className={style["close"]} onClick={() => setNewItem(false)}>×</p>
                    <input type="text" placeholder="Nombre del item"/>
                    <input type="text" placeholder="Precio del item"/>
                    <input type="text" placeholder="Cantidad del item"/>
                    <input type="text" placeholder="Categoria del item"/>
                    <button className={style["button"]} onClick={() => addNewItem()}>Añadir</button>
                </div>
            </>
        )
    }

    const addNewItem = async (valor1, valor2, valor3, valor4) => {
        const funcion = tabla === 'compras' ? 'agregar_compra' : tabla === 'ventas' ? 'agregar_venta' : 'insertar_producto_inventario';
        try{
            const { data, error } = await supabase.rpc(funcion, {
                valor1,
                valor2,
                valor3,
                valor4
            });
            setAlertaText("Item agregado correctamente.");
            setAlerta(1);
        } catch (error) {
            setAlertaText("Error al agregar el item.");
            setAlerta(3);
        }
    };

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
    
      useEffect(() => {
        if (user !== null) {
            setIsAutenticado(true);
        }else{
            setIsAutenticado(false);
        }
    }, [user]); // SETEAR AUTENTICADO

    function Tabla(){
        return(
            <div className={style["tabla-container"]}>
                <div className={style["header"]}>
                    <div className={style["tabla-buttons"]}>
                        <h4 className={style["tabla-button"]} onClick={() => setGestor(true)}>← Atras</h4>
                        {tabla !== 'inventario' && (
                            <>
                                {isAutenticado ? (
                                    <h4 className={`${style["tabla-button"]} ${style.new}`} onClick={() => setNewItem(!newItem)}>Nuevo Item</h4>
                                ) : (
                                    <h4 className={`${style["tabla-button"]} ${style.new}`} onClick={() => {setTipoLogin("signin"); setLogin(true)}}>Nuevo Item</h4>
                                )}
                            </>
                        )}
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
                                    {Object.entries(row).map(([key, value], cellIndex) => (
                                        <td key={`${row.id}-${key}-${cellIndex}`}>{value}</td>
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
            <div className={`${style["dark"]} ${newItem ? style.show : style.hide}`} onClick={() => setNewItem(false)}/>
            <NewItemForm />
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