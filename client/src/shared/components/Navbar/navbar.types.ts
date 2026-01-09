export type NavbarLinks = {
    uri:string;
    descriptor:string;
}

export type NavbarConfig = {
    appName:string;
    navLinks: Array<NavbarLinks>;
    sessionLinks: Array<NavbarLinks>;
}