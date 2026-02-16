import { Outlet } from "react-router-dom";
import NavBar from "../shared/components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../context/QueryContext";



function RootLayout(){

    return(
        <>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <NavBar appName={'FlexIt!'}/>
                    <main className="container">
                        <Outlet></Outlet>
                    </main>
                </AuthProvider>
            </QueryClientProvider>
        </>
    )
}

export default RootLayout