import { Outlet } from "react-router-dom";
import NavBar from "../shared/components/Navbar";
import { AuthProvider } from "../context/AuthContext";



function RootLayout(){

    return(
        <>
          <AuthProvider>
            <NavBar appName={'FlexIt'}/>
            <div className="container">
              <main>
                  <Outlet></Outlet>
              </main>
            </div>
          </AuthProvider>
        </>
    )
}

export default RootLayout