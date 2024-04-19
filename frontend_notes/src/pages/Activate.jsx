import React, {useContext, useEffect} from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import AuthContext from '../components/context/AuthContext';
const Activate = () => {
    const { uid, token } = useParams()
    
    let {activateUser} = useContext(AuthContext)
    activateUser(uid, token)
    
    return (
        <div>Activate account {uid}, {token}</div>
    )
}

export default Activate
