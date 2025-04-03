import { useEffect, useState, useCallback, useMemo } from "react";
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
    const [formData, setFormData] = useState({
        valor1: "",
        valor2: "",
        valor3: "",
        valor4: "",
        valor5: ""
    });
    const [productosIds, setProductosIds] = useState([]);

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

    const getPlaceholders = () => {
        switch(tabla) {
            case 'productos':
                return {
                    valor1: "Nombre del producto",
                    valor2: "Categoría",
                    valor3: "Marca",
                    valor4: "Precio",
                    valor5: "Stock inicial"
                };
            case 'compras':
                return {
                    valor1: "ID del producto",
                    valor2: "Proveedor",
                    valor3: "Cantidad",
                    valor4: "Costo unitario"
                };
            case 'ventas':
                return {
                    valor1: "ID del producto",
                    valor2: "Cliente",
                    valor3: "Cantidad",
                    valor4: "Total"
                };
            default:
                return {
                    valor1: "Valor 1",
                    valor2: "Valor 2",
                    valor3: "Valor 3",
                    valor4: "Valor 4"
                };
        }
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);

    const handleSubmit = useCallback(() => {
        addNewItem(formData.valor1, formData.valor2, formData.valor3, formData.valor4, formData.valor5);
        setFormData({valor1: "", valor2: "", valor3: "", valor4: "", valor5: ""});
    }, [formData]);

    const NewItemForm = useMemo(() => {
        const placeholders = getPlaceholders();
        
        return (
            <div className={`${style["new-item-form"]} ${newItem ? style.show : style.hide}`}>
                Añadir item a {tabla.charAt(0).toUpperCase() + tabla.slice(1)}
                <p className={style["close"]} onClick={() => setNewItem(false)}>×</p>
                <input 
                    type="text" 
                    name="valor1"
                    placeholder={placeholders.valor1} 
                    value={formData.valor1.toLowerCase()} 
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    name="valor2"
                    placeholder={placeholders.valor2} 
                    value={formData.valor2.toLowerCase()} 
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    name="valor3"
                    placeholder={placeholders.valor3} 
                    value={formData.valor3.toLowerCase()} 
                    onChange={handleChange}
                />
                <input 
                    type="text" 
                    name="valor4"
                    placeholder={placeholders.valor4} 
                    value={formData.valor4.toLowerCase()} 
                    onChange={handleChange}
                />
                {tabla === 'productos' && (
                    <input 
                        type="text" 
                        name="valor5"
                        placeholder={placeholders.valor5} 
                        value={formData.valor5} 
                        onChange={handleChange}
                    />
                )}
                <button 
                    className={style["button"]} 
                    onClick={handleSubmit}
                >
                    Añadir
                </button>
            </div>
        );
    }, [formData, newItem, tabla, handleChange, handleSubmit]);

    const addNewItem = async (valor1, valor2, valor3, valor4, valor5) => {
        if (!valor1 || !valor2 || !valor3 || !valor4 || (tabla === 'productos' && !valor5)) {
            setAlertaText("Por favor, completa todos los campos.");
            setAlerta(3);
            return;
        }

        if ((tabla === 'compras' || tabla === 'ventas') && !productosIds.includes(parseInt(valor1))) {
            setAlertaText("El ID del producto no existe. Por favor, verifica e intenta nuevamente.");
            setAlerta(3);
            return;
        }

        if (tabla === 'productos' && (isNaN(parseInt(valor4)) || isNaN(parseInt(valor5)))) {
            setAlertaText("El precio y el stock inicial deben ser números válidos.");
            setAlerta(3);
            return;
        }

        if ((tabla === 'compras' || tabla === 'ventas') && (isNaN(parseInt(valor3)) || isNaN(parseInt(valor4)))) {
            setAlertaText("La cantidad y el valor total deben ser números válidos.");
            setAlerta(3);
            return;
        }

        try {
            let data;
            let error;

            switch(tabla) {
                case 'productos':
                    ({ data, error } = await supabase.rpc('insertar_producto_inventario', {
                        p_nombre: valor1,
                        p_categoria: valor2,
                        p_marca: valor3,
                        p_precio: parseInt(valor4),
                        p_stock_inicial: parseInt(valor5)
                    }));
                    break;
                case 'compras':
                    ({ data, error } = await supabase.rpc('agregar_compra', {
                        id_p: parseInt(valor1),
                        proveedor: valor2,
                        cantidad: parseInt(valor3),
                        costo_unit: parseInt(valor4)
                    }));
                    break;
                case 'ventas':
                    ({ data, error } = await supabase.rpc('agregar_venta', {
                        id_p: parseInt(valor1),
                        cliente: valor2,
                        cantidad: parseInt(valor3),
                        total: parseInt(valor4)
                    }));
                    break;
                default:
                    throw new Error("Tabla no válida");
            }

            if (error) throw error;

            setAlertaText("Item agregado correctamente.");
            setAlerta(1);
            setNewItem(false);
            
            // Actualizar la tabla correspondiente
            const { data: updatedData, error: fetchError } = await supabase
                .from(tabla)
                .select()
                .order('id', { ascending: true });

            if (fetchError) throw fetchError;

            setTablas(prevTablas => ({
                ...prevTablas,
                [tabla]: updatedData
            }));

        } catch (error) {
            console.error("Error al agregar item:", error);
            setAlertaText("Error al agregar el item. Por favor, verifica los datos e intenta nuevamente.");
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
        if (tablas.productos && tablas.productos.length > 0) {
            const ids = tablas.productos.map(producto => producto.id);
            setProductosIds(ids);
        }
    }, [tablas.productos]);

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
                                    <th key={key}>{key.replace(/_/g, ' ')}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tablas[tabla] && tablas[tabla].map((row, rowIndex) => (
                                <tr key={row.id} className={rowIndex % 2 === 0 ? style.par : style.impar}>
                                    {Object.entries(row).map(([key, value], cellIndex) => (
                                        <td key={`${row.id}-${key}-${cellIndex}`}>
                                            {typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) ? value.replace('T', ' ').slice(0, -3) : value}
                                        </td>
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
            {NewItemForm}
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