
import { Link } from 'react-router-dom';
import { AiOutlineReload } from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha, LoadCanvasTemplateNoReload } from 'react-simple-captcha';

const Calendar = () => {
  const [captchaRendered, setCaptchaRendered] = useState(false);

  useEffect(() => {
    if (!captchaRendered) {
      loadCaptchaEnginge(5, "#e8e8e8", "#707070", "lower");
      setCaptchaRendered(true);
    }
  }, [captchaRendered]);

  const reloadCaptcha = () => {
    loadCaptchaEnginge(5, "#e8e8e8", "#707070", "lower");
  }

  return (
    <div>
      <div className='div_field'>
         <input className="input" placeholder={"че"} name="user_captcha" type="text"></input> 
      </div>
      <div className="captcha">
         <LoadCanvasTemplateNoReload/>
         <div className="button_reload" onClick={reloadCaptcha}>
            <AiOutlineReload className="icon_reload"/>
         </div>
      </div>
    </div>
  );
}

export default Calendar;
