import { NavLink } from "react-router-dom";
import logo from './eye.jpg';

function SideMenu() {
    return (
        <nav className="bg-gray-100 flex flex-col h-full w-full justify-start items-center">
            <img src={logo} className="my-12"/>
            <div className="flex flex-col gap-3 text-xl pl-2">
                <NavLink className={({ isActive }) => isActive ? "font-semibold" : "" } to="/">Student List</NavLink>
                <NavLink className={({ isActive }) => isActive ? "font-semibold" : "" } to="/upload-attendance">Attendance Photos</NavLink>
                <NavLink className={({ isActive }) => isActive ? "font-semibold" : "" } to="/upload-student">Upload Student</NavLink>
            </div>
        </nav>
    )
}

export default SideMenu;