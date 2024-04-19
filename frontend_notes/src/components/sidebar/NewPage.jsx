import React, { useEffect, useState, useContext} from 'react';
import styles from './Menu.module.css';
import { Link } from 'react-router-dom';
import { theme } from './theme';
import { AiOutlineCheck,  AiOutlineClose, AiOutlineUsergroupAdd } from "react-icons/ai";
import AuthContext from '../context/AuthContext';
import { NoteService } from '../../services/note.service';

const NewPage = ({userInfo, setModalInfoIsOpen}) => {
  
    let {history, authTokens} = useContext(AuthContext)
    const [chooseTheme, setChooseTheme] = useState(theme[0])
    const [chooseThemeIndex, setChooseThemeIndex] = useState(0)
    const [input, setInput] = useState(null)
    const handleChangeInput = (e) => {
        setInput(e.target.value)
      }
    const chooseThemeHandler = (theme, index) => {
        setChooseTheme(theme)
        setChooseThemeIndex(index)
      }
    const handleTableCreate  = async () => {
        if (!input) return
        const data_create = await NoteService.createPage({title: input, cover: chooseTheme.full_picture, type: "board", icon: null, user_id: userInfo.id})
        setModalInfoIsOpen(false)
        await history(`/pages/${data_create.id}/`)
        setInput(null)
      }
  return (
    <div id="create_page" className={styles.create_page_open}>
          
          <div className={styles.div_dropitem_modal}>
            <span className={styles.text_dropitem_modal}>Создать доску</span>
          </div>
          
          <div className={styles.tags_div}>
            <hr />
            <div className={styles.prewiew_center}>
              <div className={styles.prewiew_div}>
                <img className={styles.img} src={chooseTheme.background_color}></img>
                <div className={styles.preview_mini_tables}>
                  <img src='https://trello.com/assets/14cda5dc635d1f13bc48.svg'></img>
                </div>
              </div>
            </div>
            
            <div>
              <label  className={styles.label}>Фон</label>
              <div>
                <ul className={styles.colors}>
                  {theme.map((item, index) => 
                    <li style={chooseThemeIndex === index ? {filter: 'brightness(0.8)'} : null} onClick={() => chooseThemeHandler(item, index)} key={index} className={styles.li_color}>
                      <img className={styles.button_color} src={item.background_color} />
                      {
                        chooseThemeIndex === index &&
                        <AiOutlineCheck className={styles.outline_check}/>
                      }
                    </li>
                  )}
                </ul>
              </div>
              <label className={styles.label}>Заголовок доски</label>
              <input onChange={handleChangeInput} className={styles.input_new_page}></input>
              {!input && 
                <div className={styles.div_input}>
                  <span>👋</span>
                  <span className={styles.text_input}> Укажите название доски.</span>
                </div>
              }
              <Link onClick={() => handleTableCreate()} className={styles.btn_create}>
                <span>Создать</span>
              </Link>
              <div className={styles.icon_close_div} onClick={() => {setModalInfoIsOpen(false)}}>
                <AiOutlineClose className={styles.icon_close}/>
              </div>
            </div>
            
          </div>
        </div>
  )
}

export default NewPage