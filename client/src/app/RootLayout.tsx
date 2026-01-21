import { Outlet } from "react-router-dom";
import NavBar from "../shared/components/Navbar";
import { AuthProvider } from "../context/AuthContext";



function RootLayout(){

    return(
        <>
          <AuthProvider>
            <NavBar appName={'FlexIt!'}/>
              <main className="container">
                  <Outlet></Outlet>
              </main>
          </AuthProvider>
        </>
    )
}

export default RootLayout