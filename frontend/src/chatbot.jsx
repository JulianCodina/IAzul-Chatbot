import { useEffect, useState } from "react";
import style from './chatbot.module.css'
import supabase from '../utils/supabase'

export default function Chatbot() {
    const [consulta, setConsulta] = useState("")
    const [historial, setHistorial] = useState({});
    const [espera, setEspera] = useState(false);
    const [narrador, setNarrador] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [recognition, setRecognition] = useState(null);
    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [speaking, setSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [respuestaIA, setRespuestaIA] = useState("");
    const [suggestions] = useState([
        "¿Tienen stock del iphone 14 pro?",
        "¿Cuánto cuesta la tableta grafica?",
        "¿Cuáles fueron las últimas compras?",
        "¿Cuál es el horario de atención?",
        "¿Tienen servicio técnico?",
        "¿Aceptan tarjetas de crédito?",
        "¿Hacen envíos a domicilio?",
        "¿Tienen garantía los productos?",
        "¿Cuál es el precio de la RTX 3080?",
        "¿Cuánto cuesta un lavavajillas?",
        "¿Tienen algo de Logitech?",
    ]);
    const [randomSuggestions, setRandomSuggestions] = useState([]);
    const [info, setInfo] = useState(false);
    const [menu, setMenu] = useState(false);

    const [user, setUser] = useState(3);

    function Info(){
        return(
            <div className={style["info-container"]}>
                <div className={style["title"]}>
                    <p>IAzul esta en fase de pruebas.</p>
                    <div className={style["close"]} onClick={() => setInfo(false)}>
                        <img src="assets/x.png"/>
                    </div>
                </div>
                <p>
                    Aunque me esfuerzo para que sea precisa, puede cometer errores. La información proporcionada debe ser verificada y no debe tomarse como consejo definitivo.
                </p>
            </div>
        )
    }
    function SinMsj(){
        return(
            <div className={style["sin-msj"]}>
                <img src="assets/chat.png" alt="chats" className={style["chatbot"]}/>
                <div className={style["welcome-title"]}>
                    <h4>Bienvenido, soy</h4><h4 className={style["iazul"]}>IAzul</h4>
                </div>
                <p>¡Escríbeme tu primera pregunta!</p>
                <p>Estoy listo para ayudarte.</p>
                <br />
                <p> Aquí algunas ideas para empezar:</p>
                <div className={style["suggestions"]}>
                    <p onClick={() => handleSubmit("¿Quién te creó y para qué?")}>
                        ¿Quién te creó y para qué?
                    </p>
                    {randomSuggestions.map((suggestion, index) => (
                        <p key={index} onClick={() => handleSubmit(suggestion)}>
                            {suggestion}
                        </p>
                    ))}
                </div>
            </div>
        )
    }
    function Mensajes() {
        const inicio = new Date(2000, 1, 1, 1, 1); 
        
        if (Object.keys(historial).length === 0) {
            return <SinMsj/>;
        }
        
        return (
            <>
                {Object.entries(historial).map(([key, msg], index, arr) => {
                    const prevDate = index > 0 ? arr[index - 1][1].fecha : inicio;
                    const currentDate = msg.fecha;
    
                    // Validamos que `currentDate` sea un objeto de fecha antes de usar `getDate()`
                    const isNextDay = prevDate instanceof Date &&
                                      currentDate instanceof Date &&
                                      currentDate.getDate() !== prevDate.getDate();
    
                    return (
                        <div key={`message-${key}`}>
                            {isNextDay && (
                                <div className={style["fecha"]} key={`fecha-${key}`}>
                                    <hr />
                                    <p>{currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                </div>
                            )}
                            <div className={style["consulta"]}>
                                <div className={style["msg"]}>
                                    {msg.consulta}
                                </div>
                                <p>{msg.fecha?.toTimeString().slice(0, 5)}</p>
                            </div>
                            {msg.respuesta && (!espera || Object.keys(historial).pop() !== key) && (
                                <div className={style["respuesta"]}>
                                    <div className={style["p"]}>
                                        {msg.respuesta.split('\n').map((line, index) => (
                                            <p key={index}>{line}</p> // Cada línea en un <p> separado
                                        ))}
                                    </div>
                                    <CopyButton texto={msg.respuesta} />
                                </div>
                            )}
                            {msg.respuesta && espera && Object.keys(historial).pop() === key && (
                                <div className={style["pensando"]}>
                                    <p>{msg.respuesta}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </>
        );
    }

    function handleChange(e){
        setConsulta(e.target.value);
    }
    function handleSubmit(consultaDirecta = null) {
        const consultaAEnviar = consultaDirecta || consulta;
        if (consultaAEnviar.trim().length === 0) return;
        if (espera) return;

        const now = new Date();
        const count = Object.keys(historial).length + 1;

        setHistorial(prevHistorial => ({
            ...prevHistorial,
            [count]: {
                "consulta": consultaAEnviar,
                "respuesta": "Estoy pensando...",
                "fecha": now
            }
        }));
        
        setConsulta("");
        setEspera(true);
    }
    function handleVoice() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!isListening) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.lang = 'es-ES';
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;

            recognitionInstance.onresult = (event) => {
                const lastResult = event.results[event.results.length - 1];
                const transcript = lastResult[0].transcript;
                setTranscript(transcript);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Error en el reconocimiento:', event.error);
            };

            recognitionInstance.start();
            setRecognition(recognitionInstance);
            setIsListening(true);
        } else {
            if (recognition) {
                recognition.stop();
                setRecognition(null);
            }
            setIsListening(false);
            setConsulta(transcript);
            setTranscript("");
        }
    }
    function speakText(text) {
        if (!speechSynthesis || !selectedVoice) {
            console.error('No hay síntesis de voz o voz seleccionada disponible');
            return;
        }
        
        try {
            // Detener cualquier habla en curso
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.voice = selectedVoice;
            
            utterance.onstart = () => {
                setSpeaking(true);
            };
            
            utterance.onend = () => {
                setSpeaking(false);
            };

            utterance.onerror = (event) => {
                console.error('Error en la narración:', event);
                setSpeaking(false);
            };
            
            speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error al intentar narrar:', error);
            setSpeaking(false);
        }
    }
    function CopyButton({texto}){
        const [copy, setCopy] = useState(false)

        function handleCopy(){
            navigator.clipboard.writeText(texto).then(() => {
              setCopy(true)
              setTimeout(() => setCopy(false), 3000);
            }).catch(err => {
              console.error("Error al copiar el texto: ", err);
            });
          }

        return(
            <div className={style["img"]} onClick={handleCopy}>
                {!copy ? (
                    <img src="assets/copy.png"/>
                ):(
                    <img src="assets/done.png"/>
                )}
            </div>
        )
    }
    function scrollToBottom() {
        const container = document.querySelector(`.${style["msg-container"]}`);
        if (container) {
            container.scrollTop = container.scrollHeight; 
        }
    }
    async function reset(){
        setHistorial({});
        setMenu(false);
        const { data: datos, error } = await supabase.from('consultas_chatbot').delete().eq('id_user', user)
        if (error) {
            console.error('Error al eliminar los datos:', error);
        }
    }
    
    useEffect(() => {
        scrollToBottom()
    }, [historial]) // DISLIZADOR

    useEffect(() =>{
        if (!espera) return;

        const obtenerRespuesta = async () => {

            const lastKey = Object.keys(historial).pop();
            const consulta = historial[lastKey].consulta;

            try {
                console.log('Intentando conectar a:', import.meta.env.VITE_API_URL);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/responder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ consulta: consulta })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setHistorial(prevHistorial => {
                    const lastKey = Object.keys(prevHistorial).pop();
                    return {
                        ...prevHistorial,
                        [lastKey]: {
                            ...prevHistorial[lastKey],
                            "respuesta": data.mensaje
                        }
                    };
                });
                setEspera(false);
                setRespuestaIA(data.mensaje);
                
                // Insertar en la base de datos después de que tengamos la respuesta
                const { error } = await supabase.from('consultas_chatbot').insert({
                    id_user: user,
                    consulta: consulta,
                    respuesta: data.mensaje,
                    fecha: new Date().toISOString()
                });
                
                if (error) {
                    console.error("Error al insertar en la base de datos:", error);
                }
            } catch (error) {
                console.error("Error detallado al llamar a la API:", error);
                console.error("URL de la API:", import.meta.env.VITE_API_URL);
                setHistorial(prevHistorial => {
                    const lastKey = Object.keys(prevHistorial).pop();
                    return {
                        ...prevHistorial,
                        [lastKey]: {
                            ...prevHistorial[lastKey],
                            "respuesta": "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta de nuevo más tarde."
                        }
                    };
                });
            } finally {
                setEspera(false);
            }
        };
        obtenerRespuesta();
    }, [espera, narrador, selectedVoice, speechSynthesis]); // ENVIA CONSULTA A API

    useEffect(() => {
        if (narrador && selectedVoice && speechSynthesis) {
            speakText(respuestaIA);
        }
    }, [respuestaIA]) // NARRADOR

    useEffect(() => {
        if (typeof window !== 'undefined') {    // NARRADOR
            try {
                const synthesis = window.speechSynthesis;
                if (synthesis) {
                    setSpeechSynthesis(synthesis);
                    
                    // Función para obtener las voces disponibles
                    const getVoices = () => {
                        try {
                            const availableVoices = synthesis.getVoices();
                            if (availableVoices) {
                                const spanishVoices = availableVoices.filter(voice => voice.lang.startsWith('es'));
                                setVoices(spanishVoices);
                                
                                // Buscar la voz de Sabina
                                const sabinaVoice = spanishVoices.find(voice => 
                                    voice.name.includes('Sabina')
                                );
                                
                                if (sabinaVoice) {
                                    setSelectedVoice(sabinaVoice);
                                } else if (spanishVoices.length > 0) {
                                    setSelectedVoice(spanishVoices[0]);
                                }
                            }
                        } catch (error) {
                            console.error('Error al obtener voces:', error);
                        }
                    };

                    // Las voces pueden tardar en cargarse
                    if (synthesis.getVoices().length > 0) {
                        getVoices();
                    } else {
                        synthesis.onvoiceschanged = getVoices;
                    }
                    
                    synthesis.onend = () => {
                        setSpeaking(false);
                    };

                    synthesis.onerror = (event) => {
                        console.error('Error en la síntesis de voz:', event);
                        setSpeaking(false);
                    };
                }
            } catch (error) {
                console.error('Error al inicializar síntesis de voz:', error);
            }
        }
    }, []); // NARRADOR

    useEffect(() => {
        async function getHistorial() {
            const { data: datos, error } = await supabase
                .from('consultas_chatbot')
                .select()
                .eq('id_user', user)
                .order('id', { ascending: true })
            
            if (error) {
                console.error('Error al obtener datos:', error.message)
                return
            }
            if (datos) {
                const historialFormateado = datos.reduce((acc, dato) => {
                    acc[dato.id] = {
                        consulta: dato.consulta,
                        respuesta: dato.respuesta,
                        fecha: new Date(dato.fecha)
                    };
                    return acc;
                }, {});
                setHistorial(historialFormateado);
            }
        }
        getHistorial()
    }, []) // SUPABASE

    useEffect(() => {
        const availableIndexes = Array.from({length: suggestions.length}, (_, i) => i);
        const randomIndexes = [];
        for (let i = 0; i < 3; i++) {
            const randomPosition = Math.floor(Math.random() * availableIndexes.length);
            randomIndexes.push(availableIndexes.splice(randomPosition, 1)[0]);
        }
        const selectedSuggestions = randomIndexes.map(index => suggestions[index]);
        setRandomSuggestions(selectedSuggestions);
    }, []); // SUGERENCIAS
    

    return (
        <div className={style["main-container"]}>
            {(info || menu) && (
                <>
                    {info && <Info/>}
                    <div className={style["dark"]} onClick={() => {
                        setMenu(false);
                        setInfo(false);
                    }}/>
                </>
            )}
            <div className={style["header"]}>
                <img className={style["avatar"]} src="assets/chatbot.png"/>
                <div className={style["titulo"]}>
                    <h3>IAzul •</h3>
                    <p>Tu asistente chatbot</p>
                </div>
                {menu && (
                    <div className={style["options"]}>
                            {narrador ? (
                                <div className={style["par"]} onClick={() => setNarrador(false)}>
                                    <img className={style["on"]} src="assets/on.png" />
                                    <p>Narrador activo</p>
                                </div>
                            ):(
                                <div className={style["par"]} onClick={() => setNarrador(true)}>
                                    <img className={style["off"]} src="assets/off.png"/>
                                    <p>Narrador desactivado</p>
                                </div>
                            )}
                            <div className={style["par"]} onClick={() => {
                                setMenu(false);
                                setInfo(true)
                            }}>
                                <img src="assets/info.png"/>
                                <p>Información</p>
                            </div>
                            <div className={style["par"]} onClick={() => reset()}>
                                <img src="assets/reset.png"/>
                                <p>Reiniciar historial</p>
                            </div>
                    </div>
                )}
                <div className={style["menu"]} onClick={() => setMenu(!menu)}>
                    <img src="assets/menu.png"/>
                </div>
            </div>
            <div className={style["msg-container"]}>
                <Mensajes/>
            </div>
            <div className={style["input-container"]}>
                {isListening ? (
                    <textarea className={style["escuchando"]} value="Escuchando..." />
                ):(
                    <textarea 
                        className={style["textarea"]}
                        value={consulta} 
                        placeholder="Escribe tu pregunta" 
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isListening) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                )}
                <div className={style["img"]}>
                    {consulta ? (
                        <img className={style["button"]} src="assets/submit.png" onClick={() => handleSubmit(consulta)}/>
                    ):(
                        <img className={style["button"]} src="assets/mic.png" onClick={handleVoice}/>
                    )}
                </div>
            </div>
        </div>
    )
}