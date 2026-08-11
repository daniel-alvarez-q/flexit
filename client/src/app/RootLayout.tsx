import { Outlet } from "react-router-dom";
import { useState } from "react";
import NavBar from "../shared/components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { customQueryClient } from "../context/QueryContext";
import Signup from "../features/signup";
import Signin from "../features/signin";



function RootLayout() {

    const [signupActive, setSignupActive] = useState<boolean>(false)
    const [signinActive, setSigninActive] = useState<boolean>(false)

    return (
        <>
            <QueryClientProvider client={customQueryClient}>
                <AuthProvider>
                    <NavBar appName={'FlexIt!'} signupDisplayHandler={setSignupActive} signinDisplayHandler={setSigninActive} />
                    <main className="container">
                        <Outlet></Outlet>
                    </main>
                    {signupActive ?
                        <Signup displayFlagHandler={setSignupActive} />
                        : signinActive &&
                        <Signin displayHandler={setSigninActive} />
                    }
                </AuthProvider>
            </QueryClientProvider>
        </>
    )
}

export default RootLayout