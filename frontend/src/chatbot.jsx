import { useEffect, useState } from "react";
import style from './chatbot.module.css'

const fecha1 = new Date(2025, 2, 19, 14, 30);
const fecha2 = new Date(2025, 2, 20, 14, 50);

export default function Chatbot() {
    const [consulta, setConsulta] = useState("")
    const [historial, setHistorial] = useState({
        "1": { "consulta": "Que onda maquina!", "respuesta": "Hola, soy IAzul", "fecha": fecha1 },
        "2": { "consulta": "Y que eres?!", "respuesta": "Soy un Asistente chatbot al que le puedes preguntar cualquier cosa", "fecha": fecha2 }
    });
    const [espera, setEspera] = useState(false);
    const [volume, setVolume] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [recognition, setRecognition] = useState(null);
    const [speechSynthesis, setSpeechSynthesis] = useState(null);
    const [speaking, setSpeaking] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    
    /*useEffect(() => {
        fetch("http://127.0.0.1:8000/consultar")
          .then((res) => res.json())
          .then((data) => setText(data.mensaje))
          .catch((err) => console.error(err));
      }, []);*/

    function Mensajes() {
        const inicio = new Date(2000, 1, 1, 1, 1); 
        
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
    function handleSubmit() {
        if (consulta.trim().length === 0) return;
        if (espera) return;

        const now = new Date();
        const count = Object.keys(historial).length + 1; // Genera un nuevo ID

        setHistorial(prevHistorial => ({
            ...prevHistorial,
            [count]: {
                "consulta": consulta,
                "respuesta": "Estoy pensando...", // Respuesta vacía inicialmente
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
        if (!speechSynthesis || !selectedVoice) return;
        
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
        
        speechSynthesis.speak(utterance);
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
    useEffect(() => {
        scrollToBottom()
    }, [historial])

    useEffect(() =>{
        if (!espera) return;

        setTimeout(() => {
            setHistorial(prevHistorial => {
                const lastKey = Object.keys(prevHistorial).pop(); // Obtiene el ID del último mensaje
                return {
                    ...prevHistorial,
                    [lastKey]: {
                        ...prevHistorial[lastKey], // Mantiene los datos anteriores
                        "respuesta": "Respuesta de IA\n \n asdasdasd" // Reemplaza la respuesta
                    }
                };
            });
            setEspera(false);
            volume && speakText("Hola soy IAzul, Respuesta de IA")
        }, 3000);
    }, [espera]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const synthesis = window.speechSynthesis;
            setSpeechSynthesis(synthesis);
            
            // Función para obtener las voces disponibles
            const getVoices = () => {
                const availableVoices = synthesis.getVoices();
                const spanishVoices = availableVoices.filter(voice => voice.lang.startsWith('es'));
                setVoices(spanishVoices);
                
                // Buscar la voz de Elena
                const elenaVoice = spanishVoices.find(voice => 
                    voice.name.includes('Elena') && voice.name.includes('Natural')
                );
                
                if (elenaVoice) {
                    setSelectedVoice(elenaVoice);
                } else if (spanishVoices.length > 0) {
                    setSelectedVoice(spanishVoices[0]);
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
        }
    }, []);

    return (
        <div className={style["main-container"]}>
            <div className={style["header"]}>
                <img className={style["img"]} src="assets/chatbot.png"/>
                <div className={style["titulo"]}>
                    <h3>IAzul •</h3>
                    <p>Tu asistente chatbot</p>
                </div>
                <div className={style["volume"]} onClick={() => setVolume(!volume)}>
                    {volume ? (
                        <img className={style["on"]} src="assets/on.png" />
                    ):(
                        <img className={style["off"]} src="assets/off.png"/>
                    )}
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
                    />
                )}
                <div className={style["img"]}>
                    {consulta ? (
                        <img className={style["button"]} src="assets/submit.png" onClick={handleSubmit}/>
                    ):(
                        <img className={style["button"]} src="assets/mic.png" onClick={handleVoice}/>
                    )}
                </div>
            </div>
        </div>
    )
}