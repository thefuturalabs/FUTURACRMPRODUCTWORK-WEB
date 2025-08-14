import { FaBars, FaChevronLeft } from "react-icons/fa"
import { GoChecklist } from "react-icons/go"
import { useSidebar } from "../Providers/SidebarProvider";
import { Fragment } from "react";
import logo from "../assets/images/logo2.svg"

const menuOptions = [
    {icon: <GoChecklist/>, label: "Leads"}
]

const SideBar = () => {

    const { isSidebarOpen, setSidebarOpen } = useSidebar()

    return <Fragment>
        <div className={`fixed bg-white z-[2] py-4 h-screen transition-all shadow shadow-gray-400 duration-300 ${isSidebarOpen ? "w-60" : "w-16"}`}>
            <div className="mx-2 flex flex-nowrap">
                {
                    isSidebarOpen && <div className="h-10">
                        <img src={logo} alt="logo" className="object-contain h-full" />
                    </div>
                }
                <span onClick={() => setSidebarOpen(sidebar => !sidebar)} className="inline-flex flex-shrink-0 w-12 h-12 items-center justify-center cursor-pointer rounded-full hover:bg-slate-200">{isSidebarOpen ? <FaChevronLeft /> : <FaBars />}</span>
            </div>

            <ul className={`my-4 px-1 ${isSidebarOpen ? "items-start" : "items-center"} whitespace-nowrap flex flex-col overflow-x-hidden mt-5`}>
                {
                    menuOptions.map((item, idx) => {
                        return <li key={idx} className={`flex ${isSidebarOpen ? "gap-5 items-center" : "justify-center "} w-full px-4 hover:bg-primary hover:text-white duration-200 rounded py-2 cursor-pointer`}>
                            <span className="inline-block ">{item.icon}</span>
                            {isSidebarOpen && <span>{item.label}</span>}
                        </li>
                    })
                }
            </ul>
        </div>

        <div className={`flex-shrink-0 h-screen w-16 ${isSidebarOpen && "md:w-60"}`}>
      
        </div>
    </Fragment>
}

export default SideBar