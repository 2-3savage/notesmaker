import React from 'react'
import { AiOutlineClose } from "react-icons/ai";
import { Transition } from "react-transition-group"
import "./ModalDialogBoard.css"

const ModalDialogBoard = ( { isOpen, onClose, children }) => {
    const onWrapperClick = (event) =>{
        const container = document.querySelector(`.modal_content`);
        if (!container.contains(event.target)) {
            onClose()
        }
    }
    return (
        <>
        <Transition in={isOpen} timeout={250} unmountOnExit={true}>
        {state => (
            <div className={ `modal modal__${state}` } onClick={onWrapperClick}>
                <div className={ `modal_content` }>
                    { children }
                </div>
            </div>
        )}
        </Transition>
        </>
    )
}

export default ModalDialogBoard
