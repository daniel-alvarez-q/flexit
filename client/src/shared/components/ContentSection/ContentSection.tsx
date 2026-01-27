import type { ReactNode } from 'react';
import './contentSection.css'

type ContentSectionProps = {
    title?: string;
    children: ReactNode;
    variant?: 'default' | 'elevated' | 'outlined' | 'minimal';
    padding?: 'compact' | 'default' | 'spacious';
    className?: string;
}

function ContentSection({
    title, 
    children, 
    variant = 'default',
    padding = 'default',
    className = ''
}: ContentSectionProps) {
    const classNames = [
        'content-section',
        `content-section--${variant}`,
        `content-section--${padding}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames}>
            {title && (
                <div className="content-section__header">
                    <h2 className="content-section__title">{title}</h2>
                </div>
            )}
            <div className="content-section__body">
                {children}
            </div>
        </div>
    )
}

export default ContentSection