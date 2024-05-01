import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineTeam, AiOutlineLeft, AiOutlineDelete, AiOutlineTag, AiOutlineClockCircle, AiOutlineAlignLeft, AiOutlinePlus, AiOutlineEdit,AiOutlineCreditCard, AiOutlineArrowRight, AiOutlineClose } from 'react-icons/ai'
import { NoteService } from '../../services/note.service'
const Members = ({setBoards, boards, user, item, board, setMembers}) => {
  const uniqueUsersList1 = user.map(user => user.id); 
  const uniqueUsersList2 = item.members.map(user => user.id);
  const usersNotInList2 = uniqueUsersList1.filter(userId => !uniqueUsersList2.includes(userId)); 
  const filteredUsersList = user.filter(user => usersNotInList2.includes(user.id));
  const handleItemDelete = async (user) => {
    const index = board.table.indexOf(item)
    await NoteService.removeMemberInItem(user.id, item.id)
    board.table[index].members = board.table[index].members.filter(item => item.id !== user.id)
    setBoards(boards.map(
      b => {
          if (b.id === board.id){
              return board
          }
          return b
      }
  ))
  }
  const handleItemAdd = async (user) => {
    const index = board.table.indexOf(item)
    await NoteService.addMemberInItem(user.id, item.id)
    board.table[index].members.push(user)
    setBoards(boards.map(
      b => {
          if (b.id === board.id){
              return board
          }
          return b
      }
    ))
  }
  return (
    <div className='members_open'>
        <div className='div_dropitem_modal'>
            <span className='text_dropitem_modal'>Участники</span>
        </div>
        <Link onClick={() => {setMembers(false)}} className='icon_close_div'>
            <AiOutlineClose className='icon_close'></AiOutlineClose>
        </Link> 
        {item?.members?.length > 0 ? 
        <div>
          <div className='title_members'>
            <span className='text_members'>Участники карточки</span>
          </div>
          <ul>
              {
                item?.members?.map((item, index) => 
                  <li key={index} className='li_members'>
                    <Link onClick={() => handleItemDelete(item)} className='btn_members'>
                      <span className='image_span_members'>
                        <img className='image_members' src={item.user.avatar}/>
                      </span>
                      <span className='span_members'>
                        {item.username}
                      </span>
                    </Link>
                  </li>
                )
              }
          </ul>
        </div> :
        null
        }
        {filteredUsersList.length > 0 ? 
        <div>
          <div className='title_members'>
            <span className='text_members'>Участники доски</span>
          </div>
          <ul>
              {
                filteredUsersList?.map((item, index) => 
                  <li key={index} className='li_members'>
                    <Link onClick={() => handleItemAdd(item)} className='btn_members'>
                      <span className='image_span_members'>
                        <img className='image_members' src={item.user.avatar}/>
                      </span>
                      <span className='span_members'>
                        {item.username}
                      </span>
                    </Link>
                  </li>
                )
              }
          </ul>

        </div> :
        null
        }
        
    </div>
  )
}

export default Members