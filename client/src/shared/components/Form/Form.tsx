import './form.css'
import type { CustomFormProps } from './form.types'

function Form({handler, elements}:CustomFormProps){

    const fields = elements.map(element =>{
        return(
            <div className="form-group">
                <div className="form-row">
                    <label htmlFor={element.id}>element.title</label>
                </div>
                <div className="form-row">
                    {element.elementType ?
                        <element.elementType name={element.name} id={element.id} onChange={(e) => element.stateObject.setState({...element.stateObject.state, [element.name]: e.target.value})}>
                            {element.options &&
                                element.options.map(o => {
                                    return <option value={o.value}>o.label</option>
                                })
                            }
                        </element.elementType>
                        :
                        <input type={element.type} name={element.name} id={element.id} onChange={(e)=> element.stateObject.setState({...element.stateObject.state, [element.name]:e.target.value})}/>
                    }
                </div>
            </div>
        )
    })
    return (
    <form onSubmit={handler}>
        {fields}
        <div className="form-group">
            <div className="form-row">
                <button className="btn-secondary btn-md">Create</button>
            </div>
        </div>
    </form>)
}

export default Form