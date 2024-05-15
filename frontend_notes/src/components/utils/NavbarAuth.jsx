import React, { useEffect, useState, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { Navigate, Outlet, Link } from 'react-router-dom'
import { AiOutlineDown } from 'react-icons/ai'


const NavbarAuth = ({ children }) => {
    const { history, language, languageLocal, doSubmitCaptcha } = useContext(AuthContext);
    const [ menu, setMenu ] = useState(false)
    const handleMenu = (e) =>{
        const container = document.querySelector(".menu_language")
        const container2 = document.querySelector(".link_language")
        if (container2.contains(e.target)) return
        if (!container?.contains(e.target)){
            setMenu(false)
        }
    }
    useEffect(() =>{
        if (menu) document.addEventListener("mousedown", handleMenu)
        return () => {
            document.removeEventListener("mousedown", handleMenu) 
    }
    }, [menu])
  return (
    <>
        <div className='navbar_auth'>
            <div className='logo'>
            <img onClick={() => history('/')} style={{ height: 15, cursor: 'pointer' }} src="src/image/notesmaker.png" alt="Описание изображения" />
            </div>
            <div className='language'>
            <div className='language_button'>
                <Link draggable={false} onClick={() => {menu? setMenu(false) : setMenu(true)}} className="link_language">
                    <span className="text_dropitem2">{language}</span>
                    <AiOutlineDown className="icon_language"/>
                </Link>
            </div>
            {menu && (
                <div className='menu_language'>
                <ul className='ul_dropitem_language'>
                    <li className='li_dropitem_language'>
                        <Link draggable={false} onClick={() => {languageLocal("Русский");setMenu(false)}} className="link_language">
                            <span className="text_dropitem2">Русский</span>
                        </Link>
                    </li>
                    <li className='li_dropitem_language'>
                        <Link draggable={false} onClick={() => {languageLocal("English");setMenu(false)}} className="link_language">
                            <span className="text_dropitem2">English</span>
                        </Link>
                    </li>
                </ul>
                </div>
            )}
            </div>
        </div>
        {children}
    </>
    
  )
}

export default NavbarAuth