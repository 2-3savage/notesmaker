import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from 'react-tooltip';
import "react-widgets/styles.css";
import { BsPencil } from "react-icons/bs";
import { AiOutlineTeam, AiOutlineLeft, AiOutlineDelete, AiOutlineTag, AiOutlineClockCircle, AiOutlineAlignLeft, AiOutlinePlus, AiOutlineEdit,AiOutlineCreditCard, AiOutlineArrowRight, AiOutlineClose } from 'react-icons/ai'
import { NoteService } from '../../services/note.service';
const TagEdit = ({id, elementPosition, tags, board, item, colors, boards, newTagOpenInTag, setNewTagOpenInTag, setBoards, setTags, newInTag, setNewInTag, tagEditInTag, setTagEditInTag}) => {
    const [newTag, setNewTag] = useState({ color_text: "green_muted", color: "#164B35", text_color: "#BAF3DB", text: "приглушенный зеленый" })
    const [textTag, setTextTag] = useState(null)
    const [tagColorEdit, setTagColorEdit] = useState(null)
    const [textEdit, setTextEdit] = useState(null)
    const [position, setPosition] = useState({x: elementPosition.x, y: elementPosition.y})
    const handleTags = (tag) => {
        const index = board.table.indexOf(item)
        if (JSON.stringify(item.tag).includes(JSON.stringify(tag))){
            // Если входит в массив tag
            board.table[index].tag = board.table[index].tag.filter(item => item.id !== tag.id)
            NoteService.removeTagInItem({item: item.id, tag: tag.id})
        }else{
            // Если не входит в массив tag
            board.table[index].tag.push(tag)
            NoteService.addTagInItem({item: item.id, tag: tag.id})
        }
        setBoards(boards.map(
            b => {
                if (b.id === board.id){
                    return board
                }
                return b
            }
        ))
    }
    const editTag = (tagEdit) => {
        const indexTag = tags.indexOf(tagEdit)
        boards.map(b => 
            {b.table.map(i => 
                {
                    const indexItems = i.tag.findIndex(item => item.id === tagEdit.id)
                    if (indexItems >= 0){
                        i.tag[indexItems] = {id: tagEdit.id, text: textEdit, color: tagColorEdit.color_text}
                    }
                }
                )
            }
        )    
        tags[indexTag] = {id: tagEdit.id, text: textEdit, color: tagColorEdit.color_text}
        NoteService.updateTag({id: tagEdit.id, text: textEdit, color: tagColorEdit.color_text}, tagEdit.id)
        setTags(tags)
    }
    const deleteTag = (tagEdit) => {
        const indexTag = tags.indexOf(tagEdit)
        tags.splice(indexTag, 1)
        boards.map(board => 
            board.table.map(itemBoard => {
                itemBoard.tag.splice(itemBoard.tag.findIndex(item => item.id === tagEdit.id), 1)
            })
        )
        NoteService.deleteTag(tagEdit.id)
        setTags(tags)
        
    }
    const saveTag = () => {
        const index = board.table.indexOf(item)
        if (textTag === null || textTag === '') return         
        const fetchData = async () => {
            try {
                const data = await NoteService.createTag({text: textTag, color: newTag.color_text, item: board.table[index].id, board: id})
                board.table[index].tag.push({id: data.tag_page.id, text: data.tag_page.text, color: data.tag_page.color})
                setTags([...tags, {id: data.tag_page.id,text: data.tag_page.text, color: data.tag_page.color}])
            }
            catch (e) {
                console.error('Ошибка при получении данных:', e);
            }
        }   
        fetchData()
    }
    const handleInsertElement = () => {
        const element = document.querySelector('.tag_open');
        const elementRect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const distanceToTop = elementRect.top; // Дистанция до верха экрана
        const distanceToBottom = windowHeight - elementRect.bottom;    
        let newY = elementPosition.y;
       
        if (distanceToBottom < 280 && distanceToBottom > 70) {
            newY = elementPosition.y - 100; // Переместить элемент вверх, если он вышел за пределы внизу
        } else if (distanceToTop < 0 && distanceToTop > -100) {
            newY = elementPosition.y - distanceToTop + 50; // Переместить элемент вниз, если он вышел за пределы сверху
        }
        setPosition({x: elementPosition.x, y: newY});
    };
    
    
    useEffect(() => {
        const handleResize = () => {
            handleInsertElement(); 
        };
        if (newTagOpenInTag || newInTag || tagEditInTag){
            window.addEventListener('resize', handleResize);
        }
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [newTagOpenInTag, newInTag, tagEditInTag]);
  return (
    <>
    {newTagOpenInTag && !newInTag && !tagEditInTag && 
        <div className='tag_open' style={{left: position.x, top: position.y + 10, zIndex: 3}}>
            <div className='div_dropitem_modal'>
                <span className='text_dropitem_modal'>Метки</span>
            </div>
            <div className='tags_div'>
                {tags.map((tag, j) => 
                    <div key={j} className='tags_editing'>
                        <input type="checkbox" checked={JSON.stringify(item.tag)?.includes(JSON.stringify(tag))} onChange={() => {handleTags(tag)}} className='checkbox'/>
                        <div key={j} className='tag_div_edit' onClick={() => {handleTags(tag)}} style={{background: colors[colors.findIndex(color => color.color_text === tag.color)].color}}>
                            <span className="text_preview" style={{color: colors[colors.findIndex(color => color.color_text === tag.color)].text_color}}>{tag.text ? tag.text : ""}</span>
                        </div>
                        <Link onClick={(e) => { handleInsertElement(); setTagEditInTag(tag); setTagColorEdit(colors[colors.findIndex(color => color.color_text === tag.color)]); setTextEdit(tag.text)}} className='link_tag_edit'>
                            <BsPencil className="icon_tag_edit"/>
                        </Link>
                    </div>
                    )
                }
            </div>
            <Link className='btn_new_tag' onClick={(e) => {setNewInTag(!newInTag)}}><span className='text'>Создать новую метку</span></Link>
            <Link onClick={() => (setNewTagOpenInTag(false))} className='icon_close_div'>
                <AiOutlineClose className='icon_close'></AiOutlineClose>
            </Link>   
        </div>
    }
    {tagEditInTag && 
        <div className='tag_open' style={{left: position.x, top: position.y, zIndex: 3}}>
            <div className='div_dropitem_modal'>
                <span className='text_dropitem_modal'>Редактирование метки</span>
            </div>
            <div className='div_preview'>
            <div className="div_tag_preview" style={{background: tagColorEdit?.color}}>
                {textEdit? <span style={{color: tagColorEdit?.text_color}} className='text_preview'>{textEdit}</span> : <span style={{opacity: 0}}>none</span>}
            </div>
            </div>
            <input type='text' onChange={(e) => setTextEdit(e.target.value)} defaultValue={textEdit} placeholder='Название метки' className='input_tag'></input>
            <div className='tag_choose'>
                {colors.map((color, j) => 
                    <div key={j}> 
                        <Tooltip place={'bottom'} id={`${j}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 12, zIndex: 1,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 12, zIndex: 1,  pointerEvents: 0}}/>
                        <div onClick={() => setTagColorEdit(color)} data-tooltip-id={`${j}`} data-tooltip-content={color.text} className="color_tag" style={{background: color.color}}>
                            <span style={{opacity: 0}}>none</span>
                        </div>
                    </div>
                    )
                }
            </div>
            <div className='buttons_tag'>
                <Link onClick={() => {editTag(tagEditInTag), setTagEditInTag(null); setTagColorEdit(null); setTextEdit(null)}} className='save_tag'>Сохранить</Link>
                <Link onClick={() => {deleteTag(tagEditInTag), setTagEditInTag(null); setTagColorEdit(null); setTextEdit(null)}} className='delete_tag'>Удалить</Link>
            </div>
            <Link onClick={() => {setTagEditInTag(null); setNewTagOpenInTag(false);}} className='icon_close_div'>
                <AiOutlineClose className='icon_close'></AiOutlineClose>
            </Link> 
            <Link onClick={() => {handleInsertElement();setTagEditInTag(null);}} className='icon_back_div'>
                <AiOutlineLeft className='icon_back'></AiOutlineLeft>
            </Link>
        </div>
    }
    {newInTag &&
        <div className='tag_open' style={{left: position.x, top: position.y, zIndex: 3}}>
            <div className='div_dropitem_modal'>
                <span className='text_dropitem_modal'>Создание метки</span>
            </div>
            <div className='div_preview'>
            {(newTag || textTag) &&
                <div className="div_tag_preview" style={{background: newTag?.color}}>
                    {textTag? <span style={{color: newTag?.text_color}} className='text_preview'>{textTag}</span> : <span style={{opacity: 0}}>none</span>}
                </div>
            }
            </div>
            <input type='text' onChange={(e) => setTextTag(e.target.value)} placeholder='Название метки' className='input_tag'></input>
            <div className='tag_choose'>
                {colors.map((color, j) => 
                    <div key={j}> 
                        <Tooltip place={'bottom'} id={`${j}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 12, zIndex: 1,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 12, zIndex: 1,  pointerEvents: 0}}/>
                        <div onClick={() => setNewTag(color)} data-tooltip-id={`${j}`} data-tooltip-content={color.text} className="color_tag" style={{background: color.color}}>
                            <span style={{opacity: 0}}>none</span>
                        </div>
                    </div>
                    )
                }
            </div>
            <Link onClick={() => {saveTag(); setNewInTag(false); setTextTag(null)}} className='save_tag'>Сохранить</Link>
            <Link onClick={() => {setNewInTag(false); setNewTagOpenInTag(false); setNewTag({ color_text: "green_muted", color: "#164B35", text_color: "#BAF3DB", text: "приглушенный зеленый" })}} className='icon_close_div'>
                <AiOutlineClose className='icon_close'></AiOutlineClose>
            </Link> 
            <Link onClick={() => {handleInsertElement();setNewInTag(false); setNewTag({ color_text: "green_muted", color: "#164B35", text_color: "#BAF3DB", text: "приглушенный зеленый" })}} className='icon_back_div'>
                <AiOutlineLeft className='icon_back'></AiOutlineLeft>
            </Link> 
        </div>
        
    }
    </>
  )
}

export default TagEdit