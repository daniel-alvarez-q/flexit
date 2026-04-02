export type NavbarLinks = {
    uri?:string;
    descriptor:string;
    handler?:React.Dispatch<boolean>;
}

export type NavbarConfig = {
    appName:string;
    signupDisplayHandler: React.Dispatch<boolean>;
    signinDisplayHandler: React.Dispatch<boolean>;
}