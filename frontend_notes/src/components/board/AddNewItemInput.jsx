import React, {useRef, useEffect, useContext, useState} from 'react'
import { Link } from 'react-router-dom'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
import { en_language, ru_language } from '../../services/language'
import AuthContext from '../context/AuthContext'

const AddNewItemInput = ({ index, setNewItems, board,  newItems, setInputValue, addNewItem, deleteItem, addItem }) => {
    const contentRefsInput = useRef(null) 
    let {language, authTokens, setFavoritePages, history, setListPages} = useContext(AuthContext)
    const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addNewItem(board);
            document.getElementById("input_add").value = "";
            document.getElementById("input_add").focus()
        }
        if (event.key === 'Escape'){
            setNewItems([]);
        }
    }
    useEffect(() => {
        if (newItems[index]) {
            contentRefsInput.current.focus();
        }
        setLang(language === "Русский" ? ru_language : en_language);
    }, [newItems, index, language]);
    
  return (
    <>
        {newItems[index] && (
            <>
                <div className='item_3 text'>
                    <input autoComplete="off" id="input_add" onKeyDown={handleKeyPress} ref={contentRefsInput} onChange={(e) => {setInputValue(e.target.value)}} type="text" className='input' placeholder={lang.input_header}></input>
                </div>
                <div className='add_item_div_'>
                    <Link onClick={(e) => addNewItem(board)} className='add_item_link'>{lang.add_item}</Link>
                    <div onClick={() => deleteItem()} className='icon_close_div_modal_add_new_board'>
                        <AiOutlineClose  className='icon_close'></AiOutlineClose>
                    </div>
                </div>
            </>
        )}
    </>
    
  )
}

export default AddNewItemInput