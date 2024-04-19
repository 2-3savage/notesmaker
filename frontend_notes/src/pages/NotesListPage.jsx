import React, { useEffect,  useState } from 'react'
import { NoteService } from '../services/note.service'
import NoteItem from '../components/note-items/NoteItem'

const NotesListPage = () => {
    let [notes, setNotes] = useState([])

    useEffect(() => {
        getNotes()
    }, [])
    
    let getNotes = async () => {
        let responce = await NoteService.getAll()
        setNotes(responce)
    }
    if (notes.length === 0) {
        return (
            <div>
                <h1>No notes</h1>
            </div>
        )
    }
    return (
        <div className='notes'>
            <div className='notes-header'>
                <h2 className='notes-title'>&#9782; Notes</h2>
                <p className='notes-count'>{notes.length}</p>
            </div>
            <div className='notes-list'>
                {notes.map((note, index) => (
                    <NoteItem key={index} note={note} id ={ note.id }/>
                ))}
            </div>

        </div>
    )
}

export default NotesListPage
