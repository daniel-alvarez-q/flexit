import type { ReactNode } from 'react';
import './contentSection.css'

type ContentSectionProps = {
    title?: string;
    loading?: boolean;
    children: ReactNode;
    variant?: 'default' | 'elevated' | 'outlined' | 'minimal';
    padding?: 'compact' | 'default' | 'spacious';
    className?: string;
}

function ContentSection({
    title,
    loading = false, 
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
                {loading ? 
                    <div className="content-section__loading" role="status" aria-label="Loading content">
                        <span className="content-section__skeleton content-section__skeleton--wide" />
                        <span className="content-section__skeleton content-section__skeleton--medium" />
                        <span className="content-section__skeleton content-section__skeleton--short" />
                    </div>
                :
                children}
            </div>
        </div>
    )
}

export default ContentSection
