import React from 'react'
import { Link } from 'react-router-dom'
import { useRef, useEffect, useState, useContext } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { AiOutlineRead, AiOutlineDashboard, AiOutlineSchedule, AiOutlineProject, AiOutlineClose, AiOutlineStar,AiOutlineUserAdd, AiFillStar, AiOutlineDown, AiOutlineEllipsis, AiFillPlusCircle } from "react-icons/ai";
import { NoteService } from '../../services/note.service';
import UserDatails from './UserDatails';
import AuthContext from '../context/AuthContext';
import ModalDialogBoard from './ModalDialogBoard';
const CoverItem = ({setChoiceView, choiceView, setDragMember, setUser, star, setStar, userInfo, setUserInfo, title, user, chosenEmoji, emojiOpen, onEmojiClick, setEmojiOpen, id}) => {
    let {authTokens, setFavoritePages, history, setListPages} = useContext(AuthContext)
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
    const [invations, setInvations] = useState()
    const getInvationsInBoard = async () => {
        const data = await NoteService.getInvations(id)
        setInvations(data)
    }
    const updateBoardRole = async (item, userInfo, permission) => {
        if (permission === "creator"){
            await NoteService.updateBoardUser(id, item.id, {right: permission})
            const data = await NoteService.updateBoardUser(id, userInfo.id, {right: "admin"})
            setUser(data)
            setUserInfo({id: userInfo.id, email: userInfo.email, right: "admin", username: userInfo.username})
            return
        }
        const data = await NoteService.updateBoardUser(id, item.id, {right: permission})
        setUser(data)
        setModalMenu(null)
        setUsers(null)
    }
        
    
    const deleteBoard = async () => {
        await NoteService.deleteBoard(authTokens, id)
        const data = await NoteService.getFavoritesBoards(authTokens)
        setListPages(data.boards_not_like)
        setFavoritePages(data.boards_like)
        await history('/')
    } 
    const deleteUserInBoard = async (item) => {
        const data = await NoteService.removeUserInBoard(id, item.id)
        setUser(data)
    }
    const deleteUserInBoardMe = async (item) => {
        const data = await NoteService.removeUserInBoard(id, item.id)
        setUser(data)
        const data2 = await NoteService.getFavoritesBoards(authTokens)
        setListPages(data2.boards_not_like)
        setFavoritePages(data2.boards_like)
        await history('/')
    }
    const [userDatails, setUserDatails] = useState([]);
    const [addUserBoard, setAddUserBoard] = useState(false)
    const [users, setUsers] = useState(null)
    const [modalDialog, setModalDialog] = useState(false)
    const [modalMenu, setModalMenu] = useState(false)
    const handleInput = async (e) => {
        if (e.target.value === '') return
        const data = await NoteService.updatePage({title: e.target.value}, id, authTokens)
        setFavoritePages(data.boards_like)
    }
    const handleInputSearchUser = async (e) => {
        if (e.target.value.length < 3){
            setUsers(e.target.value.length)
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
    const handleClickOutsideInModalDialog = (e) => {
        const container = document.querySelector(".modal_choice")
        if (!container?.contains(e.target)){
            setModalDialog(false)
        }
    }
    const handleClickOutsideUserInfo = (e) => {
        const container = document.querySelector(".user_datails")
        if (!container?.contains(e.target)){
            setAddUserBoard(false)
        }
    }
    const roleTranslator = (word) => {
        switch (word) {
            case "creator":
              return "Создатель доски"
            case "admin":
              return "Администратор доски"
            case "participant":
              return "Участник доски"
        }

    }
    const handleClickOutsideUserInfoRole = (e) => {
        const container = document.querySelector(".user_role_change")
        if (!container?.contains(e.target)){
            setModalMenu(false)
        }
    }
    const handleClickOutsideUserInfoRoleInvite = (e) => {
        const container = document.querySelector(".invite_user")
        if (!container?.contains(e.target)){
            setUsers(null)
        }
    }
    const inviteUser = async (item) => {
        const data = await NoteService.createInvite(authTokens, parseInt(item.id), id)
        setUsers(null)
        setInvations(data)
        
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutsideUserInfoRoleInvite)
        document.addEventListener("mousedown", handleClickOutsideUserInfo)
        document.addEventListener("mousedown", handleClickOutsideUserInfoRole)
        document.addEventListener("mousedown", handleClickOutsideInModalDialog)
        getInvationsInBoard()
        return () => {
            document.addEventListener("mousedown", handleClickOutsideUserInfoRoleInvite)
            document.removeEventListener("mousedown", handleClickOutsideInModalDialog)
            document.addEventListener("mousedown", handleClickOutsideUserInfoRole)
            document.removeEventListener("mousedown", handleClickOutsideUserInfo)
        }
    }, [modalDialog, modalMenu, users])
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
                        <div>
                        <Link draggable={false} onClick={() => modalDialog ? setModalDialog(false) : setModalDialog(true)} style={{marginLeft: 25}} className='button_link_share'><AiOutlineRead className='icon_min'></AiOutlineRead>{choiceView}<AiOutlineDown className='icon_min'></AiOutlineDown></Link>
                            {modalDialog && 
                                <div className='modal_choice'>
                                    <div className='div_dropitem_modal'>
                                        <span className='text_dropitem_modal'>Режим просмотра</span>
                                    </div>
                                    <Link onClick={() => {setModalDialog(false)}} className='icon_close_div'>
                                        <AiOutlineClose className='icon_close'></AiOutlineClose>
                                    </Link> 
                                    <ul className='main_choice'>
                                        <div onClick={() => {setChoiceView("Доска"); setModalDialog(false)} } className='btn_choice'>
                                            <li className='div_choice_btn'>
                                                <AiOutlineProject className='icon_choice'/>
                                                <span>Доска</span>
                                            </li>
                                        </div>
                                        <div onClick={() => {setChoiceView("Таблица"); setModalDialog(false)}} className='btn_choice'>
                                            <li className='div_choice_btn'>
                                                <AiOutlineSchedule className='icon_choice'/>
                                                <span>Таблица</span>
                                            </li>
                                        </div>
                                        <div onClick={() => {setChoiceView("Панель"); setModalDialog(false)}} className='btn_choice'>
                                            <li className='div_choice_btn'>
                                                <AiOutlineDashboard className='icon_choice'/>
                                                <span>Панель</span>
                                            </li>
                                        </div>
                                    </ul>
                                </div>
                            }
                        </div>
                        
                        
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
                                                <UserDatails setUserInfo={setUserInfo} id={id} userInfo={userInfo} userDatails={userDatails} setUser={setUser} setUserDatails={setUserDatails} item={item}/>
                                            </>
                                        )}
                                     </>
                                    
                                )}
                            </div>
                        ))}
                        
                        <Link onClick={() => {setAddUserBoard(true)}} draggable={false} style={{marginLeft: 10}} className='button_link_share'><AiOutlineUserAdd style={{marginRight: 5}}/> Поделиться</Link>
                        
                            
                        {addUserBoard && 
                            
                            <div className='user_datails'>
                                <div className="header_div_modal">
                                    <div className='text_header'>
                                        Поделиться доской
                                    </div>
                                    <Link onClick={() => setAddUserBoard(false)} className='icon_close_div'>
                                        <AiOutlineClose className='icon_close_user_exit'></AiOutlineClose>
                                    </Link>
                                    
                                </div>
                                <input className="input_line" placeholder="Адрес электронной почты" onChange={handleInputSearchUser}></input>
                                {users !== null && users !== 0 && 
                                    <div className='invite_user'>
                                        {users < 3 ? <div className='invite_modal'>
                                            <span className='header_invite'>
                                                Похоже, этот человек еще не участник Notesmaker. Добавьте адрес его электронной почты, чтобы пригласить.
                                            </span>
                                        </div> :
                                            users?.map((item, index) => 
                                                <div key={index}>
                                                    {console.log()}
                                                    { user?.filter(user => user.id === item.id)[0] !== undefined ?
                                                        <Link className="link_disabled">
                                                            <img draggable={false}
                                                                className='image_user_modal'
                                                                src={item.user.avatar}
                                                            />
                                                            <div className='info_item_dialog_modal'>
                                                                <span className='top_info_item'>{item.username}</span>
                                                                <span className='botom_info_item'>{item.email} • {roleTranslator(user?.filter(user => user.id === item.id)[0]?.user?.rights)}</span>
                                                            </div>
                                                        </Link>
                                                        : invations?.filter(user => user.invitee.id === item.id)[0] !== undefined ?
                                                        <Link className="link_disabled">
                                                            <img draggable={false}
                                                                className='image_user_modal'
                                                                src={item.user.avatar}
                                                            />
                                                            <div className='info_item_dialog_modal'>
                                                                <span className='top_info_item'>{item.username}</span>
                                                                <span className='botom_info_item'>{item.email} • Ожидание ответа на приглашение</span>
                                                            </div>
                                                        </Link> 
                                                        :
                                                        <Link className="link_invite_user" onClick={() => inviteUser(item)}>
                                                            <img draggable={false}
                                                                className='image_user_modal'
                                                                src={item.user.avatar}
                                                            />
                                                            <div className='info_item_dialog_modal'>
                                                                <span className='top_info_item'>{item.username}</span>
                                                                <span className='botom_info_item'>{item.email}</span>
                                                            </div>
                                                        </Link> 
                                                    }
                                                    
                                                </div>
                                                
                                            
                                            )
                                        }
                                        

                                    </div>
                                }
                                {user?.map((item, i) => (
                                    <div className="item_user_modal_dialog" key={i}>
                                        <img draggable={false}
                                                className='image_user_modal'
                                                src={item.user.avatar}
                                        />
                                        <div className='info_item_dialog_modal'>
                                            <span className='top_info_item'>{item.username}</span>
                                            <span className='botom_info_item'>{item.email} • {roleTranslator(item.user.rights)}</span>
                                        </div>
                                        <button className='button_role' onClick={() => {setModalMenu(i)}}><span className='span_role_modal'>{roleTranslator(item.user.rights)}</span><AiOutlineDown className='icon_modal_role'/></button>
                                        { modalMenu === i && 
                                        <div className='user_role_change'>
                                            { userInfo.id === item.id ?
                                                <>
                                                <button className={roleTranslator(userInfo.right) === "Создатель доски" ? 'btn_active_role' : 'btn_disabled_role'}>
                                                    <span>Создатель доски</span>
                                                </button> 
                                                <button className={roleTranslator(userInfo.right) === "Администратор доски" ? 'btn_active_role' : 'btn_disabled_role'}>
                                                    <span>Администратор доски</span>
                                                </button> 
                                                <button className={roleTranslator(userInfo.right) === "Участник доски" ? 'btn_active_role' : 'btn_disabled_role'}>
                                                    <span>Участник доски</span>
                                                </button> 
                                                {roleTranslator(userInfo.right) === "Создатель доски" ?
                                                    <button onClick={() => {deleteBoard()}} className='btn_change_role'>
                                                        <span>Удалить доску</span>
                                                    </button>
                                                    :
                                                    <button onClick={() => {deleteUserInBoardMe(item)}} className='btn_change_role'>
                                                        <span>Выйти с доски</span>
                                                    </button>
                                                }
                                                
                                            </>
                                            : roleTranslator(userInfo.right) === "Создатель доски" && roleTranslator(item.user.rights) === "Участник доски" ?
                                                <>
                                                    <button onClick={() => updateBoardRole(item, userInfo, "creator")} className={'btn_change_role'}>
                                                        <span>Создатель доски</span>
                                                    </button> 
                                                    <button onClick={() => updateBoardRole(item, userInfo, "admin")} className={'btn_change_role'}>
                                                        <span>Администратор доски</span>
                                                    </button> 
                                                    <button className='btn_active_role'>
                                                        <span>Участник доски</span>
                                                    </button> 
                                                    <button onClick={() => deleteUserInBoard(item)}  className='btn_change_role'>
                                                        <span>Удалить с доски</span>
                                                    </button>
                                                </>
                                                : roleTranslator(userInfo.right) === "Создатель доски" && roleTranslator(item.user.rights) === "Администратор доски" ?
                                                <>
                                                    <button onClick={() => updateBoardRole(item, userInfo, "creator")} className={'btn_change_role'}>
                                                        <span>Создатель доски</span>
                                                    </button> 
                                                    <button className={'btn_active_role'}>
                                                        <span>Администратор доски</span>
                                                    </button> 
                                                    <button onClick={() => updateBoardRole(item, userInfo, "participant")} className={"btn_change_role"}>
                                                        <span>Участник доски</span>
                                                    </button> 
                                                    <button onClick={() => deleteUserInBoard(item)} className='btn_change_role'>
                                                        <span>Удалить с доски</span>
                                                    </button>
                                                </>
                                                : (roleTranslator(userInfo.right) === "Администратор доски" || roleTranslator(userInfo.right) === "Участник доски") && roleTranslator(item.user.rights) === "Создатель доски" ?
                                                <>
                                                    <button className={'btn_active_role'}>
                                                        <span>Создатель доски</span>
                                                    </button> 
                                                    <button className={'btn_disabled_role'}>
                                                        <span>Администратор доски</span>
                                                    </button> 
                                                    <button className={'btn_disabled_role'}>
                                                        <span>Участник доски</span>
                                                    </button> 
                                                    <button className='btn_disabled_role'>
                                                        <span>Удалить с доски</span>
                                                    </button>
                                                </>
                                                : (roleTranslator(userInfo.right) === "Администратор доски" || roleTranslator(userInfo.right) === "Участник доски") && roleTranslator(item.user.rights) === "Администратор доски" ?
                                                <>
                                                    <button className={'btn_disabled_role'}>
                                                        <span>Создатель доски</span>
                                                    </button> 
                                                    <button className={'btn_active_role'}>
                                                        <span>Администратор доски</span>
                                                    </button> 
                                                    <button className={'btn_disabled_role'}>
                                                        <span>Участник доски</span>
                                                    </button> 
                                                    <button className='btn_disabled_role'>
                                                        <span>Удалить с доски</span>
                                                    </button>
                                                </>
                                                : roleTranslator(userInfo.right) === "Администратор доски" && roleTranslator(item.user.rights) === "Участник доски" ?
                                                <>
                                                    <button className={'btn_disabled_role'}>
                                                        <span>Создатель доски</span>
                                                    </button> 
                                                    <button className={'btn_disabled_role'}>
                                                        <span>Администратор доски</span>
                                                    </button> 
                                                    <button className={'btn_active_role'}>
                                                        <span>Участник доски</span>
                                                    </button> 
                                                    <button onClick={() => deleteUserInBoard(item)} className='btn_change_role'>
                                                        <span>Удалить с доски</span>
                                                    </button>
                                                </> 
                                                :
                                                <>
                                                    <button className={'btn_disabled_role'}>
                                                        <span>Создатель доски</span>
                                                    </button> 
                                                    <button className={'btn_disabled_role'}>
                                                        <span>Администратор доски</span>
                                                    </button> 
                                                    <button className={'btn_active_role'}>
                                                        <span>Участник доски</span>
                                                    </button> 
                                                    <button className='btn_disabled_role'>
                                                        <span>Удалить с доски</span>
                                                    </button>
                                                </>
                                            }
                                            
                                        </div>

                                        }
                                    </div>
                                ))}
                                <hr/>
                                {
                                    invations.map((item, index) => (
                                        <div key={index} className='item_user_modal_dialog_invite'>
                                            <img draggable={false}
                                                className='image_user_modal'
                                                src={item?.invitee.user?.avatar}
                                            />
                                           
                                            <div className='info_item_dialog_modal'>
                                                <span className='top_info_item'>{item?.invitee.username}</span>
                                                <span className='botom_info_item'>{item?.invitee.email} • Ожидание ответа на приглашение</span>
                                            </div>
                                        </div>
                                        
                                    ))
                                }
                            </div>
                        
                        }
                        
                       
                        
                        <Link draggable={false} style={{marginLeft: 10}} className='icon_form'><AiOutlineEllipsis className='icon_bar'></AiOutlineEllipsis></Link>
                    </div>
                    

                </div>
            
            
        
        </>
    )
}

export default CoverItem