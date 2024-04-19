import React, { useContext, useState } from 'react';
import AuthContext from '../components/context/AuthContext';
import { useParams, Link } from 'react-router-dom';

const ResetPassword = () => {
  let { newPasswordReset, loginUserActivate, activateCheckEmail, history } = useContext(AuthContext);
  const { uid, token } = useParams();
  const [ readOnly, setReadOnly ] = useState(false)
  const [ error, setError ] = useState(null)
  const [ message, setMessage ] = useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.password.value !== e.target.re_password.value) {
      setError("Пароли не совпадают")
      return
    }
    if (e.target.password.value === "" || e.target.re_password.value === "") {
      setError("Заполните поля")
      return
    }
    let data = await newPasswordReset(e, uid, token);
    if (data === 1){
      setMessage("Пароль успешно изменен. Вы будете перенаправлены через несколько секунд.")
      setReadOnly(true)
      let data_active = await activateCheckEmail(localStorage.getItem('email'))
      setTimeout(() => {
        loginUserActivate(data_active.username, e.target.password.value)
      }, 4000)
    }else{
      setError("Произошла ошибка. Попробуйте позже. Вы будете перенаправлены через несколько секунд.")
      setTimeout(() => {
        history("/")
      }, 5000)
      setReadOnly(true)
    }
  };

  return (
    <div>
      <div className='auth'>
            <span className='log'>Reset</span>
            <div className='line_' />
            
            <form onSubmit={handleSubmit}>
               <div className='div_field'>
                  <input style={readOnly ? {cursor: 'not-allowed'} : null} readOnly={readOnly} className="input" type="password" name="password" placeholder='Enter your password...'></input>
               </div>
               <div className='div_field'>
                  <input style={readOnly ? {cursor: 'not-allowed'} : null} readOnly={readOnly} className="input" type="password" name="re_password" placeholder='Enter your password again...'></input>
               </div>
               
              <button style={readOnly ? {cursor: 'not-allowed'} : null}  disabled={readOnly} className="button_save" type='submit'>Continue with password</button>
               
               
            </form>
            <div className='div_error'>
               {error}
            </div>
            <div className='div_green'>
               {message}
            </div>
            
            
         </div>
    </div>
  );
};

export default ResetPassword;
