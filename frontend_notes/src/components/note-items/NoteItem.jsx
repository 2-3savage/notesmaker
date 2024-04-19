import React from 'react'


const NoteItemLink = ({ note }) => {
    return (
      <div>
        <div className='note'>
          <div className='note-header'>
            <h3>{note.body.split('\n')[0]}</h3>
            <textarea defaultValue={note?.body}></textarea>
          </div>
        </div>
      </div>
      
    )
}

export default NoteItemLink
