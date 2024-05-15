import React, { useRef, useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import { AiOutlineBorder, AiOutlineHolder, AiOutlineEye,AiOutlinePaperClip, AiOutlineTeam, AiOutlineCheckSquare, AiOutlineDelete, AiOutlineTag, AiOutlineClockCircle, AiOutlineAlignLeft, AiOutlinePlus, AiOutlineEdit,AiOutlineCreditCard, AiOutlineArrowRight, AiFillTag, AiOutlineInsertRowLeft, AiFillPlusCircle,  AiOutlineEllipsis, AiOutlineClose } from 'react-icons/ai'
import  ModalDialogBoard  from './ModalDialogBoard'
import  CoverItem  from './CoverItem';
import AddNewBoard from './AddNewBoard';
import  ChangePositionItem  from "./ChangePositionItem"
import InModalDoalogBoard from './InModalDoalogBoard';
import HeaderItemBoard from './HeaderItemBoard';
import AddNewItemInBoard from './AddNewItemInBoard';
import { colors } from './colors'
import ClockDatePicker from './ClockDatePicker';
import TagEdit from './TagEdit';
import DeleteModal from './DeleteModal';
import { NoteService } from '../../services/note.service'
import AuthContext from '../context/AuthContext';
import AddNewItemInput from './AddNewItemInput';
import Members from './Members';
import Charts from './Charts';
import { en_language, ru_language } from '../../services/language';

const Board = ( { listBoards, id, updatePage, setUpdatePage} ) => {
    
    let {authTokens, setFavoritePages, language} = useContext(AuthContext)
    const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);

    const [choiceView, setChoiceView] = useState("Доска")

    const [userInfo, setUserInfo] = useState(null)
    const [star, setStar] = useState(false)
    const containerRef = useRef([]);
    const [user, setUser] = useState(listBoards.users)
    const [boards, setBoards] = useState(listBoards.items)
    const [tags, setTags] = useState(listBoards.tags) 
    const [currentBoard, setCurrentBoard] = useState(null)
    const [currentItem, setCurrentItem] = useState(null)
    const [changeMenuBoard, setChangeMenuBoard] = useState(false)
    const [newBoard, setNewBoard] = useState(false)
    const [inputBoardNameValue, setInputBoardNameValue] = useState(null)
    const [backgroundImage, setBackgroundImage] = useState(listBoards.cover)
    const [tagsOpen, setTagsOpen] = useState(false)
    const [modalDialog, setModalDialog] = useState([])
    const [emojiOpen, setEmojiOpen] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState(listBoards.icon)
    const [dragBoard, setDragBoard] = useState(false)
    const [oldBoardChange, setOldBoardChange] = useState(null)
    const [newBoardChange, setNewBoardChange] = useState(null)
    const [changeMenuBoardPositionItem, setChangeMenuBoardPositionItem] = useState(false)
    const [changeMenuBoardPositionItemInLink, setChangeMenuBoardPositionItemInLink] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showYourElement, setShowYourElement] = useState(null); // темный фон
    const [showYourElementItem, setShowYourElementItem] = useState(null);
    const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
    const [elementActive, setElementActive] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [datePicker, setDatePicker] = useState(null)
    const [content, setContent] = useState('');
    const [newTagOpenInTag, setNewTagOpenInTag] = useState(false)
    const [newInTag, setNewInTag] = useState(false)
    const [tagEditInTag, setTagEditInTag] = useState(null)
    const [deleteItemActive, setDeleteItemActive] = useState(false)
    const [deleteBoardActive, setDeleteBoardActive] = useState(false)
    const [members, setMembers] = useState(false)
    
    const modalRef = useRef(null);
    const [title, setTitle] = useState(listBoards.title)
    
    const [dragMember, setDragMember] = useState(null)
    function updateContainerRef(index, element) {
        containerRef.current[index] = element;
    }
    const closeOpenMenuDate = (e) => {
        const container = document.querySelector(".date_picker")
        if (!container.contains(e.target)){
            if (!isOpen){
                setDatePicker(false)
            }
        }
    }
    const [height, setHeight] = useState(null)
    function dragStartHendler(e, board, item, index, i) {
        setCurrentItem(item)
        setCurrentBoard(board)
        if (modalDialog.length === 0) {
            document.getElementById(`${index}-${i}`).style.opacity = 0.3
        }
        setHeight(document.getElementById(`${index}-${i}`).getBoundingClientRect().height);
    }
    function dragLeaveHandler(e, board, item){
        if (dragBoard) return
        if (dragMember)return
        if (item === currentItem) return
        e.target.style.boxShadow = 'none'
    }
    function dragEndHendler(e, index, i){
        e.target.style.boxShadow = 'none'
        document.getElementById(`${index}-${i}`).style.opacity = 1
        if (elementDragFlag !== null){
            document.getElementById(elementDragFlag).style.height = 0;
            document.getElementById(elementDragFlag).style.marginBottom = 0;
            setElementDragFlag(null)
        }
        if (flagBoard !== null){
            document.getElementById(flagBoard).style.height = 0;
            setFlagBoard(null)
        }
        if (focusedBoard !== null){
            document.getElementById(focusedBoard).classList.remove("focused")
        }
        setCurrentItem(null)
        setCurrentBoard(null)
        
    }
    const dragBoardStart = (e, board, index) => {
        if (e.target.className === "board"){
            setOldBoardChange(board)
            setMenuBoard([])
            setDragBoard(true)
            setNewBoard(false)
            setNewItems(false)
        }
    }
    const dragBoardEnd = (e, board, index) => {
        document.getElementById(`${index}-board-focus`).style.opacity = 1
    }
    const [elementDragFlag, setElementDragFlag] = useState(null)
    const [flagBoard, setFlagBoard] = useState(null)
    const [focusedBoard, setFocusedBoard] = useState(null)
    function dragOverHandler(e, board, item, index, i){
        e.preventDefault()
        if (dragBoard) return
        if (dragMember) return
        // Если тот же элемент то все стили убираем у старого элемента
        if (item === currentItem) {
            if (elementDragFlag !== null){
                document.getElementById(elementDragFlag).style.height = 0;
                document.getElementById(elementDragFlag).style.marginBottom = 0;
            }
            return
        }
        
        // Если старый элемент не равен нынешнему
        if (elementDragFlag !== `${index}-${i}`){
            // Если он не начальный, то нам надо убрать у старого элемента стили
            if (elementDragFlag !== null){
                document.getElementById(elementDragFlag).style.height = 0;
                document.getElementById(elementDragFlag).style.marginBottom = 0;
            }
            // Если это тот же борд
            if (board === currentBoard){
                // Прописать стили для элементов своего же борда
            } 
            // Если это другой борд, то нам надо записать элемент и дать ему стили
            else{
                setElementDragFlag(`${index}-${i}-1`)
                document.getElementById(`${index}-${i}-1`).style.height = `${height}px`;
                document.getElementById(`${index}-${i}-1`).style.marginBottom = `${5}px`;
            }
            
        }
        
        
        const currentIndex = currentBoard.table.indexOf(currentItem) // Индекс преставляемого элемента
        const dropIndex = board.table.indexOf(item) // Индекс элемента на который наводятся
        setBoards(boards.map(
            b => {
                if (b.id === board.id){
                    return board
                }
                if (b.id === currentBoard.id){
                    return currentBoard
                }
                return b
            }
        ))
        
        e.preventDefault()
    }
    
    const dragOverHandlerBoards = (e, board, index) => {
        e.preventDefault()
        
        if (dragMember)return
        if (dragBoard) return
        
        const container = document.querySelector(".modal")
        // если попал на элемент то нужно снять с борда стиль
        if (container?.contains(e.target) || e.target.classList.value == "img-item"  || e.target.classList.value == "grip_members" || e.target.classList.value == "comment_bottom" || e.target.classList.value === "image_members_" || e.target.classList.value == "item_2" || e.target.classList.value == "div_margin"  ||  e.target.classList.value == "margin" || e.target.classList.value == "main-info" || e.target.classList.value == "hr" || e.target.classList.value == "img-item" || e.target.classList.value == "contentEditable" ||  e.target.classList.value == "clock_date" || e.target.classList.value == "datepicker_date" || e.target.classList.value == "comment_icon" || e.target.classList.value == "clock_datepicker" || e.target.classList.value == "bottom_info_item" || e.target.classList.value == "div_icon_item" || e.target.classList.value == "tags_item" || e.target.classList.value == "" || e.target.className == "text_item" ||  e.target.classList.value == "icon_item" || e.target.className === "item text elementfalse" || e.target.className === "item text elementtrue" || e.target.className == "tags_header" || e.target.className == "span_c_text" || e.target.className == "element_board" ){
            if (flagBoard !== null){
                document.getElementById(flagBoard).style.height = 0;
                setFlagBoard(null)
            }
            
            return
        }
        // если не попал на элемент то нужно проверить был ли стиль на элементе и снять если был
        if (elementDragFlag !== null){
            document.getElementById(elementDragFlag).style.height = 0;
            document.getElementById(elementDragFlag).style.marginBottom = 0;
            setElementDragFlag(null)
        }
        // если поменялся борд
        if (flagBoard !== `${index}-board`){
            // если не равен, то надо у старого убрать стили
            if (flagBoard !== null){
                document.getElementById(flagBoard).style.height = 0;
            }
            if (focusedBoard !== null){
                document.getElementById(focusedBoard).classList.remove("focused")
            }
            // если это тот же борд
            if (board === currentBoard){
                // Прописать стили для элементов своего же борда
                setFlagBoard(`${index}-board`)
                document.getElementById(`${index}-board-focus`).classList.add("focused")
                document.getElementById(`${index}-board`).style.height = `${height}px`
                setFocusedBoard(`${index}-board-focus`)
            }
            // если это другой борд, то нам надо записать элемент и дать ему стили
            else{
                setFlagBoard(`${index}-board`)
                document.getElementById(`${index}-board-focus`).classList.add("focused")
                document.getElementById(`${index}-board`).style.height = `${height}px`
                setFocusedBoard(`${index}-board-focus`)
            }
            
        }
        
    }
    function dragOverHandlerItems(e, item, board){
        e.preventDefault()
        
    }
    
    function formatDate(date) {
        const months = [
          'янв', 'фев', 'мар', 'апр', 'май', 'июн', 
          'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year} г.`;
    }
      
    const dropHandler = async (e, board, item) => {
        e.preventDefault()
        if (dragMember){
            if (item?.members?.filter(member => member.id === dragMember.id)?.length > 0){
                setDragMember(null)
                return
            }
            await NoteService.addMemberInItem(dragMember.id, item.id)
            const index = board.table.indexOf(item)
            board.table[index].members.push(dragMember)
            setBoards(boards.map(
                b => {
                    if (b.id === board.id){
                        return board
                    }
                    return b
                }
            ))
            setDragMember(null)
            return
        }
        if (dragBoard) {
            return
        }
        if (!currentItem) return
        if (item === currentItem) return
        if (board === currentBoard){ // если эта та же таблица то будут перестановки в одной таблице
            const fetchData = async () => {
                try {
                    const data = await NoteService.updateItemDragOnDropInBoard(id, currentItem.id, item.id)
                    setBoards(data.items)
                }
                catch (e) {
                    console.error('Ошибка при получении данных:', e);
                }
            }   
            fetchData()
        }else{ // если это не та же таблица
            const fetchData = async () => {
                try {
                    const data = await NoteService.updateItemDragOnDropItemBoards(id, currentBoard.id, board.id, currentItem.id, item.id)
                    setBoards(data.items)
                }
                catch (e) {
                    console.error('Ошибка при получении данных:', e);
                }
            }   
            fetchData()
        }
 
        e.target.style.boxShadow = 'none' 
        
        setCurrentBoard(null)
        setCurrentItem(null)
    }
    function changeBoards(board){
        const fetchData = async () => {
            try {
                const data = await NoteService.updateBoardChange(id, board.id, oldBoardChange.id)
                setBoards(data.items)
            }
            catch (e) {
                console.error('Ошибка при получении данных:', e);
            }
        }   
        fetchData()
        setNewBoardChange(null)
        setOldBoardChange(null)
        setChangeMenuBoard(false)
        setCurrentBoard(null)
        setCurrentItem(null)
        setMenuBoard([])
    }
    const tableRearrangement = (e) => {
        setOldBoardChange(boards.find(board => board.id === parseInt(e.target.value))) // id на новый элемент
        setNewBoardChange(e.target.value) // название выбранной таблицы
    }
    function dropCard(e, board){
        if (dragMember) {
            setDragMember(null)
            return
        }
        if (dragBoard) {
            changeBoards(board)
            setDragBoard(false)  
            return
        }
        if (!currentItem) return
        const container = document.querySelector(".modal")
        if (container?.contains(e.target) || e.target.classList.value == "img-item" || e.target.classList.value == "div_margin" || e.target.classList.value == "main-info" || e.target.classList.value == "hr" || e.target.classList.value == "img-item" || e.target.classList.value == "contentEditable" ||  e.target.classList.value == "clock_date" || e.target.classList.value == "datepicker_date" || e.target.classList.value == "comment_icon" || e.target.classList.value == "clock_datepicker" || e.target.classList.value == "bottom_info_item" || e.target.classList.value == "div_icon_item" || e.target.classList.value == "tags_item" || e.target.classList.value == "" || e.target.className == "text_item" ||  e.target.classList.value == "icon_item" || e.target.className === "item text elementfalse" || e.target.className === "item text elementtrue" || e.target.className == "tags_header" || e.target.className == "span_c_text" || e.target.className == "element_board" ){
            return
        }
        
        e.target.style.boxShadow = 'none'
        if (currentBoard.id !== board.id){
            const fetchData = async () => {
                try {
                    const data = await NoteService.updateItemDropInBoard(id, currentBoard.id, board.id, currentItem.id)
                    setBoards(data.items)
                }
                catch (e) {
                    console.error('Ошибка при получении данных:', e);
                }
            }   
            fetchData()
        }else{
            const fetchData = async () => {
                try {
                    const data = await NoteService.updateItemDropInYourBoard(id, currentBoard.id, currentItem.id)
                    setBoards(data.items)
                }
                catch (e) {
                    console.error('Ошибка при получении данных:', e);
                }
            }   
            fetchData()
        }
        
        setCurrentBoard(null)
        setCurrentItem(null)
    }
    
    // Новый элемент 
    const [newItems, setNewItems] = useState([]);
    const [inputValue, setInputValue] = useState(null)
    // Создание элемента
    const addItem = (index) => {
        const updatedNewItems = [];
        updatedNewItems[index] = true;
        setNewItems(updatedNewItems);
        const container = containerRef.current[index];
        setTimeout(() => {
            container.scrollTop = container.scrollHeight - container.clientHeight;
        })
            
        
    };
    // Закрытие создания эл-та
    const deleteItem = () => {
        setInputValue(null)
        setNewItems([]);
        
    }
    // Добавление нового элемента в список 
    const addNewItem = (board) => {
        if (!inputValue) return
        setInputValue(null)
        
    
        const fetchData = async () => {
            try {
                const data = await NoteService.createItem({
                    "title": inputValue,
                    "comment": "",
                    "table": board.id
                })
                const updatedBoards = boards.map(b => {
                    if (b.id === board.id){
                        
                        return {
                            ...b, table: [...b.table, data ]
                        }   
                    }
                    return b
                })
                setBoards(updatedBoards)
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }
        fetchData()
        
    }
    
    
    // Новая таблица
    const addBoard = () => {
        if (!inputBoardNameValue) return
        setInputBoardNameValue(null)

        const fetchData = async () => {
            try {
              const data = await NoteService.createTable({
                "title": inputBoardNameValue,
                "board": id,
              });
              const updatedBoards = [...boards, {id: data.id, title: data.title, table: data.table}];
              setBoards(updatedBoards);
            } catch (error) {
              console.error('Ошибка при получении данных:', error);
            }
        };
        fetchData()
    }
    
    // Клик на троеточие
    const [menuBoard, setMenuBoard] = useState([])
    const menuBoardActive = (index) => {
        const menuActive = []
        menuActive[index] = true
        if (menuBoard[index] === menuActive[index]){
            if (changeMenuBoard) {
                setChangeMenuBoard(false)
                return
            }
            setMenuBoard([]) 
            return
        }
        setMenuBoard(menuActive)  
        setNewBoard(false)
        setNewItems(false)  
    } 
    // Закрытие открытого меню на клик не по элементу
    const closeOpenMenu = (e) => {
        const container = document.querySelector(".menu_board")
        const container2 = document.querySelectorAll(".icon_dropitem_div")
        let id_element = container.id.split('_')[1]
        if (container2[id_element].contains(e.target))return
        
        if (deleteBoardActive) return
        if (!container.contains(e.target)){
            setMenuBoard([])
            setOldBoardChange(null)
            setNewBoardChange(null)
            setChangeMenuBoard(false)
        }
    }
    // Удаление таблицы
    const deleteBoard = async (index, board) => {
        const data = await NoteService.deleteTable(id, parseInt(board.id))
        setBoards(data.items)
        setMenuBoard([])
    }
    // Открытие добавления нового эл-та через троеточие
    const addItemInMenu = (index) => {
        const updatedNewItems = [];
        updatedNewItems[index] = true;
        setMenuBoard([]);
        setNewItems(updatedNewItems);
    }
    
    const closeEmojiMenu = (e) => {
        const container = document.querySelector(".emoji")
        if (!container?.contains(e.target)){
            setEmojiOpen(false)
        }
    }
    const onEmojiClick = async (emojiObject) => {
        setChosenEmoji(emojiObject.emoji)
        const data = await NoteService.updatePage({"icon": emojiObject.emoji}, listBoards.id, authTokens)
        setFavoritePages(data.boards_like)
        setEmojiOpen(false)
    }
    const editHandler = (e, index, i) => {   
        if (showYourElement) return
        
        if (e.target.classList.value  === "clock_date_color_text" || e.target.classList.value === "datepicker_date_color_text" || e.target.classList.value  === "div_icon_item" || e.target.classList.value  === "icon_item" || e.target.classList.value === "span_c_text"  || e.target.classList.value === "datepicker_date" || e.target.classList.value === "clock_date" || e.target.classList.value === "clock_datepicker" || e.target.classList.value === "" || e.target.classList.value === "tags_item") return
        document.getElementsByTagName("nav")[0].classList.add("sidebar_back")
        document.getElementById(`${index}-${i}`).draggable = false
        setModalDialog([`${index}-${i}`])
    }
    const closeEditHandler = (index, i) => {
        setTimeout(() => {
            setModalDialog([]);
            document.getElementsByTagName("nav")[0].classList.remove("sidebar_back")
        }, 0);
        document.getElementById(`${index}-${i}`).draggable = true
        setShowYourElement(null);
        setShowYourElementItem(null);
        setElementActive(null)
    }
    const [oldItemPositionBoard, setOldItemPositionBoard] = useState(null)
    const [newItemPositionBoard, setNewItemPositionBoard] = useState(null)
    
    const itemRearrangement = (e, i, item) => {
        setOldItemPositionBoard(i) // из какой элемент
        setNewItemPositionBoard(parseInt(e.target.value)) // выбранный индекс в select на название - это board.id

    }
    const changePositionItem = (item, index, i) => {
        if (!oldItemPositionBoard) return
        if (oldItemPositionBoard === boards.find(board => board.id === newItemPositionBoard)) {
            return
        } 
        const fetchData = async () => {
            try {
                const data = await NoteService.updateItemDropInBoard(id, oldItemPositionBoard.id, newItemPositionBoard, item.id)
                setBoards(data.items)
            }
            catch (e) {
                console.error('Ошибка при получении данных:', e);
            }
        }   
        fetchData()
        
        setChangeMenuBoardPositionItemClose()
        closeEditHandler(index, i)
        
    }
    // функция для отработки нового значения для select item
    const setChangeMenuBoardPositionItemClose = () => {
        
        setChangeMenuBoardPositionItem(false)
        setOldItemPositionBoard(null)
        setNewItemPositionBoard(null)

    }
    const onDeleteItemInBoard = async (board, item) => {
        const data = await NoteService.deleteItem(id, board.id, item.id)
        setBoards(data.items)
    }
    const closeChangeMenuBoardPositionItem = (e) => {
        const container = document.querySelector(".position_change_modal_dialog")
        const containerNot = document.querySelectorAll(".link_right_menu")[3]
        if (containerNot?.contains(e.target)) return
        if (!container?.contains(e.target)){
            setChangeMenuBoardPositionItemClose()
        }
    }
    const closeChangeMenuBoardPositionItemLink = (e) => {
        const container = document.querySelector(".position_change_modal_dialog")
        const containerNot = document.querySelector(".button_link_board_modal_dialog")
        if (containerNot?.contains(e.target)) return
        if (!container?.contains(e.target)){
            setChangeMenuBoardPositionItemInLink(false)
        }
    }
    const getColor = (datepicker) => {
        if (datepicker.complete) return "#4BCE97" // Зеленный
        const now = new Date().getTime()
        const end = new Date(datepicker.date).getTime()
        const timeDiff = end - now
        if (timeDiff < 0 && timeDiff > -86400 * 1000) {
            return "#F87168" // Оранжевый
        }
        if (timeDiff < -86400 * 1000) {
            return "#5D1F1A" // Красный
        }
        if (timeDiff < 86400 * 1000 && timeDiff > 0) {
            return "#F5CD47" // Желтый
        } 
        return ""
    }
    
    const setCompleteDate = (item, board) => {
        const index = board.table.indexOf(item)
        if (board.table[index].datepicker.complete){
            board.table[index].datepicker.complete = false
            NoteService.updateDate({"complete": false}, item.datepicker.id)
        }else{
            board.table[index].datepicker.complete = true
            NoteService.updateDate({"complete": true}, item.datepicker.id)
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
    
    const handleInsertElement = (event, index, i, board, item) => {
        const element = event.currentTarget;
        const elementRect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const distanceToBottom = windowHeight - elementRect.bottom;
        const distanceToRight = windowHeight - elementRect.right;
        const x_left = (distanceToRight < -110 ? 470 : 15)
        const y_top = (distanceToBottom < 220 ? windowHeight - elementRect.height - 250 : elementRect.top - 10 )
        setElementPosition({ x: elementRect.left - x_left, y: y_top });
        document.getElementsByTagName("nav")[0].classList.add("sidebar_back");
        setShowYourElementItem(item)
        setShowYourElement(board);
        setElementActive(`${index}-${i}`);
        setContent(board.table[board.table.indexOf(item)].title);
    };
    const handleClickOutsideModal = (event) => {
        const items = document.querySelectorAll(".item")
        let container = null
        items.forEach(function(item) {
            if (item.id === elementActive) {
                container = item
            }
        });
        if (modalRef.current && !modalRef.current.contains(event.target) && !container.contains(event.target)) {
            if (datePicker) return
            if (newTagOpenInTag || newInTag || tagEditInTag) return
            if (deleteItemActive) return
            setShowYourElement(null);
            setShowYourElementItem(null);
            setElementActive(null)
            setContent(null);
            setDeleteItemActive(false)
            document.getElementsByTagName("nav")[0].classList.remove("sidebar_back")
        }
      };
    const openCard = () => {
        setShowYourElement(null);
        setShowYourElementItem(null);
        setElementActive(null)
        setContent(null);
        setModalDialog([elementActive])
    }
    const deleteCard = () => {
        onDeleteItemInBoard(showYourElement, showYourElementItem)
        setDeleteItemActive(false)
        setShowYourElement(null);
        setShowYourElementItem(null);
        setElementActive(null)
        setContent(null);
        document.getElementsByTagName("nav")[0].classList.remove("sidebar_back")
    }
    const changeCardPos = () => {
        if (changeMenuBoardPositionItem) {
            setChangeMenuBoardPositionItemClose()
        }else{
            document.getElementById(`${elementActive.split("-")[0]}-${elementActive.split("-")[1]}`).draggable = true
            setChangeMenuBoardPositionItem(true)
        }
    }
    const closeOpenTagInTag = (e) => {
        const container = document.querySelector(".tag_open")
        if (!container.contains(e.target)){
            setNewTagOpenInTag(false)
            setNewInTag(false)
            setTagEditInTag(null)
            
        }
    }
    const saveTextItem = () => {
        if (content) {
            const index = showYourElement.table.indexOf(showYourElementItem)
            showYourElement.table[index].title = content
            NoteService.updateItem({"title": content}, showYourElementItem.id)
        }
        setBoards(boards.map(
            b => {
                if (b.id === showYourElement.id){
                    return showYourElement
                }
                return b
            }
        ))
        setShowYourElement(null);
        setShowYourElementItem(null);
        setElementActive(null);
        
    }
    const handleCloseDeleteItem = (e) => {
        const container = document.querySelector(".tag_open")
        if (!container.contains(e.target)){
            setNewTagOpenInTag(false)
            setDeleteItemActive(false)
            
        }
    }
    const handleCloseMembers= (e) => {
        const container = document.querySelector(".members_open")
        if (!container.contains(e.target)){
            setMembers(false)
        }
    }
    
    const handleClickOutsideInDeleteModalDialog = (e) => {
        const container = document.querySelector(".tag_open")
        if (!container?.contains(e.target)){
            setDeleteBoardActive(false)
        }
    }
    const [dragActive, setDragActive] = useState(null)
    const [heightActive, setHeightActive] = useState(null)
    const [itemDrag, setItemDrag] = useState(null)
    const dragStartHendlerEvent = (e, index, i, item) => {
        setItemDrag(item)
        setDragActive([index, i])
        setHeightActive(document.getElementById(`${index}-${i}`).getBoundingClientRect().height)
    }
    const dragOverHendlerEvent = (e, index, i, item) => {
        e.preventDefault();
        if (itemDrag === item) return
        
        e.target.className
    }
    useEffect(() => {
        
        setLang(language === "Русский" ? ru_language : en_language);
        const fetchData = async () => {
            const data = await NoteService.getUserInfoBoard(authTokens, id)
            setUserInfo(data)
            listBoards.users.map((item) => {
                if (item.email === data.email)

                    setStar(item.user.like_board)
                }
            )
        }
        
        
        if (updatePage){
            
            fetchData()
            setBoards(listBoards.items)
            setUser(listBoards.users)
            setTags(listBoards.tags)
            setBackgroundImage(listBoards.cover)
            setChosenEmoji(listBoards.icon)
            setTitle(listBoards.title)
            setUpdatePage(false)
            document.querySelector('.name').value = listBoards.title;
        }
        if (newTagOpenInTag || newInTag || tagEditInTag) {
            document.addEventListener("mousedown", closeOpenTagInTag)
        }
        if (members){
            document.addEventListener("mousedown", handleCloseMembers)
          }
        if (datePicker) {
            document.addEventListener("mousedown", closeOpenMenuDate)
        }
        if (menuBoard.length !== 0){
            document.addEventListener("mousedown", closeOpenMenu)
        }
        if (emojiOpen){
            document.addEventListener("mousedown", closeEmojiMenu)
        }
        if (changeMenuBoardPositionItem){
            document.addEventListener("mousedown", closeChangeMenuBoardPositionItem)
        }
        if (changeMenuBoardPositionItemInLink){
            document.addEventListener("mousedown", closeChangeMenuBoardPositionItemLink)
        }
        if (showYourElement){
            document.addEventListener("mousedown", handleClickOutsideModal);
        }
        if (deleteItemActive){
            document.addEventListener("mousedown", handleCloseDeleteItem)
        }
        if (deleteBoardActive) document.addEventListener("mousedown", handleClickOutsideInDeleteModalDialog)
        return () => {
            document.removeEventListener("mousedown", closeOpenMenuDate) 
            document.removeEventListener("mousedown", closeEmojiMenu)
            document.removeEventListener("mousedown", closeOpenMenu)
            document.removeEventListener("mousedown", closeChangeMenuBoardPositionItem)
            document.removeEventListener("mousedown", closeChangeMenuBoardPositionItemLink)
            document.removeEventListener("mousedown", handleClickOutsideModal);
            document.removeEventListener("mousedown", closeOpenTagInTag)
            document.removeEventListener("mousedown", handleCloseDeleteItem)
            document.removeEventListener("mousedown", handleClickOutsideInDeleteModalDialog)
            document.removeEventListener("mousedown", handleCloseMembers)
        }
    }, [choiceView, language, listBoards, members, datePicker, deleteItemActive, menuBoard, emojiOpen, changeMenuBoardPositionItem, changeMenuBoardPositionItemInLink, showYourElement, newTagOpenInTag, newInTag, tagEditInTag, deleteBoardActive])
    
    
    return (
        <div className='boards_app' style={{ backgroundImage: `url(${backgroundImage})` }} >
            <CoverItem setUserInfo={setUserInfo} setChoiceView={setChoiceView} choiceView={choiceView} setDragMember={setDragMember} setUser={setUser} userInfo={userInfo} setStar={setStar} star={star} title={title} user={user} chosenEmoji={chosenEmoji} emojiOpen={emojiOpen} onEmojiClick={onEmojiClick} setEmojiOpen={setEmojiOpen} id={id}  />
            { choiceView === "Таблица" && 
                <div className={`app`}>
                    <div className='table_body'>
                        <div className='table_body_2'>
                            <div className='header_info_table'>
                                <span className='columnheader'>{lang.name_card}</span>
                                <span className='columnheader'>{lang.list}</span>
                                <span className='columnheader'>{lang.tag}</span>
                                <span className='columnheader'>{lang.member}</span>
                                <span className='columnheader'>{lang.time}</span>
                            </div>
                            <div className='scroll'>
                            {boards.sort((a, b) => a.position - b.position).map((board, index) => 
                                <div key={index} className='items_table'>
                                {
                                    board.table.sort((a, b) => a.position - b.position).map((item, i)=> 
                                        <div key={i}
                                        id = {`${index}-${i}`}
                                        draggable={true} 
                                        onDragStart={(e) => {dragStartHendlerEvent(e, index, i, item)}}
                                        onDragOver={(e) => {dragOverHendlerEvent(e, index, i, item)}}
                                        className="item_table">
                                            <span className='next_item_board'>{item.title}</span>
                                            <span className='next_item_board'>{board.title}</span>
                                            <span className='next_item_board'>
                                                {item.tag?.map((tag, j)=>
                                                    <div data-tooltip-id={`${index}-tag`} data-tooltip-content={`${lang.color_tooltip} ${colors[colors.findIndex(color => color.color_text === tag.color)].text}, ${lang.name_tooltip} "${tag.text}"`} className="tag_table_item" onClick={() => {tagsOpen? setTagsOpen(false) : setTagsOpen(true)}} key={j} style={{background: colors[colors.findIndex(color => color.color_text === tag.color)].color}}>
                                                        <span className='span_c_text' style={{color: colors[colors.findIndex(color => color.color_text === tag.color)].text_color}}>{ tag.text }</span>
                                                    </div>
                                                )}
                                                <Tooltip place={'bottom'} id={`${index}-tag`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 11, zIndex: 2, pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 11, zIndex: 2,  pointerEvents: 0}}/>
                                            </span>
                                            <span className='next_item_board'> 
                                                {item.members?.map((item, index) =>
                                                    <div className="image_div_" key={index}>
                                                        <img draggable={false} className='image_members_table' src={item.user.avatar}/>
                                                    </div>
                                                )}
                                            </span>
                                            <span className='next_item_board'>
                                                {item.datepicker && 
                                                        <>
                                                            <div data-tooltip-id={`${index}-${i}`} data-tooltip-content={getColor(item.datepicker) === "" ? `${lang.time_not_soon}` : getColor(item.datepicker) === "#F87168" ? `${lang.time_recently_ended}` : getColor(item.datepicker) === "#5D1F1A" ? `${lang.time_ended}` : item.datepicker.complete? `${lang.time_ok}` : `${lang.time_end_soon}`} onClick={() => setCompleteDate(item, board)} onMouseLeave={() => setIsHovered(null)} onMouseEnter={() => setIsHovered(`${index}-${i}`)} className="clock_datepicker" style={{background: getColor(item.datepicker)}}>
                                                                {isHovered === `${index}-${i}`? item.datepicker.complete? <AiOutlineCheckSquare className={getColor(item.datepicker) === "" ? "clock_date_color_text" : 'clock_date'}/> : <AiOutlineBorder className={getColor(item.datepicker) === "" ? "clock_date_color_text" : 'clock_date'}/> :  <AiOutlineClockCircle className={getColor(item.datepicker) === "" ? "clock_date_color_text" : 'clock_date'}/>}
                                                                <span className={getColor(item.datepicker) === "" ? "datepicker_date_color_text" : `datepicker_date`}>{formatDate(new Date(item.datepicker.date))}</span>
                                                            </div>
                                                            
                                                        </>
                                                    }
                                            </span>
                                        </div>
                                    )
                                }
                                </div>
                            )}
                            </div>
                        </div>

                    </div>
                </div>
            }
            { choiceView === "Панель" && 
                <div className={`app`}>
                    <div className='table_body'>
                        <Charts listBoards={listBoards} user={user} boards={boards}/>
                    </div>
                </div>
            }
            { choiceView === 'Доска' &&
                <div className={`app`}>
                    {boards.sort((a, b) => a.position - b.position).map((board, index) => 
                        <div key={index}  
                        onDragOver={e => dragOverHandlerBoards(e, board, index)} 
                        onDrop={e => dropCard(e, board)} 
                        className='items'>
                            <Tooltip place={'right'} id={`${index}-tag`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 11, zIndex: 2,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 11, zIndex: 2,  pointerEvents: 0}}/>
                            <div className="board" 
                            onDragStart={e => dragBoardStart(e, board, index)} 
                            onDragOver={e => dragOverHandlerItems(e, board)} 
                            onDragEnd={e => dragBoardEnd(e, board, index)} 
                            id={`${index}-board-focus`} 
                            draggable={JSON.stringify(modalDialog)==JSON.stringify([]) ? elementActive? false : true : false}>
                                <HeaderItemBoard 
                                    deleteBoardActive={deleteBoardActive}
                                    setDeleteBoardActive={setDeleteBoardActive}
                                    boards={boards}
                                    board={board}
                                    newBoardPosition={newBoardChange}
                                    menuBoard={menuBoard}
                                    index={index}
                                    changeMenuBoard={changeMenuBoard}
                                    addItemInMenu={addItemInMenu}
                                    setChangeMenuBoard={setChangeMenuBoard}
                                    deleteBoard={deleteBoard}
                                    tableRearrangement={tableRearrangement}
                                    menuBoardActive={menuBoardActive}
                                    changeBoard={changeBoards}
                                    setMenuBoard={setMenuBoard}  
                                />
                                <div ref={(element) => updateContainerRef(index, element)} className={'elements_board' + (newItems[index]? `true` : `false`)} >
                                    {board.table.sort((a, b) => a.position - b.position).map((item, i)=>
                                    <div key={i} className='element_board'>
                                        {!dragBoard && <>
                                            <Tooltip place={'bottom'} id={`${index}-${i}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 11, zIndex: 2,  pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 11, zIndex: 2,  pointerEvents: 0}}/>
                                            <Tooltip place={'bottom'} id={`${i}-${index}`} style={document.getElementsByTagName("body")[0].classList.contains("dark") ? {fontSize: 11, zIndex: 2, pointerEvents: 0, backgroundColor: "#B6C2CF", color: "#1D2125"} : {fontSize: 11, zIndex: 2,  pointerEvents: 0}}/>
                                            
                                        </>}
                                        <div 
                                        onDragStart={e => dragStartHendler(e, board, item, index, i)} 
                                        onDragLeave={e => dragLeaveHandler(e, board, item) }
                                        onDragEnd={e => dragEndHendler(e, index, i)} 
                                        onDragOver={e => dragOverHandler(e, board, item, index, i)} 
                                        onDrop={e => dropHandler(e, board, item)}
                                        draggable={JSON.stringify(modalDialog)==JSON.stringify([]) ? elementActive === `${index}-${i}` ? false : true : false} 
                                        id={`${index}-${i}`}
                                        className={`item text element` + `${tagsOpen}`}
                                        onClick={(e) => {(editHandler(e, index, i));}}
                                        >
                                            <div className="margin">
                                                
                                            </div>
                                            <div className="div_margin" id={`${index}-${i}-1`}>
                                                
                                            </div>
                                            
                                            <div className='item_2' style={elementActive === `${index}-${i}`? {zIndex: 2} : null}>
                                            <ModalDialogBoard isOpen={modalDialog.includes(`${index}-${i}`)} onClose={() => {closeEditHandler(index, i); setChangeMenuBoardPositionItemClose(); setChangeMenuBoardPositionItemInLink(false)}}>
                                                <InModalDoalogBoard 
                                                setMembers={setMembers}
                                                members={members}
                                                user={user}
                                                id={id}
                                                colors={colors}
                                                tags={tags}
                                                item={item} 
                                                boards={boards} 
                                                board={board} 
                                                index={index} 
                                                i={i}
                                                setChangeMenuBoardPositionItem={setChangeMenuBoardPositionItem}
                                                changeMenuBoardPositionItemInLink={changeMenuBoardPositionItemInLink}
                                                changeMenuBoardPositionItem={changeMenuBoardPositionItem} 
                                                newItemPositionBoard = {newItemPositionBoard}
                                                setChangeMenuBoardPositionItemClose={setChangeMenuBoardPositionItemClose} 
                                                itemRearrangement={itemRearrangement} 
                                                changePositionItem={changePositionItem}
                                                onDeleteItemInBoard={onDeleteItemInBoard}
                                                closeEditHandler={closeEditHandler}
                                                setBoards = {setBoards}
                                                setTags ={setTags}
                                                setChangeMenuBoardPositionItemInLink={setChangeMenuBoardPositionItemInLink}
                                                />
                                            </ModalDialogBoard>
                                            <div className='img_div_'>
                                                {
                                                    item.investment?.map((investment, index) => {  
                                                        return investment.active && 
                                                        <div key={index} >
                                                            <img draggable={false}  className='img-item' src={`/src/assets/${investment.document?.split("/")[4]}`}></img>     
                                                            <hr className='hr'/> 
                                                        </div>
                                                            
                                                    })
                                                }
                                            </div>
                                            
                                            <div className='main-info'>
                                                <div onClick={(e) => {handleInsertElement(e, index, i, board, item)}} className='div_icon_item'>
                                                    <AiOutlineEdit className='icon_item'/>
                                                </div>
                                                <div className="tags_header">
                                                    {item.tag?.map((tag, j)=>
                                                        <div data-tooltip-id={`${index}-tag`} data-tooltip-content={`${lang.color_tooltip} ${colors[colors.findIndex(color => color.color_text === tag.color)].text}, ${lang.name_tooltip} "${tag.text}"`} className="tags_item" onClick={() => {tagsOpen? setTagsOpen(false) : setTagsOpen(true)}} key={j} style={{background: colors[colors.findIndex(color => color.color_text === tag.color)].color}}>
                                                            {tagsOpen && (<span className='span_c_text' style={tag.text ? {color: colors[colors.findIndex(color => color.color_text === tag.color)].text_color}: {opacity: 0}}>{ tag.text ? tag.text : "none" }</span>)}
                                                            {!tagsOpen && (<span className='span_c_text'>none</span>)}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                
                                                <div  className='contentEditable'>{item.title}</div>                                          
                                                <div className='bottom_info_item'>
                                                    {item.datepicker && 
                                                        <>
                                                            <div data-tooltip-id={`${index}-${i}`} data-tooltip-content={getColor(item.datepicker) === "" ? `${lang.time_not_soon}` : getColor(item.datepicker) === "#F87168" ? `${lang.time_recently_ended}` : getColor(item.datepicker) === "#5D1F1A" ? `${lang.time_ended}` : item.datepicker.complete? `${lang.time_ok}` : `${lang.time_end_soon}`} onClick={() => setCompleteDate(item, board)} onMouseLeave={() => setIsHovered(null)} onMouseEnter={() => setIsHovered(`${index}-${i}`)} className="clock_datepicker" style={{background: getColor(item.datepicker)}}>
                                                                {isHovered === `${index}-${i}`? item.datepicker.complete? <AiOutlineCheckSquare className={getColor(item.datepicker) === "" ? "clock_date_color_text" : 'clock_date'}/> : <AiOutlineBorder className={getColor(item.datepicker) === "" ? "clock_date_color_text" : 'clock_date'}/> :  <AiOutlineClockCircle className={getColor(item.datepicker) === "" ? "clock_date_color_text" : 'clock_date'}/>}
                                                                <span className={getColor(item.datepicker) === "" ? "datepicker_date_color_text" : `datepicker_date`}>{formatDate(new Date(item.datepicker.date))}</span>
                                                            </div>
                                                            
                                                        </>
                                                    }
                                                    {item?.members?.filter(item => item?.id === userInfo?.id).length > 0 && 
                                                        <div data-tooltip-id={`${index}-${i}`} data-tooltip-content={lang.card_signed} className="comment_bottom">    
                                                            <AiOutlineEye className='comment_icon' />
                                                        </div>
                                                    }
                                                    {item.comment && <div data-tooltip-id={`${index}-${i}`} data-tooltip-content={lang.card_description} className="comment_bottom">
                                                        <AiOutlineAlignLeft className='comment_icon'/> 
                                                    </div>}
                                                    {item.investment?.length !== 0 &&
                                                        <div data-tooltip-id={`${index}-${i}`} data-tooltip-content={lang.card_attachments} className="comment_bottom">
                                                            <AiOutlinePaperClip className='comment_icon'/> 
                                                            <span className='length'>{item.investment?.length}</span>
                                                        </div>
                                                    }

                                                </div>
                                                
                                                <div className="grip_members">
                                                        {item.members?.map((item, index) =>
                                                            <div className="image_div_" key={index}>
                                                                <img draggable={false} className='image_members_' src={item.user.avatar}/>
                                                            </div>
                                                        )}
                                                </div>
                                                
                                            </div>
                                        </div>
                                            
                                    </div>
                                        
                                    </div>)}
                                    <div className="item_preview_pos" id={`${index}-board`}>

                                    </div>
                                    <AddNewItemInput 
                                    setNewItems={setNewItems}
                                    index={index}
                                    board={board}
                                    newItems={newItems}
                                    setInputValue={setInputValue}
                                    addNewItem={addNewItem}
                                    deleteItem={deleteItem}
                                    addItem={addItem} />
                                </div>
                                <AddNewItemInBoard 
                                    index={index}
                                    board={board}
                                    newItems={newItems}
                                    setInputValue={setInputValue}
                                    addNewItem={addNewItem}
                                    deleteItem={deleteItem}
                                    addItem={addItem}
                                />
                                
                                
                            </div>
                        </div>
                    )}
                        <AddNewBoard newBoard={newBoard} setNewBoard={setNewBoard} setInputBoardNameValue={setInputBoardNameValue} addBoard={addBoard}/>
                </div>
            }
            {showYourElement && (
                <>
                <div style={{ position: 'absolute', left: elementPosition.x, top: elementPosition.y, zIndex: 2}} ref={modalRef}>
                    <div className='new_dialog'>
                        <ul>
                            <li className='li_dialog'>
                                <Link onClick={() => { openCard();  }} className='link_dialog'>
                                    <AiOutlineCreditCard className="icon_link_right_menu"/>
                                    <span className="text">{lang.open_card}</span>
                                </Link>
                            </li>
                            <li className='li_dialog'>
                                <Link onClick={() => { setNewTagOpenInTag(!newTagOpenInTag) }} className='link_dialog'>
                                    <AiOutlineTag className="icon_link_right_menu"/>
                                    <span className="text">{lang.change_tag}</span>
                                </Link>
                            </li>
                            <li className='li_dialog'>
                                <Link onClick={() => {setMembers(true)}} className='link_dialog'> 
                                    <AiOutlineTeam className="icon_link_right_menu"/>
                                    <span className="text">{lang.change_member}</span>
                                </Link>
                            </li>
                            {
                                members && (
                                    <Members  boards={boards} setBoards={setBoards} board={showYourElement} user={user} setMembers={setMembers} item={showYourElementItem}/>
                                )
                            }
                            {changeMenuBoardPositionItem && (
                                <ChangePositionItem 
                                itemRearrangement={itemRearrangement}
                                setChangeMenuBoardPositionItemClose={setChangeMenuBoardPositionItemClose}
                                changePositionItem={changePositionItem}
                                index={elementActive.split("-")[0]}
                                i={elementActive.split("-")[1]}
                                boards={boards} 
                                board={showYourElement}
                                newItemPositionBoard={newItemPositionBoard}
                                item={showYourElementItem}
                                />
                            )}
                            <li className='li_dialog'>
                                <Link onClick={() => {datePicker? setDatePicker(false) : setDatePicker(true); }} className='link_dialog'>
                                    <AiOutlineClockCircle className="icon_link_right_menu"/>
                                    <span className="text">{lang.change_time}</span>
                                </Link>
                            </li>
                            <DeleteModal deleteItemActive={deleteItemActive} deleteCard={deleteCard} setDeleteItemActive={setDeleteItemActive}/>
                            <ClockDatePicker 
                                boards={boards}
                                board={showYourElement}
                                item={showYourElementItem}
                                setBoards={setBoards}
                                datePicker={datePicker}
                                setDatePicker={setDatePicker}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                            />
                            <li className='li_dialog'>
                                <Link onClick={() => { changeCardPos() }} className='link_dialog'>
                                    <AiOutlineArrowRight className="icon_link_right_menu"/>
                                    <span className="text">{lang.change}</span>
                                </Link>
                            </li>
                            
                            <li className='li_dialog'>
                                <Link onClick={() => { setDeleteItemActive(true) }} className='link_dialog'>
                                    <AiOutlineDelete className="icon_link_right_menu"/>
                                    <span className="text">{lang.delete}</span>
                                </Link>
                            </li>
                            
                        </ul>
                    </div>
                    
                    <Link onClick={() => {saveTextItem()}} style={{ zIndex: 1, marginLeft: 5  }} className='btn_save'>
                        <span>{lang.save}</span>
                    </Link>
                </div>
                <TagEdit 
                    id = {id} 
                    elementPosition={elementPosition}
                    style={{ zIndex: 3}}
                    tags={tags}
                    board={showYourElement}
                    item={showYourElementItem}
                    colors={colors}
                    boards={boards}
                    setBoards={setBoards}
                    newTagOpenInTag={newTagOpenInTag}
                    setNewTagOpenInTag={setNewTagOpenInTag}
                    setTags={setTags}
                    newInTag={newInTag}
                    setNewInTag={setNewInTag}
                    tagEditInTag={tagEditInTag}
                    setTagEditInTag={setTagEditInTag}
                />
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 0 }}></div>
                </>
            )}
        </div>
        
    )
}
 
export default Board