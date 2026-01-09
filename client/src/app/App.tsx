import {useRoutes} from 'react-router-dom'
import {routes} from './routes.tsx'

import '../App.css'

function App(){
  return useRoutes(routes)
}

export default App
