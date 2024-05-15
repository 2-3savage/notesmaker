import React, {useRef, useEffect, useContext, useState} from 'react'
import { Link } from 'react-router-dom'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
import AuthContext from '../context/AuthContext';
import { en_language, ru_language } from '../../services/language';
const AddNewItemInBoard = ({ index, board,  newItems, setInputValue, addNewItem, deleteItem, addItem }) => {
  let {language, authTokens, setFavoritePages, history, setListPages} = useContext(AuthContext)
  const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);
  useEffect(() => {
    setLang(language === "Русский" ? ru_language : en_language);
  }, [newItems, language])
  return (
    <>
        
        {!newItems[index] && (<>
            <Link onClick={() => { addItem(index)} } draggable={false} className="new_item">
                <AiOutlinePlus className='icon_add'/>
                <span className='text'>{lang.add_item}</span>
            </Link>
        </>)}
    </>
  )
}

export default AddNewItemInBoard