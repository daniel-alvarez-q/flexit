import { NavLink } from 'react-router-dom';
import './table.css'
import type { tableProps } from './table.types';

function Table<Type>({data, columns, rowKey = 'id' as keyof Type}:tableProps<Type>){

    
    return(
         <table className="table-custom">
            <thead>
                <tr>
                    {columns.map((column, idx) =>
                        <th key={idx}>{column.header}</th>
                    )} 
                </tr>                  
            </thead>
            <tbody>
                {data.map(row=>
                    <tr key={String(row[rowKey])}>
                        {columns.map((column, idx)=>
                            <td key={idx}> {column.uri ? <NavLink to={`${column.uri}/${idx}`}>{String(row[column.key])}</NavLink>:String(row[column.key])}</td>
                        )}
                    </tr>
                )}
            </tbody>

        </table>
    )
}

export default Table