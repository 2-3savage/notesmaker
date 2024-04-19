import React from 'react'

const DeleteItems = (name) => {
  return (
    <div className='tag_open'>
        <div className='div_dropitem_modal'>
            <span className='text_dropitem_modal'>{name}</span>
        </div>
        <div className='buttons_tag'>
            <Link onClick={() => {}} className='save_tag'>Сохранить</Link>
            <Link onClick={() => {}} className='delete_tag'>Удалить</Link>
        </div>
    </div>
  )
}

export default DeleteItems