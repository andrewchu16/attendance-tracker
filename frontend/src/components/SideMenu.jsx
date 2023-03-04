import { NavLink } from "react-router-dom";

function SideMenu() {
    return (
        <nav className="bg-gray-100 flex flex-col h-full w-full justify-center items-center">
            <div className="flex flex-col gap-3 text-xl">
                <NavLink className={({ isActive }) => isActive ? "font-semibold" : "" } to="/">Student List</NavLink>
                <NavLink className={({ isActive }) => isActive ? "font-semibold" : "" } to="/upload-attendance">Attendance Photos</NavLink>
                <NavLink className={({ isActive }) => isActive ? "font-semibold" : "" } to="/upload-student">Upload Student</NavLink>
            </div>
        </nav>
    )
}

export default SideMenu;