import { Outlet } from "react-router-dom";
import NavBar from "../shared/components/Navbar";

const navLinks = [
  {'uri':'/workouts', 'descriptor': 'Workouts'},
  {'uri':'/exercises', 'descriptor': 'Exercises'}
]

const sessionLinks = [
  {'uri':'/login', 'descriptor': 'Login'},
  {'uri':'/signup', 'descriptor': 'Signup'}
]

function RootLayout(){
    return(
        <>
            <NavBar appName={'FlexIt'} navLinks={navLinks} sessionLinks={sessionLinks}/>
            <div className="container">
              <main>
                  <Outlet></Outlet>
              </main>
            </div>
        </>
    )
}

export default RootLayout