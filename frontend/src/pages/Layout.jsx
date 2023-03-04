import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu";

function Layout() {
    return (
    <div className="flex h-screen w-screen">
        <div className="basis-[12%]">
            <SideMenu />
        </div>
        <div className="flex-grow wrapper">
            <Outlet />
        </div>
    </div>
    );
}

export default Layout;