import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {  AiOutlineClose } from 'react-icons/ai'
import { NoteService } from '../../services/note.service'
import axios from 'axios';
const Investment = ({ setBoards, investment, setInvestment, item, boards, board }) => {
    const [link, setLink] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setIsLoading(true)
        const data = await NoteService.addInvestment(file, null, item.id)
        const updatedBoards = boards.map(b => {
            if (b.id === board.id) {
                const index = b.table.indexOf(item);
                b.table[index].investment.push({ id: data.id, document: data.document, site: data.site , filename: data.filename, timestamp: data.timestamp, extension: data.extension, active: data.active});
            }
            return b;
        });
        setBoards(updatedBoards);
        setInvestment(false);
        setIsLoading(false)
        setError(null)
        // Действия с выбранным файлом
    };
    const handleClickAdd = async (event) => {
        if (link === "" || link === null) return
        setIsLoading(true)
        const data = await NoteService.addInvestment('', link, item.id)
        if (data === "Error request") {
            setError("Не получается получить файл.")
            setIsLoading(false)
            setLink(null)
            return
        }else if(data === "Invalid url"){
            setError("Недействительная ссылка. Проверьте правильность ссылки.")
            setIsLoading(false)
            setLink(null)
            return
        }
        const updatedBoards = boards.map(b => {
            if (b.id === board.id) {
                const index = b.table.indexOf(item);
                b.table[index].investment.push({ id: data.id, document: data.document, site: data.site, filename: data.filename, timestamp: data.timestamp, extension: data.extension, active: data.active});
            }
            return b;
        });
        setBoards(updatedBoards);
        setInvestment(false);
        setLink(null)
        setIsLoading(false)
        
    }
    const handleChangeUnputLink = (e) => {
        setLink(e.target.value)
        setError(null)
    }
  return (
    <div>
        {investment && 
            <div draggable={false} className='investment'>
                {isLoading && 
                    <div className="loader-container">
                        <div className="spinner"></div>
                    </div>
                }
                <div draggable={false} className='div_dropitem_modal'>
                    <span className='text_dropitem_modal'>
                        Вложение
                    </span>
                </div>
                <div draggable={false} className="investment_modal">
                    <span className="text_investment">
                        Прикрепите файл с компьютера
                    </span>
                    <input draggable={false} type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                    <Link draggable={false} onClick={() => document.getElementById('fileInput').click()} className="btn_modal">
                        <span>Выбрать файл</span>
                    </Link>
                    <hr />
                    <label className='label_link'>
                        Либо вставьте ссылку
                    </label>
                    <input onChange={handleChangeUnputLink} className='input_file' />
                    <Link draggable={false} onClick={() => {setInvestment(false)}} className='icon_close_div'>
                        <AiOutlineClose className='icon_close'></AiOutlineClose>
                    </Link>  
                    {error && <div className="div_error">{error}</div>}
                    <Link draggable={false} onClick={() => handleClickAdd()} className="btn_modal">
                        <span>Добавить</span>
                    </Link> 
                </div>
                
            </div>
        }
    </div>
  )
}

export default Investment