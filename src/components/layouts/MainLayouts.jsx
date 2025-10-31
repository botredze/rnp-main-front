import {Outlet,} from "react-router-dom";
import SideBar from "../sideBar/SideBar.jsx";
import './style.scss';

const MainLayouts = () => {

    return (
        <div className="mainPage">
            <SideBar/>
            <div className="mainContent">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayouts