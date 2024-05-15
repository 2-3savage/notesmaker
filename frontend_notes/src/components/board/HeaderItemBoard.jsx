import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineDelete, AiOutlinePlus,AiOutlineLeft, AiOutlineInsertRowLeft,  AiOutlineEllipsis, AiOutlineClose } from 'react-icons/ai'
import { NoteService } from '../../services/note.service'
import { en_language, ru_language } from '../../services/language'
import AuthContext from '../context/AuthContext'
const HeaderItemBoard = ({ deleteBoardActive, setDeleteBoardActive, boards, board, newBoardPosition, menuBoard, index,  changeMenuBoard, addItemInMenu, setChangeMenuBoard, deleteBoard, tableRearrangement, menuBoardActive, changeBoard, setMenuBoard}) => {
    const [title, setTitle] = useState( board.title )
    let {authTokens, setFavoritePages, language} = useContext(AuthContext)
    const [elementActive, setElementActive] = useState(false)
    const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);
    const contentRefs = useRef(null)
    const elementActiveClick = () => {
        setElementActive(true)
        const textarea = contentRefs.current; 
        textarea.style = {display: "block"}
        textarea.focus();
        textarea.setSelectionRange(0, textarea.value.length);
    }
    const editTitle = (e) => {
        setTitle(e.target.value)
        NoteService.updateTable({title: e.target.value}, parseInt(board.id))
        board.title = e.target.value
        
    }
    const handleClickOutside = (e) => {
        if (e.target.classList.value === "content_editable_text_board" || e.target.classList.value  === "board__title") return
        if (board.title !== ""){
            NoteService.updateTable({title: e.target.value}, board.id)
        }else{
            board.title = title
        }
    
        setElementActive(false)
    }
    useEffect(() => {
        setLang(language === "Русский" ? ru_language : en_language);
        setTitle(board.title)
        if (elementActive) document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [elementActive, board, language]) 
  return (
    <div className="header_board">
        <div className="board__title text">    
            <textarea ref={contentRefs} type='text' style={elementActive ? null : {display: "none"}} className='content_editable_text_board' onChange={(e) => editTitle(e)} value={title}></textarea>
            <span onClick={() => elementActiveClick()} className='title_text_board' style={elementActive ? {display: "none"} : {display: "block"}}>{title}</span>    
        </div>
        {menuBoard[index] && (<>
            <div id={`menu_${index}`} className='menu_board'>
                <div className='menu_board_detail'>
                    {!changeMenuBoard && (
                    <ul className='ul_dropitem'>
                        <li className='li_dropitem'>
                            <Link draggable={false} onClick={(e) => { addItemInMenu(index)} } className="link">
                                <AiOutlinePlus className="icon"/>
                                <span className="text_dropitem">{lang.add_item}</span>
                            </Link>
                        </li>
                        <li className='li_dropitem'>
                            <Link draggable={false} onClick={() => {setChangeMenuBoard(true);}} className="link">
                                <AiOutlineInsertRowLeft className="icon"/>
                                <span className="text_dropitem">{lang.move_table_conf}</span>
                            </Link>
                        </li>
                        <li className='li_dropitem'>
                            <Link draggable={false} onClick={() => setDeleteBoardActive(true)} className="link">
                                <AiOutlineDelete className="icon"/>
                                <span className="text_dropitem">{lang.delete_table_conf}</span>
                            </Link>
                        </li>
                        { deleteBoardActive && 
                            <div style={{zIndex: 10}} className='tag_open'>
                                <div className='div_dropitem_modal'>
                                    <span className='text_dropitem_modal'>{lang.delete_table}</span>
                                </div>
                                <div style={{margin: 15}}>
                                    <span className='text_delete'>{lang.confirmation_delete}</span>
                                </div>
                                <div className='buttons_tag'>
                                    <Link onClick={() => deleteBoard(index, board)} className='delete_tag_full'>{lang.delete}</Link>
                                </div>
                                <Link onClick={() => setDeleteBoardActive(false)} className='icon_close_div'>
                                    <AiOutlineClose className='icon_close'></AiOutlineClose>
                                </Link> 
                                
                            </div>
                        }
                    </ul>
                    )}
                    {changeMenuBoard && (
                    <div className='element_position_change'>
                        <div className='div_dropitem_modal'>
                            <span className='text_dropitem_modal'>{lang.move_table}</span>
                        </div>
                        <div className='dropitem_position_board'>
                            <select value={newBoardPosition ? newBoardPosition : board.id} onChange={(e) => tableRearrangement(e)}>
                                <option value="DEFAULT" disabled>{lang.choose_move}</option>
                                {boards.map((board1, index) => (
                                    <option key={index} value={board1.id}>{board1 === board? board1.title + `${lang.now_current}`: board1.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className='div_change_postion'>
                            <Link onClick={() => {changeBoard(board)}} className='add_item_link'>{lang.move}</Link>
                            <div onClick={() => {setMenuBoard([]); setChangeMenuBoard(false)}} className='icon_close_div'>
                                <AiOutlineClose  className='icon_close'></AiOutlineClose>
                            </div>   
                            <Link onClick={() => {setChangeMenuBoard(false)}} className='icon_back_div'>
                                <AiOutlineLeft className='icon_back'></AiOutlineLeft>
                            </Link>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </>)}
        <div onClick={ () => menuBoardActive(index) } className="icon_dropitem_div">
            <AiOutlineEllipsis className='icon_drop'/>
        </div>
    </div>
  )
}

export default HeaderItemBoard