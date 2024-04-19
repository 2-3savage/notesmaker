import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'
const DeleteModal = ({deleteItemActive, deleteCard, setDeleteItemActive}) => {
  return (<>
    { deleteItemActive && 
      <div style={{zIndex: 10}} className='tag_open'>
      <div className='div_dropitem_modal'>
          <span className='text_dropitem_modal'>Удаление карточки</span>
      </div>
      <div style={{margin: 15}}>
          <span className='text_delete'>Вы точно хотите удалить карточку?</span>
      </div>
      <div className='buttons_tag'>
          <Link onClick={() => {deleteCard()}} className='delete_tag_full'>Удалить</Link>
      </div>
      <Link onClick={() => setDeleteItemActive(false) } className='icon_close_div'>
          <AiOutlineClose className='icon_close'></AiOutlineClose>
      </Link> 
      </div>
    }
    </>
  )
}

export default DeleteModal