import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {  AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
const AddNewBoard = ({ newBoard, setNewBoard, setInputBoardNameValue, addBoard }) => {
    const contentRefs = useRef(null)
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
    }, [newBoard])
  return (
    <>
        <div>
            {!newBoard && (<>
                <Link onClick={() => {setNewBoard(true)}} draggable={false} className="new_board">
                    <AiOutlinePlus className='icon_add_board'/>
                    <span  className='text'>Добавьте еще одну колонку</span>
                </Link>
            </>) }
            {newBoard && (
            
            <div className="new_board_div">
                <div className='item_2 text'>
                        <input ref={contentRefs} onKeyDown={handleKeyPress} onChange={(e) => {setInputBoardNameValue(e.target.value)}} type="text" id="input" className='input' placeholder='Введите заголовок'></input>
                </div>
                <div className='add_item_div'>
                    <Link onClick={() => addBoard()} className='add_item_link'>Добавить заголовок</Link>
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