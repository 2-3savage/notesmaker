import React, {useContext, useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../components/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom'
import { ru_language, en_language } from '../services/language';
import { AiOutlineReload } from "react-icons/ai";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha, LoadCanvasTemplateNoReload } from 'react-simple-captcha';

const Registration = () => {
    let { registrationUser, loginUserActivate, resendActivation, activateCheckEmail, activateCheckUsername, language } = useContext(AuthContext)
    const [ message, setMessage ] = useState(null);
    const [ nextStep, setNextStep ] = useState(false)
    const [ nextStepPass, setNextStepPass ] = useState(false)
    const [ error, setError ] = useState(null)
    const [ email, setEmail] = useState(null)
    const [ username, setUsername] = useState(null)
    const [ registration, setRegistration ] = useState(null)
    const [ readOnly, setReadOnly ] = useState(false)

    const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);

    useEffect(() => {
        setLang(language === "Русский" ? ru_language : en_language);
        loadCaptchaEnginge(5, "#e7e7e7", "#707070", "lower");
        setError(null)
    }, [language]);

    const handleEmail = async (e) => {
      e.preventDefault();
      const user_captcha = e.target.user_captcha.value
      if (e.target.user_captcha.value === ''){
        setError(lang.captcha_not_field)
         loadCaptchaEnginge(5, "#e7e7e7", "#707070", "lower");
         return
      }
      if (validateCaptcha(user_captcha) === true) {
        loadCaptchaEnginge(5, "#e7e7e7", "#707070", "lower")
         e.target.user_captcha.value = null;
         setError(null)
      } else {
        setError(lang.captcha_wrong)
         loadCaptchaEnginge(5, "#e7e7e7", "#707070", "lower");
         e.target.user_captcha.value = null;
         return
      }

      if (e.target.email.value === '') {
         setError(lang.not_fields)
         return
      }
      let data = await activateCheckEmail(e.target.email.value)
      if (data === "Пользователь не зарегистрирован" || data.active === false){
         setNextStep(true)
         setError(null)
         setEmail(e.target.email.value)
      }else{
         setError(lang.active_email)
      }
   } 
    const handleUsername = async (e) => {
      e.preventDefault();
      if (e.target.username.value === '') {
        setError(lang.not_fields)
        return
      }
      let data = await activateCheckUsername(e.target.username.value)
      if (data === "Пользователь не зарегистрирован" || data === false){
        setNextStepPass(true)
        setError(null)
        setUsername(e.target.username.value)
      }else{
        setError(lang.active_username)
      }
  } 

    const handleRegistration = async (e) => {
      e.preventDefault();
      if (e.target.password.value !== e.target.re_password.value) {
        setError(lang.password_match)
        return
      }
      if (e.target.password.value === "" || e.target.re_password.value === "") {
        setError(lang.not_fields)
        return
      }
      const registrationSuccess = await registrationUser(email, username, e.target.password.value, e.target.re_password.value);
      try{
        if (('email' in registrationSuccess && 'username' in registrationSuccess && 'id' in registrationSuccess)) {
          setRegistration({username: username, password: e.target.password.value, email: email})
        }
      } catch (error){
        if ((registrationSuccess === "Сообщение отправлено повторно на почту")){
          setRegistration({username: username, password: e.target.password.value, email: email})
        }
      } 
      if (registrationSuccess?.email?.includes('Введите правильный адрес электронной почты.')){
        setError(lang.not_email_aviable)
      }else if (registrationSuccess?.password?.includes('Введённый пароль слишком широко распространён.')){
        setError(lang.password_common)
      }else if (registrationSuccess?.password?.includes('Введённый пароль состоит только из цифр.')){
        setError(lang.password_numbers)
      }else if (registrationSuccess?.password){
        setError(lang.password_short)
      }else{
        setReadOnly(true)
        setMessage(lang.activation)
      }
      
    }
    const handleInput = (e) => {
      if (nextStep){
         setTimeout(() => {
            loadCaptchaEnginge(5, "#e7e7e7", "#707070", "lower")
         })
         setNextStep(false)
         setNextStepPass(false)
         setError(null)
      }
   }
    useEffect(() => {
      function checkUserData() {
        if (localStorage.getItem('email') === registration.email){
          loginUserActivate(registration.username, registration.password)
        }
      }
      window.addEventListener('storage', checkUserData)
      return () => {
        window.removeEventListener('storage', checkUserData)
      }
    }, [registration])
    
  return (
    <>
      <div className='auth'>
            <span className='log'>{lang.reg}</span>
            <div className='line_' />
            
            <form onSubmit={handleEmail}>
               <div className='div_field'>
                  <input style={readOnly ? {cursor: 'not-allowed'} : null} readOnly={readOnly} onChange={handleInput} className="input" type="email" name="email" placeholder={lang.enter_email}></input>
               </div>
               
               { !nextStep && (
                  <div>
                    <div className='div_field'>
                        <input className="input" placeholder={lang.captcha_input} name="user_captcha" type="text"></input> 
                    </div>
                    <div className="captcha">
                        <LoadCanvasTemplateNoReload/>
                        <div className="button_reload" onClick={() => loadCaptchaEnginge(5, "#e8e8e8", "#707070", "lower")}>
                          <AiOutlineReload className="icon_reload"/>
                        </div>
                    </div>
                    <button className="button_save" type='submit'>{lang.next_email}</button>
                  </div>
                  
               ) 
            }
            </form>
            { nextStep && (
              <>
               <form onSubmit={handleUsername}>
                  <div className='div_field'>
                    <input style={readOnly ? {cursor: 'not-allowed'} : null} readOnly={readOnly}  onChange={() => {setNextStepPass(false); setError(null); }} className="input" type='username' name="username" placeholder={lang.enter_username}></input>
                  </div>
                  
                  { !nextStepPass && (
                    <button className="button_save" type='submit'>{lang.next_username}</button>
                  )}
               </form>
               {nextStepPass && (
                <>
                  <form onSubmit={handleRegistration}>
                    <div className='div_field'>
                      <input style={readOnly ? {cursor: 'not-allowed'} : null} readOnly={readOnly}  onChange={() => {setError(null); }} className="input" type='password' name="password" placeholder={lang.enter_pass}></input>
                    </div>
                    <div className='div_field'>
                      <input style={readOnly ? {cursor: 'not-allowed'} : null} readOnly={readOnly}  onChange={() => {setError(null); }} className="input" type='password' name="re_password" placeholder={lang.enter_re_pass}></input>
                    </div>
                    <button style={readOnly ? {cursor: 'not-allowed'} : null} disabled={readOnly} className="button_save" type='submit'>{lang.next_pass}</button>
                  </form>
                </>
               )}
              </>
            )} 
            <div className='div_error'>
               {error}
            </div>
            <div className='div_green'>
               {message}
            </div>
            <div className='div_pass'>
               <Link to="/reset_password" className='for_password'>{lang.forgot_pass}</Link>
               <span style={{marginTop: 10}}> {lang.authentification} <Link to="/login" className='registration'>{lang.authorization}</Link></span>
            </div>
            
         </div>
    </>
  )
}

export default Registration