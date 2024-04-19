import React, {useContext, useState, useEffect} from 'react'
import { useParams, useNavigate, Link} from 'react-router-dom'
import AuthContext from '../components/context/AuthContext';
import { ru_language, en_language } from '../services/language';
import { AiOutlineReload } from "react-icons/ai";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha, LoadCanvasTemplateNoReload } from 'react-simple-captcha';

const ResetEmail = () => {
    let { newPasswordEmailInput, activateCheckEmail, history, resendActivation, language } = useContext(AuthContext);
    const [ error, setError ] = useState(null)
    const [ message, setMessage ] = useState(null)
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
      if (data.active){
        data = await newPasswordEmailInput(e.target.email.value)
        if (data === 1){
          setMessage(lang.activation_reset)
          setReadOnly(true)
          setTimeout(() => {
            history("/")
           }, 5000)
        }else{
          setError(lang.error_mail_send)
        }
      }else if (data.active === false){
        setMessage(lang.not_active_account)
        resendActivation(e.target.email.value)
        setReadOnly(true)
        setTimeout(() => {
          history("/")
         }, 5000)
      }else{
         setError(lang.not_auth)
      }
   } 
  return (
    <>
      <div className='auth'>
            <span className='log'>{lang.recovery}</span>
            <div className='line_' />
            
            <form onSubmit={handleEmail}>
               <div className='div_field'>
                  <input style={readOnly ? {cursor: 'not-allowed'} : null} readOnly={readOnly} onChange={() => {setError(null)}} className="input" type="email" name="email" placeholder={lang.enter_email}></input>
               </div>
               <div className='div_field'>
                  <input style={readOnly ? {cursor: 'not-allowed'} : null} readOnly={readOnly} className="input" placeholder={lang.captcha_input} name="user_captcha" type="text"></input> 
               </div>
               <div className="captcha">
                  <LoadCanvasTemplateNoReload/>
                  <div className="button_reload" onClick={() => loadCaptchaEnginge(5, "#e8e8e8", "#707070", "lower")}>
                     <AiOutlineReload className="icon_reload"/>
                  </div>
               </div>
                <button style={readOnly ? {cursor: 'not-allowed'} : null}  disabled={readOnly} className="button_save" type='submit'>{lang.next_email}</button>
               
               
            </form>
            <div className='div_error'>
               {error}
            </div>
            <div className='div_green'>
               {message}
            </div>
            <div className='div_pass'>
               <span style={{marginTop: 10}}> {lang.not_register} <Link to="/registration" className='registration'>{lang.register}</Link></span>
               <span style={{marginTop: 10}}> {lang.authentification} <Link to="/login" className='registration'>{lang.authorization}</Link></span>
            </div>
            
         </div>
    </>
  )
}

export default ResetEmail