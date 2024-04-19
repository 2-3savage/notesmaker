import React from 'react'
import { Link } from 'react-router-dom'
import { useRef, useEffect, useState, useContext } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { AiOutlineRead, AiOutlineStar,AiOutlineUserAdd, AiFillStar, AiOutlineDown, AiOutlineEllipsis, AiFillPlusCircle } from "react-icons/ai";
import { NoteService } from '../../services/note.service';
import UserDatails from './UserDatails';
import AuthContext from '../context/AuthContext';
const CoverItem = ({setDragMember, setUser, star, setStar, userInfo, title, user, chosenEmoji, emojiOpen, onEmojiClick, setEmojiOpen, id}) => {
    let {authTokens, setFavoritePages} = useContext(AuthContext)
    const handleStar = async (e) => {
        if (star){
            const data = await NoteService.removeBoardFavorite(parseInt(id), parseInt(userInfo.id))
            setStar(false)
            setFavoritePages(data.boards_like)
        }else{
            const data = await NoteService.addBoardFavorite(parseInt(id), parseInt(userInfo.id))
            setStar(true)
            setFavoritePages(data.boards_like)
        }
    }
    const [userDatails, setUserDatails] = useState([]);
    const [addUserBoard, setAddUserBoard] = useState(false)
    const [users, setUsers] = useState(null)

    const handleInput = async (e) => {
        if (e.target.value === '') return
        const data = await NoteService.updatePage({title: e.target.value}, id, authTokens)
        setFavoritePages(data.boards_like)
    }
    const handleInputSearchUser = async (e) => {
        if (e.target.value.length < 4){
            return
        }
        const user = await NoteService.searchUser(e.target.value)
        setUsers(user)
    }
    const handleClick = (i) => {
        const updatedHiddenButtons = [];
        updatedHiddenButtons.push(`${i}`);
        setUserDatails(updatedHiddenButtons);
      };
    return (
        <>
        
            <div draggable={false} className="cover_div">
                
                    <div style={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>
                        <div className='icon_div'>
                            {!chosenEmoji && <AiFillPlusCircle onClick={() => {setEmojiOpen(true)}} className='img_icon'/>}
                            {chosenEmoji && (<div onClick={() => {setEmojiOpen(true)}} className='img_icon2'>{chosenEmoji}</div>)}
                        </div>
                        {emojiOpen && (<div className='emoji'><EmojiPicker className="absolute" onEmojiClick={onEmojiClick} theme={`${document.querySelector("body").classList[0]}`}/></div>)}
                        <div className='div_input'>
                            <input type='text' defaultValue={title} onChange={handleInput} className='name'></input>
                        </div>
                        
                        
                        {star ? (<Link draggable={false} onClick={handleStar} style={{marginLeft: -200}} className='icon_form'><AiFillStar  draggable={false} className='icon_star'/></Link>) : (<Link draggable={false} style={{marginLeft: -200}} onClick={handleStar} className='icon_form'><AiOutlineStar  className='icon_star'/></Link>)}
                        <Link draggable={false} style={{marginLeft: 25}} className='button_link_share'><AiOutlineRead className='icon_min'></AiOutlineRead>Режим просмотра<AiOutlineDown className='icon_min'></AiOutlineDown></Link>
                        
                        
                    </div>
                    
                    <div draggable={false} style={{marginRight: 10}} className="end_info">
                        <span className='border_left'></span>
                        {user?.map((item, i) => (
                            <div draggable={true} onDragStart={() => {setDragMember(item)}} key={i}>
                                {i >= 3 ? ( 
                                <>
                                    
                                </>
                                ) : (
                                    <>
                                        <Link draggable={false} onClick={() => handleClick(i)} className='user_link'>
                                            <img draggable={false}
                                                className='image_user'
                                                src={item.user.avatar}
                                            />
                                        </Link>
                                        {userDatails?.includes(`${i}`) && (
                                            <>
                                                <UserDatails id={id} userInfo={userInfo} userDatails={userDatails} setUser={setUser} setUserDatails={setUserDatails} item={item}/>
                                            </>
                                        )}
                                     </>
                                    
                                )}
                            </div>
                        ))}
                        
                        <Link onClick={() => {setAddUserBoard(true)}} draggable={false} style={{marginLeft: 10}} className='button_link_share'><AiOutlineUserAdd style={{marginRight: 5}}/> Поделиться</Link>
                        {addUserBoard && (
                            <>
                                <input onChange={handleInputSearchUser}></input>
                                
                                <div>{users?.map((item, index) => {
                                    return <Link key={index} onClick={() => NoteService.createInvite(authTokens, parseInt(item.id), id)}>{item.email}</Link>
                                })}</div>
                                
                            </>
                        )}
                        <Link draggable={false} style={{marginLeft: 10}} className='icon_form'><AiOutlineEllipsis className='icon_bar'></AiOutlineEllipsis></Link>
                    </div>
                    

                </div>
            
            
        
        </>
    )
}

export default CoverItem