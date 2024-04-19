import React, { useRef, useEffect, useState } from 'react'
import { DatePicker } from 'react-widgets';
import { Link } from 'react-router-dom'
import {  AiOutlineClose } from 'react-icons/ai'
import { NoteService } from '../../services/note.service';
const ClockDatePicker = ({ boards, board, item, setBoards, datePicker, setDatePicker, isOpen, setIsOpen }) => {
    const [startDate, setStartDate] = useState(item.datepicker ? new Date(item.datepicker.date) : new Date());
    const [checked, setChecked] = useState(item.datepicker ? true : false);
    
    const handleChange = () => {
        setChecked(!checked);
        setStartDate(new Date())
    };
    const handleCalendarOpen = () => {
        setIsOpen(true);
    };
    const handleCalendarClose = () => {
        setIsOpen(false);
    }
    
    const saveDateTime = async () => {
        if (checked) {
            if (board.table[board.table.indexOf(item)].datepicker !== null ) {
                board.table[board.table.indexOf(item)].datepicker = {id: board.table[board.table.indexOf(item)].datepicker.id, date: startDate, complete: board.table[board.table.indexOf(item)].datepicker.complete}
                NoteService.updateDate({ date: startDate}, board.table[board.table.indexOf(item)].datepicker.id)
                setDatePicker(false);
                return
            }
            try {
                const data = await NoteService.createDate({ date: startDate, complete: false, item: item.id });
                const updatedBoards = boards.map(b => {
                    if (b.id === board.id) {
                        const index = b.table.indexOf(item);
                        b.table[index].datepicker = { id: data.id, date: data.date, complete: false };
                    }
                    return b;
                });
                setBoards(updatedBoards);
            } catch (e) {
                console.error('Ошибка при получении данных:', e);
            }
        } else {
            const index = board.table.indexOf(item);
            if (board.table[index].datepicker) {
                NoteService.deleteDate(board.table[index].datepicker.id);
                board.table[index].datepicker = null;
            }
            setBoards([...boards]); 
            
        }
        setDatePicker(false);
    };
    
    const getDateValue = (date) => {
        setChecked(true)
        setStartDate(date)
    }
    
    
  return (
  <>
    {datePicker && (
        <div className='date_picker'>
            <div className='div_dropitem_modal'>
                <span className='text_dropitem_modal'>Даты</span>
            </div>
            <span className='span_text_datepicker' style={checked ? {color: '#579DFF'} : null}>Срок</span>
            <div className='input_datepicker'>
                <input type="checkbox" checked={checked} onChange={() => handleChange()} className='checkbox'/>
                <DatePicker className='date' dropUp={true} disabled={checked ? false : true}
                onToggle={isOpen ? () => handleCalendarClose : () => handleCalendarOpen} value={checked ? startDate : null} defaultValue={checked ? startDate : null} onChange={getDateValue} selected={startDate} includeTime />
            </div>
            <div className='div_add_time'>
                <Link onClick={() => {saveDateTime()}} className='save_time'>Сохранить</Link>
                <Link onClick={() => {setDatePicker(false)}} className='icon_close_div'>
                    <AiOutlineClose className='icon_close'></AiOutlineClose>
                </Link>   
            </div>
        </div>
    )
    }
</>
  )
}

export default ClockDatePicker