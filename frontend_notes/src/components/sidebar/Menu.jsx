import React, { useEffect, useState, useContext} from 'react';
import styles from './Menu.module.css';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import { Link } from 'react-router-dom';
import { AiOutlineClose, AiOutlineUsergroupAdd } from "react-icons/ai";
import AuthContext from '../context/AuthContext';
import { NoteService } from '../../services/note.service';
import NewPage from './NewPage';

const Menu = ({children, logoutUser}) => {
  let {authTokens, history} = useContext(AuthContext)
  const [switchNav, setSwitch] = useState(localStorage.getItem('switchNav') || 'white');
  const [navbar, setNavbar] = useState(localStorage.getItem('sidebar') || 'open') // true = open, false = close toggle

  const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false) // modal dialog
  const [notifications, setNotifications] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const switchNavbar = () => {
    setSwitch(switchNav === 'white' ? 'dark' : 'white')
  }
  const toggleNavbar = () => {
    setNavbar(navbar === 'open' ? 'close' : 'open' )
  }
  const toggleNav = navbar === 'close' ? styles.close :  null  // true = open, false = close toggle
  switchNav === 'dark' ? document.body.classList.add('dark') : document.body.classList.remove('dark') 
  const switchDarkMode = switchNav === 'dark' ? styles.dark : null
  const mainText = 'Notesmaker'
  const additionalText = 'New approach to notes'

  
  const handleClickOutsideInCreatePage = (e) => {
    const container = document.getElementById("create_page")
    if (!container?.contains(e.target)){
      setModalInfoIsOpen(false)
    }
  }
  const handleClickOutsideInNotification = (e) => {
    const container = document.getElementById("notification")
    if (!container?.contains(e.target)){
      setNotifications(false)
    }
  }
  const dateFunc = (item) => {
    const itemTimestamp = new Date(item.timestamp);
    const currentTime = new Date();
    const timeDifference = currentTime - itemTimestamp;
    let timeText;
    if (timeDifference < 3600000) { // менее часа
      const minutesPassed = Math.floor(timeDifference / 60000);
      timeText = `${minutesPassed} мин.`;
    } else if (timeDifference > 86400000) { // более 24 часов
      const daysPassed = Math.floor(timeDifference / 86400000);
      timeText = `${daysPassed} д.`;
    } else { // в остальных случаях
      const hoursPassed = Math.floor(timeDifference / 3600000);
      timeText = `${hoursPassed} ч.`;
    }
    return timeText
  }
  const handleAddBoardUserNotification = async (item) => {
    const data = await NoteService.responceInvite(authTokens, item.board.id, item.inviter.id, {"status": "accepted"})
    setUserInfo(data)
    history(`/pages/${item.board.id}`)
  }
  const handlePassBoardUserNotification = async (item) => {
    const data = await NoteService.responceInvite(authTokens, item.board.id, item.inviter.id, {"status": "rejected"})
    setUserInfo(data)
  }
  const hoveredMessage = async (item) => {
    const data = await NoteService.updateInvite(authTokens, item.board.id, item.inviter.id, {"is_read": true})
    setUserInfo(data)
  }
  useEffect(() =>{
    const fetchData = async () => {
      const data = await NoteService.getUserInfo(authTokens)
      setUserInfo(data)
    }
    fetchData()
    if (modalInfoIsOpen) document.addEventListener("mousedown", handleClickOutsideInCreatePage)
    if (notifications) document.addEventListener("mousedown", handleClickOutsideInNotification)
    localStorage.setItem('switchNav', switchNav)
    localStorage.setItem('sidebar', navbar)
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideInCreatePage)
      document.removeEventListener("mousedown", handleClickOutsideInNotification)
    }
  }, [navbar, switchNav, modalInfoIsOpen, notifications])

  return (<>
    <nav className={`${styles.sidebar} ${toggleNav} ${switchDarkMode}`}>
    
      <Header toggleNavbar={toggleNavbar} mainText={mainText} additionalText={additionalText} switchNav={switchNav} switchNavbar={switchNavbar} logoutUser={logoutUser}/>
      <div className={styles.menu_bar}>
          <MainMenu notifications={notifications} setNotifications={setNotifications} modalInfoIsOpen={modalInfoIsOpen} setModalInfoIsOpen={setModalInfoIsOpen} toggleNavbar={toggleNavbar} navbar={navbar}/>
      </div>
    </nav>
    
    
    <main className={styles.home}>
      <div className={styles.text}>
      {notifications && 
        <div id="notification" className={styles.modal_notifications}>
          <div className={styles.div_dropitem_modal}>
            <span className={styles.text_dropitem_modal}>Уведомления</span>
          </div>
          <div id="notifications" className={styles.notifications}>
            {userInfo.invitations.length === 0 && 
              <div className={styles.notifications_div}>
                <div className={styles.image_div}>
                  <img className={styles.image_notifications} src='https://clipartcraft.com/images/puppy-clipart-sleeping-4.png'></img>
                </div>
                <div className={styles.text_image}>
                  Нет непрочитанных уведомлений
                </div>
                
              </div>
            }
            {userInfo.invitations.map((item, index) => 
              <div onMouseEnter={!item.is_read ? () => hoveredMessage(item) : null} key={index} className={styles.notification} >
                <div className={styles.information_notification} >
                  {!item.is_read && <div className={styles.notification_read}></div>}
                  <div className={styles.image_div_notification}>
                    <AiOutlineUsergroupAdd className={styles.image_notification}/>
                  </div>
                  <div className={styles.info_notification}>
                    <span className={styles.text_notification}>Приглашение от {item.inviter.username}</span>
                    <span className={styles.text_notification_more}>Приглашение на доску {item.board.title} от пользователя {item.inviter.username}</span>
                  </div>
                  <div className={styles.time}>
                    <span className={styles.text_notification_more}>{dateFunc(item)}</span>
                  </div>
                </div>
                {item.status === 'pending' && 
                  <div className={styles.buttons_notification}>
                    <Link onClick={() => handleAddBoardUserNotification(item)} className={styles.add_board_notification}>
                      <span>Принять</span>
                    </Link>
                    <Link onClick={() => handlePassBoardUserNotification(item)} className={styles.pass_board_notification}>
                      <span>Отказаться</span>
                    </Link>
                  </div>
                }
                {item.status === 'accepted' && 
                  <div className={styles.notification_sms}>
                    <span className={styles.text_notification}>Вы приняли предложение</span>
                  </div>
                }
                {item.status === 'rejected' && 
                  <div className={styles.notification_sms}>
                    <span className={styles.text_notification}>Вы отказались от предложения</span>
                  </div>
                }
                
                
              </div>
            )}
            <div className={styles.icon_close_div} onClick={() => {setNotifications(false)}}>
                <AiOutlineClose className={styles.icon_close}/>
            </div>
          </div>
        </div>


      }
      {modalInfoIsOpen &&
        <NewPage userInfo={userInfo} setModalInfoIsOpen={setModalInfoIsOpen}/>
      }
      { children }
      </div>
      
    </main>
  </>)
    
  
}
export default Menu
