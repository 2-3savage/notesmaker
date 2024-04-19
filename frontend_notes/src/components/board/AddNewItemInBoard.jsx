import React, {useRef, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'
const AddNewItemInBoard = ({ index, board,  newItems, setInputValue, addNewItem, deleteItem, addItem }) => {
    
  return (
    <>
        
        {!newItems[index] && (<>
            <Link onClick={() => { addItem(index)} } draggable={false} className="new_item">
                <AiOutlinePlus className='icon_add'/>
                <span className='text'>Добавить карточку</span>
            </Link>
        </>)}
    </>
  )
}

export default AddNewItemInBoard