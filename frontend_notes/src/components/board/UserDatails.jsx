import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { AiOutlineTeam, AiOutlineLeft, AiOutlineDelete, AiOutlineTag, AiOutlineClockCircle, AiOutlineAlignLeft, AiOutlinePlus, AiOutlineEdit,AiOutlineCreditCard, AiOutlineArrowRight, AiOutlineClose } from 'react-icons/ai'
import { NoteService } from '../../services/note.service';
import AuthContext from '../context/AuthContext';

const UserDatails = ({setUser, userInfo, setUserInfo, userDatails, setUserDatails, item, id}) => {
    let {authTokens, setFavoritePages, history, setListPages} = useContext(AuthContext)
    const handleClickOutsideUserInfo = (e) => {
        const container = document.querySelector(".user_datails")
        if (e.target.classList.value === "image_user"){
            return
        }
        if (!container?.contains(e.target)){
            setUserDatails([])
        }
    }
    const deleteUserInBoard = async () => {
        const data = await NoteService.removeUserInBoard(id, item.id)
        setUser(data)
    }
    const addPermissionsUser = async (permission) => {
        if (permission == "creator"){
            await NoteService.updateBoardUser(id, item.id, {right: permission})
            const data = await NoteService.updateBoardUser(id, userInfo.id, {right: "admin"})
            setUser(data)
            setUserInfo({id: userInfo.id, email: userInfo.email, right: "admin", username: userInfo.username})
            return
        }
        const data = await NoteService.updateBoardUser(id, item.id, {right: permission})
        setUser(data)
    }
    const deleteBoard = async () => {
        await NoteService.deleteBoard(authTokens, id)
        const data = await NoteService.getFavoritesBoards(authTokens)
        setListPages(data.boards_not_like)
        setFavoritePages(data.boards_like)
        await history('/')
    } 
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideUserInfo)
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideUserInfo) 
        }
    }, [userDatails])
  return (
    <div className='user_datails'>
        <Link onClick={() => setUserDatails([])} className='icon_close_div'>
            <AiOutlineClose className='icon_close_user_info'></AiOutlineClose>
        </Link>
        <div className='cover_user_datails'>
            <img draggable={false} src={item?.user.avatar} className='image_user_datails'></img>
            <div className='user_info'>
                <div className='user_name'>{item?.username}</div>
                <div className='user_email'>{item?.email}</div>
                
            </div>
            
        </div>
        {userInfo.right === "creator" && item.user.rights  === "creator"  ? 
            <ul className='main_user_datails'>
                <li className='user_li_info'>
                    <Link onClick={() => {deleteBoard()}} className='link_user_info'>
                        <span className='text_user_info'>Удалить доску</span>
                    </Link>
                    
                </li>
            </ul>
        : (userInfo.right === "admin" && item.user.rights === "creator") || (userInfo.right === "admin" && item.user.rights === "admin") || (userInfo.right === "participant") ?
            <ul className='main_user_datails'>
                
            </ul>
        : userInfo.right === "creator" && item.user.rights === "admin" ? 
        <ul className='main_user_datails'>
            
            <li className='user_li_info'>
                <Link onClick={() => {addPermissionsUser("creator")}} className='link_user_info'>
                    <span className='text_user_info'>Сделать создателем доски</span>
                </Link>
            </li>
            <li className='user_li_info'>
                <Link onClick={() => {addPermissionsUser("participant")}} className='link_user_info'>
                    <span className='text_user_info'>Понизить до участника</span>
                </Link>
                
            </li>
            <li className='user_li_info'>
                <Link onClick={() => {deleteUserInBoard()}} className='link_user_info'>
                    <span className='text_user_info'>Удалить участника из доски</span>
                </Link>
                
            </li>
        </ul>
        : userInfo.right === "creator" || userInfo.right === "admin" ? 
        <ul className='main_user_datails'>
            <li className='user_li_info'>
                <Link onClick={() => {addPermissionsUser("admin")}} className='link_user_info'>
                    <span className='text_user_info'>Сделать администратом доски</span>
                </Link>
            </li>
            <li className='user_li_info'>
                <Link onClick={() => {deleteUserInBoard()}} className='link_user_info'>
                    <span className='text_user_info'>Удалить участника из доски</span>
                </Link>
                
            </li>
        </ul>
        : 
        <>
        
        </>
        } 
        
        
        
    </div>
  )
}

export default UserDatails