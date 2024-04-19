import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import { Cookies, useCookies } from 'react-cookie';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha, LoadCanvasTemplateNoReload } from 'react-simple-captcha';
import { NoteService } from '../../services/note.service';


const AuthContext = createContext()

export default AuthContext


export const AuthProvider = ({children}) => {
    
    if (!localStorage.getItem('language')){
        localStorage.setItem('language', "Русский")
    }
    const [listFavoritePages, setFavoritePages] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [language, setLanguage] = useState(localStorage.getItem('language'))
    const languageLocal = (languageSet) =>{
        localStorage.setItem('language', languageSet)
        setLanguage(languageSet)
    }
    const [ authTokens, setAuthTokens ] = useState(()=> localStorage.getItem('authTokens') ?  JSON.parse(localStorage.getItem('authTokens')) : null)
    const [loading, setLoading] = useState(true)
    
    const history = useNavigate()

    let activateCheckEmail = async (email) => {
        let responce = await fetch(`http://127.0.0.1:8000/auth/active/email/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'email': email,})
                }
            )
        let data = await responce.json()
        return data
    }
    let activateCheckUsername = async (username) => {
        let responce = await fetch(`http://127.0.0.1:8000/auth/active/username/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'username': username,})
                }
            )
        let data = await responce.json()
        return data
    }
    let loginUserActivate = async (username, password) => {
        let responce = await fetch('http://127.0.0.1:8000/auth/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'username': username, 'password': password})
            }
        )
        let data = await responce.json()
        if (responce.status === 200) {
            setAuthTokens(data)
            localStorage.setItem('authTokens', JSON.stringify(data))
            localStorage.removeItem('email')
            history('/')
        }else{
            localStorage.removeItem('email')
            history('/')
        }
        
    }
    let newPasswordEmailInput = async (email) => {
        let responce = await fetch('http://127.0.0.1:8000/auth/user/users/reset_password/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'email': email})
        })
        if (responce.status === 204) {
            localStorage.setItem('email', email)
            return 1
        }else{
            return -1
        }
    }
    let newPasswordReset = async (e, uid, token) => {
        e.preventDefault()
        let responce = await fetch('http://127.0.0.1:8000/auth/user/users/reset_password_confirm/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'new_password': e.target.password.value, 're_new_password': e.target.re_password.value, 'uid': uid, 'token': token})
        })
        if (responce.status === 204) {

            return 1
        }else{
            return -1
        }
    }
    let activateUser = async (uid, token) => {
        let responce = await fetch('http://127.0.0.1:8000/auth/user/users/activation/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'uid': uid, 'token': token})
        })
        if (responce.status === 204) {
            let responce = await fetch(`http://127.0.0.1:8000/auth/activate/${uid}/${token}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
            )
            let data = await responce.json()
            localStorage.setItem('email', data.email)
        }
    }
    let registrationUser = async (email, username, password, re_password) => {
        let data = await activateCheckUsername(username)
        if (data === "Пользователь не зарегистрирован"){
            let responce = await fetch('http://127.0.0.1:8000/auth/user/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'username': username, 'password': password, 're_password': re_password, 'email': email})
            }
            )
            let data = await responce.json()
            const colors = ['1967c3', 'f00', '17bee3', 'afeeee', '53e0a1', '3eb489', '6600ff', '7442c8', '8a2be2', '7d8471', '7b917b', 'b8b5ae', 'a19c97'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            await fetch(`http://127.0.0.1:8000/api/user/${data.id}/create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'avatar': `https://ui-avatars.com/api/?size=96&name=${data.username}&font-size=0.33&background=${randomColor}&color=fff&rounded=true`})
                }
            )
            return data
        }else{
            resendActivation(email)
            return "Сообщение отправлено повторно на почту"
        }
        
        
    }
    let resendActivation = async (email) => {
        let responce = await fetch('http://127.0.0.1:8000/auth/user/users/resend_activation/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'email': email})
            }
        )
    }

    let loginUser = async (username, password) => {
        let responce = await fetch('http://127.0.0.1:8000/auth/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'username': username, 'password': password})
            }
        )
        let data = await responce.json()
        if (responce.status === 200) {
            setAuthTokens(data)
            localStorage.removeItem('email')
            localStorage.setItem('authTokens', JSON.stringify(data))
            history('/')
        }
        return data
    } 

    let logoutUser = () => {
        setAuthTokens(null)
        localStorage.removeItem('authTokens')
        localStorage.removeItem('lastTokenRefreshTime')
        history('/login')
    }

    let updateToken = async () => {
        if (!authTokens) return
        let responce = await fetch('http://127.0.0.1:8000/auth/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({'refresh': authTokens.refresh})
            }
        )
        
        let data = await responce.json()

        if (responce.status === 200){
            setAuthTokens(data)
            localStorage.setItem('authTokens', JSON.stringify(data))
        }
        else{
            logoutUser()
        }
        if (loading){
            setLoading(false)
        }
    } 

    let contextData = {
        registrationUser: registrationUser,
        authTokens:authTokens,
        loginUser: loginUser,
        logoutUser:logoutUser,
        activateUser:activateUser,
        newPasswordReset:newPasswordReset,
        newPasswordEmailInput:newPasswordEmailInput,
        resendActivation:resendActivation,
        history:history,
        loginUserActivate:loginUserActivate,
        activateCheckEmail:activateCheckEmail,
        activateCheckUsername:activateCheckUsername,
        languageLocal:languageLocal,
        language:language,
        listFavoritePages:listFavoritePages,
        setFavoritePages:setFavoritePages,
        setUserInfo:setUserInfo,
        userInfo:userInfo,
    }

    useEffect(() => {
        if (!authTokens) return
        if (loading){
            updateToken()
        }
        const fetchData = async () => {
            const data = await NoteService.getFavoritesBoards(authTokens)
            const data2 = await NoteService.getUserInfo(authTokens)
            setUserInfo(data2)
            setFavoritePages(data.boards_like)
        }
        fetchData()
        
        let lastTokenRefreshTime = localStorage.getItem('lastTokenRefreshTime');
        let currentTime = new Date().getTime();
        let timeSinceLastRefresh = currentTime - lastTokenRefreshTime;
        let minutes = 1000 * 60 // минута
        if (timeSinceLastRefresh > minutes) { 
            updateToken();
            localStorage.setItem('lastTokenRefreshTime', currentTime); // Сохранение времени последнего обновления токена
        }
        
        let interval = setInterval(() => {
            if (authTokens){
                updateToken()
            }
        }, minutes)
        return ()=> clearInterval(interval)
    }, [authTokens, loading])
    

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
