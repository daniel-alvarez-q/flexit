import { useEffect, type ReactNode } from 'react'
import './popup.css'

type PopupProps = {
    title:string;
    children:ReactNode;
    onClose: ()=> void;
}

function Popup({title, children, onClose}:PopupProps){

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    return(
        <div className='modal-overlay'>
            <div className="modal">
                <div 
                    className="modal-close" 
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </div>
                <div className="modal-title">{title}</div>
                {children}
            </div>
        </div>
    )
}

export default Popup