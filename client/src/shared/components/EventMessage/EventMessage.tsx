import './eventMessage.css'

type EventMessageProps = {
    message?: string;
    style?: string;
}

function EventMessage({message, style='error'}: EventMessageProps){
    return <div className={"message " + style}>{message}</div>
}

export default EventMessage