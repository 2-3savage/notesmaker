import React from 'react'
import { useEffect, useState, useContext} from 'react'
import { BsFillSunFill, BsFillMoonStarsFill} from "react-icons/bs";
import { AiOutlineSetting, AiOutlineBehance, AiOutlineLogout, AiOutlineDoubleRight, AiOutlineEllipsis, AiOutlinePlusCircle,  AiOutlineTeam} from "react-icons/ai"
import styles from '../Menu.module.css'
import { CiCoffeeCup } from "react-icons/ci";
import Switch from '@mui/material/Switch';
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext';
import { NoteService } from '../../../services/note.service';
import { en_language, ru_language } from '../../../services/language';

const Header = ({ toggleNavbar, mainText, additionalText, switchNav, switchNavbar, logoutUser}) => {
  let {history, languageLocal, authTokens, language} = useContext(AuthContext)
  const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);
  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  const [email, setEmail] = useState(null)
  
  // Отслеживание кликов на модал барах
  const [switchDropItem1, setSwitchDropItem1] = useState(styles.close1);
  const [switchDropItem2, setSwitchDropItem2] = useState(styles.close2);
  const switchDrop1 = () => {
    setSwitchDropItem1(switchDropItem1 === styles.close1 ? styles.open1 : styles.close1)
    setSwitchDropItem2(styles.close2);
  }
  const switchDrop2 = () => {
    setSwitchDropItem2(switchDropItem2 === styles.close2 ? styles.open2 : styles.close2)
  }
  function handleClickOutside1(event) {
    const container = document.querySelector(`.${styles.image_text}`);
    const container2 = document.querySelector(`header`);
    const container3 = document.querySelector(`.${styles.toggle}`);
    if (!container.contains(event.target) && !container2.contains(event.target)) {
      setSwitchDropItem1(styles.close1);
    }
    if (container3.contains(event.target)){
      setSwitchDropItem1(styles.close1);
    }
  }
  
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await NoteService.getUserInfo(authTokens)
      setEmail(data.email)
      
    }
    setLang(language === "Русский" ? ru_language : en_language);
    fetchData()
    
    document.addEventListener('click', handleClickOutside1);
    
    return () => {
      document.removeEventListener('click', handleClickOutside1);

    };
  }, [language])
  // 
  return (
    <div>
      <header className={`${switchDropItem1} ${switchDropItem2}`}>
        <Link draggable={false} onClick={switchDrop1} className={`${styles.image_text}`}>
          <span className={styles.image}>
            <CiCoffeeCup className={ styles.img_logo }/>
          </span>
          <div className={`${styles.header_text}`}>
            <span className={`${styles.text} ${styles.name}`}>{mainText}</span>
            <span className={`${styles.text} ${styles.profession}`}>{additionalText}</span>
          </div>
        </Link>

        <AiOutlineDoubleRight className={styles.toggle} onClick={toggleNavbar}/>
        
        <div className={`${styles.marketing_hub_container2}  `}>
          <div className={styles.dropitem_main}>
            <div className={styles.header_dropitem}>
              <span className={styles.mail_dropitem}>{email}</span>
              <div className={styles.image_dropitem}>
                <AiOutlineEllipsis onClick={switchDrop2} className={styles.img}/>
              </div>
            </div>
            {/* first dropitem */}
            <ul className={styles.ul_dropitem}>
              
              <li className={styles.li_dropitem}>
                <Link className={styles.link} to={'/settings'}>
                    <AiOutlineSetting className={styles.icon}/>
                    <span className={`${styles.text_dropitem} `}>{lang.settings}</span>
                </Link>
              </li>
              <li className={styles.li_dropitem}>
                <Link className={styles.link} onClick={language === "Русский" ? () => languageLocal("English") : () => languageLocal("Русский")}>
                    <AiOutlineBehance className={styles.icon}/>
                    <span className={`${styles.text_dropitem} `}>{lang.change_language}</span>
                </Link>
              </li>
              <li className={styles.li_dropitem}>
                <Link className={styles.link} onClick={logoutUser}>
                      <AiOutlineLogout className={styles.icon}/>
                      <span className={`${styles.text_dropitem} `}>{lang.logout}</span>
                  </Link>
              </li>
              <li className={styles.mode}>
                  <div className={styles.moon_sun}>
                      <BsFillMoonStarsFill  className={`${styles.icon} ${styles.moon}`}/>
                      <BsFillSunFill className={`${styles.icon} ${styles.sun}`}/>
                  </div>
                  <span className={`${styles.mode_text} ${styles.text_dropitem}`}>{switchNav === 'white' ? lang.light_mode:lang.dark_mode}</span>
                  <div className={styles.toogle_switch}>
                      <Switch {...label} className={styles.switch} color="default" onClick={switchNavbar}/>
                  </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
