import React, { useEffect, useState, useContext } from 'react'
import { NoteService } from '../services/note.service'
import { useParams, useNavigate, useLocation} from 'react-router-dom'
import Board from '../components/board/Board'
import "../styles/Pages.css"
import AuthContext from '../components/context/AuthContext';

// TODO: Table, List page

const Pages = () => {
    
    let {authTokens, logoutUser} = useContext(AuthContext)
    const {id} = useParams()
    const [selectedPage, setSelectedPage] = useState(null)
    const [updatePage, setUpdatePage] = useState(false)

    useEffect(() => {
        if (!id) return
        setUpdatePage(true)
        const fetchData = async () => {
            const data = await NoteService.getAll(authTokens)
            if (data === -1){
                logoutUser()
            }else if(data === 0){
            }
            else{
                setSelectedPage(data.find(item => parseInt(item.id) === parseInt(id)))
            }
            
        }
        fetchData()
    }, [id])
    return (
        <div>
        {selectedPage ? (
            selectedPage.type === 'board' ? (
                <Board listBoards={selectedPage} updatePage={updatePage} setUpdatePage={setUpdatePage} id={id} />
            ) : (
                <div>{selectedPage.type}</div>
            )
        ) : (
            "Loading page..."
        )}
    </div>
    )
    
}


export default Pages
