import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import instance from'./auth_interceptor.tsx'
import './App.css'

import NavBar from './shared/components/Navbar/index.ts'

type Workout = {id: string; name:string}

const navLinks = [
  {'uri':'/workouts', 'descriptor': 'Workouts'},
  {'uri':'/exercises', 'descriptor': 'Exercises'}
]

const sessionLinks = [
  {'uri':'/login', 'descriptor': 'Login'},
  {'uri':'/signup', 'descriptor': 'Signup'}
]

function App() {
  const [data, setData] = useState<Workout[]>([])

  function retrieveWorkouts(){
    instance.get('api/workouts')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error feching data: ', error);
      });
  }

  return (
    <>
    <NavBar appName={'FlexIt'} navLinks={navLinks} sessionLinks={sessionLinks}/>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={retrieveWorkouts}>
          Workouts!
        </button>
      </div>
      <ul>
        {
          data.length > 0 ? data.map(workout =>
          <li key={workout.id}>
            {workout.name} 
          </li>) : <div className="section-message">Could not retrieve workouts!</div>
        }
      </ul>
    </>
  )
}

export default App
