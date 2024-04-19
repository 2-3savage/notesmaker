import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../components/context/AuthContext';
import "../styles/Authentification.css"
import { ru_language, en_language } from '../services/language';
import { AiOutlineReload } from "react-icons/ai";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha, LoadCanvasTemplateNoReload } from 'react-simple-captcha';

const Autentification = () => {
   const { loginUser, resendActivation, activateCheckEmail, language } = useContext(AuthContext);
   const [ nextStep, setNextStep ] = useState(false)
   const [ error, setError ] = useState(null)
   const [ email, setEmail] = useState(null)
   const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);

   useEffect(() => {
      setLang(language === "Русский" ? ru_language : en_language);
      loadCaptchaEnginge(5, "#e7e7e7", "#707070", "lower");
      setError(null)
   }, [language]);

  
   const handleLogin = async (e) => {
      e.preventDefault();
      if (e.target.password.value === '') {
         setError(lang.not_fields)
         return
      }
      let data = await activateCheckEmail(email)
      if (data.active){
         data = await loginUser(data.username, e.target.password.value);
         if (data.detail === "No active account found with the given credentials"){
            setError(lang.error_password)
         }
      }else{
         await resendActivation(data.email)
         setError(lang.not_active_account)
      }
      
   }
   const handleEmailAndCaptcha = async (e) => {
      e.preventDefault();
      const user_captcha = e.target.user_captcha.value
      if (e.target.user_captcha.value === ''){
         setError(lang.captcha_not_field)
         loadCaptchaEnginge(5, "#e7e7e7", "#707070", "lower");
         return
      }
      if (validateCaptcha(user_captcha) === true) {
         e.target.user_captcha.value = null;
         loadCaptchaEnginge(5, "#e7e7e7", "#707070", "lower")
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
      if (data !== "Пользователь не зарегистрирован"){
         setNextStep(true)
         setEmail(data.email)
      }else{
         setError(lang.not_auth)
      }
   } 
   const handleInput = (e) => {
      if (nextStep){
         setTimeout(() => {
            loadCaptchaEnginge(5, "#e7e7e7", "#707070", "lower")
         })
         setNextStep(false)
         setError(null)
      }
   }
   return (
      <>
        <div className='auth'>
            <span className='log'>{lang.auth}</span>
            <div className='line_' />
            
            <form onSubmit={handleEmailAndCaptcha}>
               <div className='div_field'>
                  <input onChange={handleInput} className="input" type="email" name="email" placeholder={lang.enter_email}></input>
               </div>
               { !nextStep && (
                  <>
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
                     
                     </div>
                     <button className="button_save" type='submit'>{lang.next_email}</button>
                  </>
                  
               ) 
               }
            </form>
            { nextStep && (
               <form onSubmit={handleLogin}>
                  <div className='div_field'>
                        <input onChange={() => {setError(null)}} className="input" type='password' name="password" placeholder={lang.enter_pass}></input>
                  </div>
                  <button className="button_save" type='submit'>{lang.next_pass}</button>
               </form>
            )} 
            
            <div className='div_error'>
               {error}
            </div>
            <div className='div_pass'>
               <Link to="/reset_password" className='for_password'>{lang.forgot_pass}</Link>
               <span style={{marginTop: 10}}> {lang.not_register} <Link to="/registration" className='registration'>{lang.register}</Link></span>
            </div>
            
         </div>
      </>
      
   );
}

export default Autentification;
