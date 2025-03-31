import { useEffect, useState } from "react";
import style from './App.module.css'
import Chatbot from './chatbot.jsx'
import Tablas from './tablas.jsx'
import Auth from './auth.jsx'

export default function App() {
  
  return (
    <div className={style["app"]}>
      <div className={style["chat-table"]}>
        <Auth />
        <Chatbot/>
        <Tablas/>
      </div>
    </div>
  )
}
