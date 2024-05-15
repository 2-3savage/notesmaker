import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'
import { en_language, ru_language } from '../../services/language'
import AuthContext from '../context/AuthContext'
const ChangePositionItem = ({itemRearrangement, setChangeMenuBoardPositionItem, changePositionItem, boards, board, newItemPositionBoard, item, index, i}) => {
    let {authTokens, setFavoritePages, language} = useContext(AuthContext)
    const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);
    useEffect(() => {
        setLang(language === "Русский" ? ru_language : en_language);
    }, [language]) 
  return (
    <div className='position_change_modal_dialog'>
        <div className='div_dropitem_modal'>
            <span className='text_dropitem_modal'>{lang.move_table}</span>
        </div>
        <div className='dropitem_position_board'>
        <select className="select" value={newItemPositionBoard ? newItemPositionBoard : board.id} onChange={(e) => itemRearrangement(e, board, item)}>
            
            <option value="DEFAULT" disabled>{lang.choose_list}</option>
            {boards.map((board1) => (
                <option key={board1.id} value={board1.id}>{board1.title === board.title ? `${board1.title} ${lang.now_current}` : board1.title}</option>
            ))}
        </select>
        </div>
        <Link onClick={() => {setChangeMenuBoardPositionItem(false)}} className='icon_close_div'>
            <AiOutlineClose className='icon_close'></AiOutlineClose>
        </Link>   
        <div className='div_change_postion'>
            <Link onClick={() => {changePositionItem(item, index, i)}} className='add_item_link'>{lang.change}</Link>
        </div>
    </div>
  )
}

export default ChangePositionItem