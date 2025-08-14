import { FaFilter, FaGears, FaPlus, FaSort } from "react-icons/fa6"
import { useNavigate } from "react-router"
import { useSidebar } from "../../Providers/SidebarProvider"

const Actions = () => {

    const { isSidebarOpen } = useSidebar()
    const redirect = useNavigate()

    return <div className="flex justify-center px-2 p-2 flex-col gap-2 md:gap-1 bg-white w-full">
        <div className={`${isSidebarOpen ? "ps-16 md:ps-60" : "ps-16"}`}>
            <h1 className="text-gray-600">Leads</h1>
            <p className="text-sm text-gray-600 truncate text-justify">Lorem ipsum, dolor sit amet consectetur.</p>
        </div>
        <div className="flex gap-2 w-full justify-end text-nowrap items-center">
            <button onClick={() => redirect("create")} className="flex items-center border-2 gap-1 border-red-600 bg-red-600 text-white p-1 px-2 rounded"><FaPlus/><span className="hidden md:flex"> Add Leads</span></button>
            <button className="flex items-center gap-1 border-2 border-black p-1 px-2 rounded"><FaFilter/><span className="hidden md:flex"> Filter</span></button>
            <button className="flex items-center gap-1 border-2 border-black p-1 px-2 rounded"><FaSort/><span className="hidden md:flex"> Sort by</span></button>
            <button className="flex items-center gap-1 p-1 px-2 rounded border-primary bg-primary border-2 text-white"><FaGears/><span className="hidden md:flex"> Actions</span></button>
        </div>
    </div>
}

export default Actions
