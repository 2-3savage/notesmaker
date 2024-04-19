import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'
const ChangePositionItem = ({itemRearrangement, setChangeMenuBoardPositionItemClose, changePositionItem, boards, board, newItemPositionBoard, item, index, i}) => {
  return (
    <div className='position_change_modal_dialog'>
        <div className='div_dropitem_modal'>
            <span className='text_dropitem_modal'>Перемещение</span>
        </div>
        <div className='dropitem_position_board'>
        <select className="select" value={newItemPositionBoard ? newItemPositionBoard : board.id} onChange={(e) => itemRearrangement(e, board, item)}>
            
            <option value="DEFAULT" disabled>Выберите колонку...</option>
            {boards.map((board1) => (
                <option key={board1.id} value={board1.id}>{board1.title === board.title ? `${board1.title} (текущий)` : board1.title}</option>
            ))}
        </select>
        </div>
        <Link onClick={() => {setChangeMenuBoardPositionItemClose(false)}} className='icon_close_div'>
            <AiOutlineClose className='icon_close'></AiOutlineClose>
        </Link>   
        <div className='div_change_postion'>
            <Link onClick={() => {changePositionItem(item, index, i)}} className='add_item_link'>Переместить</Link>
        </div>
    </div>
  )
}

export default ChangePositionItem