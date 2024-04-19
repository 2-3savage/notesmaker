import React, {useContext} from 'react'
import { AiOutlineUnorderedList, AiFillStar, AiFillBell, AiOutlineSearch,AiFillProfile, AiFillCalendar, AiFillClockCircle, AiFillPlusCircle } from 'react-icons/ai'
import { BsFillHouseFill} from 'react-icons/bs'
import styles from '../Menu.module.css'
import MenuItem from './itemsMenu/MenuItem'
import SearchItem from './itemsMenu/SearchItem'
import  { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { NoteService } from '../../../services/note.service'
import AuthContext from '../../context/AuthContext'

const MainMenu = ( {notifications, setNotifications, toggleNavbar , navbar, setModalInfoIsOpen, modalInfoIsOpen} ) => {
  let {logoutUser, authTokens, history, listFavoritePages, setFavoritePages, userInfo, setUserInfo} = useContext(AuthContext)
  const [iconSelection, setIconSelection] = useState(styles.close_icon_modal)

  function handleClickOutside(event) {
    const container = document.querySelector(`.${styles.marketing_hub_container_modal}`);
    const container2 = document.querySelector(`.${styles.img_icon_page_div}`);
    if (container === null) return
    if (!container.contains(event.target) && !container2.contains(event.target)){
      setIconSelection(styles.close_icon_modal)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [iconSelection])
  
  
  return (
    <>
      <div className={styles.menu}>
            <SearchItem Icon={AiOutlineSearch} toggleNavbar={toggleNavbar} navbar={navbar}/>
            <ul className={styles.menu_links}>
                <MenuItem Icon={ BsFillHouseFill } text={'Home'} route={'/home'}/>
                <MenuItem Icon={ AiFillCalendar } text={'Calendar'} route={'/calendar'}/>
                <li className={styles.nav_link}>
                  <Link onClick={notifications ? () => setNotifications(false) : () => {setNotifications(true);setModalInfoIsOpen(false)}} className={styles.a}>
                      <AiFillBell className={styles.icon}/>
                      <span className={`${styles.text} ${styles.nav_text}`}>{'Notifications'}</span>
                  </Link>
                </li>
                <li className={styles.nav_link}>
                  <Link onClick={modalInfoIsOpen ? () => setModalInfoIsOpen(false) : () => {setModalInfoIsOpen(true);setNotifications(false)}} className={styles.a}>
                      <AiFillPlusCircle className={styles.icon}/>
                      <span className={`${styles.text} ${styles.nav_text}`}>{'New page'}</span>
                  </Link>
                </li>
                {listFavoritePages?.map((item, index) => 
                  <li key={index} className={styles.nav_link}>
                    <Link to={`/pages/${item.id}`} className={styles.a}>
                        <div className={styles.icon_cover}>
                          <img className={styles.btn_sidebar} src={`${item.cover}`} />
                          <span className={styles.absolute_icon}>{item.icon}</span>
                        </div>
                        <span className={`${styles.text} ${styles.nav_text}`}>{item.title}</span>
                        
                    </Link>
                  </li>
                )}
                
            </ul>
            
            
      </div>
    </>
  )
}

export default MainMenu
