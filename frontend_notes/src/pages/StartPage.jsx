import React, { useEffect, useState, useContext} from 'react'
import "../styles/StartPage.sass"
import AuthContext from '../components/context/AuthContext'
import { ru_language, en_language } from '../services/language';
const StartPage = () => {
    const {history, language } = useContext(AuthContext)
    const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);

    useEffect(() => {
        setLang(language === "Русский" ? ru_language : en_language);
    }, [language]);
    return (
        <div >
            <div className="trello-home">
                <center className='span-container'>
                    {lang.text_span_start_page}
                </center>
                {/* <center className='text-notesmaker'>
                    Notesmaker - это визуальный инструмент для командной работы на любом проекте. Подходит, как стратапам, так и гигантам.
                </center> */}
                <div className='center'>
                    <button onClick={() => history("/login")} className='btn-next'>
                        {lang.btn_start_page}
                    </button>
                </div>
            </div>  
        </div>
    
    
    )
}

export default StartPage