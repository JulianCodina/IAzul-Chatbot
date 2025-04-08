import { useEffect, useState } from "react";
import style from './chatbot.module.css'
import { supabase } from '../utils/supabase'
import { useAuthContext } from './AuthContext';

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
        "¿Cual es el producto mas vendido?",
        "¿Tienen stock del iphone 14?",
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

    const { user } = useAuthContext();
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);

    // COMPONENTES
    function Info(){
        return(
            <div className={style["info-container"]} style={{ animation: info ? 'infoSlide 0.2s ease-out' : 'none' }}>
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
        
        // Convertir el historial a un array y ordenarlo por fecha
        const historialOrdenado = Object.entries(historial)
            .sort(([, a], [, b]) => a.fecha - b.fecha);
        
        return (
            <>
                {historialOrdenado.map(([key, msg], index, arr) => {
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
                            {msg.respuesta === "Estoy pensando..." ? (
                                <div className={style["pensando"]}>
                                    <p>{msg.respuesta}</p>
                                </div>
                            ) : msg.respuesta && (
                                <div className={style["respuesta"]}>
                                    <div className={style["p"]}>
                                        {msg.respuesta.split('\n').map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))}
                                    </div>
                                    <CopyButton texto={msg.respuesta} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </>
        );
    }
    function Loading(){
        return(
            <div className={style["dot-spinner"]}>
                <div className={style["dot-spinner__dot"]}></div>
                <div className={style["dot-spinner__dot"]}></div>
                <div className={style["dot-spinner__dot"]}></div>
                <div className={style["dot-spinner__dot"]}></div>
                <div className={style["dot-spinner__dot"]}></div>
                <div className={style["dot-spinner__dot"]}></div>
                <div className={style["dot-spinner__dot"]}></div>
                <div className={style["dot-spinner__dot"]}></div>
            </div>
        )
    }

    // FUNCIONES
    function handleChange(e){
        setConsulta(e.target.value);
    }
    function handleSubmit(consultaDirecta = null) {
        const pregunta = consultaDirecta || consulta;
        if (pregunta.trim().length === 0) return;
        if (espera) return;
        let consultaAEnviar = pregunta;
        
        // Verificar si hay historial y obtener el último mensaje de forma segura
        const keys = Object.keys(historial);
        if (keys.length > 0) {
            const ultimoMensaje = historial[keys[keys.length - 1]];
            if (ultimoMensaje && ultimoMensaje.consulta && ultimoMensaje.respuesta) {
                consultaAEnviar = "consulta anterior: " + ultimoMensaje.consulta + " respuesta: " + ultimoMensaje.respuesta + " nueva consulta:  " + pregunta;
            }
        }

        const now = new Date();
        const count = Object.keys(historial).length + 1;

        // Guardamos la consulta actual en una variable
        const consultaActual = {
            "consulta": pregunta,
            "respuesta": "Estoy pensando...",
            "fecha": now
        };

        setHistorial(prevHistorial => ({
            ...prevHistorial,
            [count]: consultaActual
        }));
        
        setConsulta("");
        setEspera(true);

        // Enviamos la consulta inmediatamente
        enviarConsulta(pregunta, consultaAEnviar, count);
    }
    async function enviarConsulta(pregunta, consultaAEnviar, key) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/responder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ consulta: consultaAEnviar })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Actualizamos el historial
            setHistorial(prevHistorial => ({
                ...prevHistorial,
                [key]: {
                    ...prevHistorial[key],
                    "respuesta": data.mensaje
                }
            }));
            
            setRespuestaIA(data.mensaje);
            
            if (userID !== null) {
                const { error } = await supabase.from('consultas_chatbot').insert({
                    id_user: userID,
                    consulta: pregunta,
                    respuesta: data.mensaje,
                    fecha: new Date().toISOString()
                });
            }
            if (userID === null) {
                const { error } = await supabase.from('consultas_chatbot').insert({
                    id_user: null,
                    consulta: pregunta,
                    respuesta: data.mensaje,
                    fecha: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error("Error detallado al llamar a la API:", error);
            console.error("URL de la API:", import.meta.env.VITE_API_URL);
            setHistorial(prevHistorial => ({
                ...prevHistorial,
                [key]: {
                    ...prevHistorial[key],
                    "respuesta": "Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta de nuevo más tarde."
                }
            }));
        } finally {
            setEspera(false);
        }
    }
    function handleVoice() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!isListening) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.lang = 'es-ES';
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;

            let finalTranscript = '';

            recognitionInstance.onresult = (event) => {
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Función para normalizar el texto
                const normalizeText = (text) => {
                    // Convertir todo a minúsculas
                    text = text.toLowerCase();
                    // Capitalizar la primera letra de cada oración
                    text = text.replace(/(^\w|\.\s+\w|!\s+\w|\?\s+\w)/gm, letter => letter.toUpperCase());
                    return text;
                };

                if (finalTranscript) {
                    setTranscript(normalizeText(finalTranscript.trim()));
                }
                if (interimTranscript) {
                    setTranscript(normalizeText(interimTranscript));
                }
            };

            recognitionInstance.onerror = (event) => {
                console.error('Error en el reconocimiento:', event.error);
            };

            recognitionInstance.onend = () => {
                if (isListening) {
                    recognitionInstance.start();
                }
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
        if (userID !== null) {
            const { data: datos, error } = await supabase.from('consultas_chatbot').delete().eq('id_user', userID)
            if (error) {
                console.error('Error al eliminar los datos:', error);
            }
        }
    }
    
    useEffect(() => {
        scrollToBottom()
    }, [historial]) // DISLIZADOR

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
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        if (userID == null) {
            setHistorial({});
        }else{
            async function getHistorial() {
                const { data: datos, error } = await supabase
                    .from('consultas_chatbot')
                    .select()
                    .eq('id_user', userID)
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
        }
    }, [userID]) // SUPABASE

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

    useEffect(() => {
        if (user !== null) {
            setUserID(user.id);
        }else{
            setUserID(null);
        }
    }, [user]); // SETEAR ID

    return (
        <div className={style["main-container"]}>
            {info && (
                <>
                    <Info/>
                    <div className={style["dark"]} onClick={() => setInfo(false)}/>
                </>
            )}
            {menu && (
                <>
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
                    <div className={style["dark"]} onClick={() => setMenu(false)}/>
                </>
            )}
            <div className={style["header"]} id="chatbot">
                <img className={style["avatar"]} src="assets/chatbot.png"/>
                <div className={style["titulo"]}>
                    <h3>IAzul •</h3>
                    <p>Tu asistente chatbot</p>
                </div>
                <div className={style["menu"]} onClick={() => setMenu(!menu)}>
                    <img src="assets/menu.png"/>
                </div>
            </div>
            <div className={style["msg-container"]}>
                {loading ? <Loading/> : <Mensajes/>}
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
                        id="consulta-input"
                        name="consulta"
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