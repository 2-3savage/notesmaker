import React, { useRef, useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import {  AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
import { en_language, ru_language } from '../../services/language'
import AuthContext from '../context/AuthContext'
const AddNewBoard = ({ newBoard, setNewBoard, setInputBoardNameValue, addBoard }) => {
    const contentRefs = useRef(null)
    let {language, authTokens, setFavoritePages, history, setListPages} = useContext(AuthContext)
    const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);
    const handleContentClick = () => { 
        const input = contentRefs.current; 
        input?.focus();
    };
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            addBoard()
            
            document.getElementById("input").value = "";
        }
        if (event.key === 'Escape'){
            setNewBoard(false);
        }
    }
    
    useEffect(() => {
        handleContentClick()
        setLang(language === "Русский" ? ru_language : en_language);
    }, [newBoard, language])
  return (
    <>
        <div>
            {!newBoard && (<>
                <Link onClick={() => {setNewBoard(true)}} draggable={false} className="new_board">
                    <AiOutlinePlus className='icon_add_board'/>
                    <span  className='text'>{lang.add_table}</span>
                </Link>
            </>) }
            {newBoard && (
            
            <div className="new_board_div">
                <div className='item_3 text'>
                        <input ref={contentRefs} onKeyDown={handleKeyPress} onChange={(e) => {setInputBoardNameValue(e.target.value)}} type="text" id="input" className='input' placeholder={lang.input_header}></input>
                </div>
                <div className='add_item_div'>
                    <Link onClick={() => addBoard()} className='add_item_link'>{lang.add_header}</Link>
                    <div onClick={() => {setNewBoard(false); setInputBoardNameValue(null);}} className='icon_close_div_new_bard'>
                        <AiOutlineClose  className='icon_close'></AiOutlineClose>
                    </div>   
                </div>
            </div>
            )}
        </div>
        <div className='end'></div>
    </>
  )
}

export default AddNewBoard