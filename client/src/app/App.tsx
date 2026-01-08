import {Routes, Route} from 'react-router-dom'

import {useRoutes} from 'react-router-dom'
import {routes} from './routes.tsx'

import Home from '../features/home/index.ts'
import Login from '../features/login/index.ts'
import '../App.css'

// function App() {
//   const [data, setData] = useState<Workout[]>([])

//   function retrieveWorkouts(){
//     instance.get('api/workouts')
//       .then(response => {
//         setData(response.data);
//       })
//       .catch(error => {
//         console.error('Error feching data: ', error);
//       });
//   }

//   return (
//     <>
//     <NavBar appName={'FlexIt'} navLinks={navLinks} sessionLinks={sessionLinks}/>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={retrieveWorkouts}>
//           Workouts!
//         </button>
//       </div>
//       <ul>
//         {
//           data.length > 0 ? data.map(workout =>
//           <li key={workout.id}>
//             {workout.name} 
//           </li>) : <div className="section-message">Could not retrieve workouts!</div>
//         }
//       </ul>
//     </>
//   )
// }

function App(){
  return useRoutes(routes)
}

export default App
