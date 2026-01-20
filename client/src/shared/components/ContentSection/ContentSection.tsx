import type { ReactNode } from 'react';
import './contentSection.css'

type ContentSectionProps = {
    title:string;
    children:ReactNode;
}

function ContentSection({title, children}:ContentSectionProps){
    return(<div className='content-section'>
        <div className="title">
            {title}
        </div>
        <div className="content">
            {children}
        </div>
    </div>)
}

export default ContentSection