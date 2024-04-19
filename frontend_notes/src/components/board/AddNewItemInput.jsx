import React, {useRef, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'

const AddNewItemInput = ({ index, setNewItems, board,  newItems, setInputValue, addNewItem, deleteItem, addItem }) => {
    const contentRefsInput = useRef(null) 
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
    }, [newItems, index]);
    
  return (
    <>
        {newItems[index] && (
            <>
                <div className='item_3 text'>
                    <input id="input_add" onKeyDown={handleKeyPress} ref={contentRefsInput} onChange={(e) => {setInputValue(e.target.value)}} type="text" className='input' placeholder='Введите заголовок'></input>
                </div>
                <div className='add_item_div_'>
                    <Link onClick={(e) => addNewItem(board)} className='add_item_link'>Добавить карточку</Link>
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