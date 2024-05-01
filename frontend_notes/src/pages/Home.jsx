import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../components/context/AuthContext';
import { jwtDecode } from "jwt-decode";
import { NoteService } from '../services/note.service';
import { AiFillStar, AiOutlineUser, AiOutlineTeam, AiOutlineProject, AiOutlineStar, AiOutlineEllipsis, AiFillPlusCircle } from "react-icons/ai";
import '../styles/pages.css'
import NewBoard from '../components/pages/NewBoard';
const Home = () => {
  let {setListPages, listPages, logoutUser, authTokens, history, listFavoritePages, setFavoritePages, userInfo, setUserInfo} = useContext(AuthContext)
  let user = localStorage.getItem('authTokens') ?  jwtDecode(localStorage.getItem('authTokens')) : null
  
  const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false) // modal dialog
  const handleStar = async (boardId) => {
    const data = await NoteService.removeBoardFavorite(boardId, userInfo.id)
    setFavoritePages(data.boards_like)
    setListPages(data.boards_not_like)
  } 
  const handleStarAdd = async (boardId) => {
    const data = await NoteService.addBoardFavorite(boardId, userInfo.id)
    setFavoritePages(data.boards_like)
    setListPages(data.boards_not_like)
  } 
  const handleClickElement = (e, item) => {
    if (e.target.classList.value === 'star-board' || e.target.classList.value === 'div-star' || e.target.classList.value === '' || e.target.classList.value === ' ') return
    history(`/pages/${item.id}`)
  }
  const handleClickOutsideInCreatePage = (e) => {
    const container = document.getElementById("create_page")
    if (!container?.contains(e.target)){
      handleClose()
    }
  }
  const handleClose = () => {
    setModalInfoIsOpen(false);
  }
  useEffect(() => {
      const fetchData = async () => {
          const data = await NoteService.getFavoritesBoards(authTokens)
          const data2 = await NoteService.getUserInfo(authTokens)
          if (data === -1){
            logoutUser()
          }else if (data === 0){
            setListPages(null)
          }
          else{
            setListPages(data.boards_not_like)
            setFavoritePages(data.boards_like)
            setUserInfo(data2)
          }
      }
      if (modalInfoIsOpen) document.addEventListener("mousedown", handleClickOutsideInCreatePage)
      fetchData()
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideInCreatePage)
    }
  }, [modalInfoIsOpen])
  return (
  <div className='home'>
    <div className='boards'>
      {listFavoritePages?.length !== 0 && 
      <div className='boards-header'>
        <AiOutlineStar className='icons_header' /> 
        <span className='text_header'>Отмеченные доски</span>
      </div>
      }
      <div className='boards-list'>
        {listFavoritePages?.map((item, index) => 
          <div onClick={(e) => handleClickElement(e, item)} className="boards_link" key={index} style={{backgroundImage: `url(${item.cover})`}}>
            <div className='board-details'>
              <div className='board-title'>
                <div className='boards-center'>
                  <span className='icon-'>{item.icon}</span> 
                  <span className='text-header-icon' style={{marginLeft: 5}}>{item.title}</span>
                </div>
              </div>
              <div className='board-description'>
                <div className='boards-center'>
                  <AiOutlineTeam className='icon-team'/> 
                  <span className='text-users' style={{marginLeft: 3}}>{item.users}</span>
                </div>
                <div className="div-star"  onClick={() => handleStar(item.id)} >
                  <AiFillStar className='star-board'/>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <div className='boards'>
      <div className='boards-header'>
        <AiOutlineProject className='icons_header' />
        <span className='text_header'>Остальные таблицы</span>
      </div>
      <div className='boards-list'>
        {listPages?.map((item, index) => 
          <div onClick={(e) => handleClickElement(e, item)} className="boards_link" key={index} style={{backgroundImage: `url(${item.cover})`}}>
            <div className='board-details'>
              <div className='board-title'>
                <div className='boards-center'>
                  <span className='icon-'>{item.icon}</span> 
                  <span className='text-header-icon' style={{marginLeft: 5}}>{item.title}</span>
                </div>
              </div>
              <div className='board-description'>
                <div className='boards-center'>
                  <AiOutlineTeam className='icon-team'/> 
                  <span className='text-users' style={{marginLeft: 3}}>{item.users}</span>
                </div>
                <div className="div-star" onClick={() => handleStarAdd(item.id)} >
                  <AiOutlineStar className='star-board'/>
                </div>
              </div>
            </div>
          </div>
        )}
        <div onClick={() => {modalInfoIsOpen ? null : setModalInfoIsOpen(true)}} className="boards_link-new-page" style={{}}>
            <div className='board-details-new-page'>
              Создать доску
            </div>
            <div className='board-add-'>
              {modalInfoIsOpen && <NewBoard handleClose={handleClose} userInfo={userInfo}/>}
            </div>
          </div>
          
      </div>
    </div>
    

  </div>
    
  )
};


export default Home;
