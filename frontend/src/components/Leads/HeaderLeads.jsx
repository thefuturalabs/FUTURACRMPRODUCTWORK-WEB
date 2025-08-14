import { IoGrid } from "react-icons/io5";
import { VscBellDot } from "react-icons/vsc";
import defaultUserAvatar from "../../assets/images/user-avatar.png"

const HeaderLeads = ({ children }) => {
    return <div className="flex z-[1] flex-col h-16 items-end gap-3 w-full fixed top-0 right-0 bg-white">
        <div className="flex gap-4 items-center p-2">
            <div className="w-8 h-8 rounded-full flex justify-center items-center bg-white">
                <IoGrid color="red"/>
            </div>
            <div className="w-8 h-8 rounded-full flex justify-center items-center bg-white">
                <VscBellDot />
            </div>
            <div className="flex items-center gap-2">
                <div className="">Vishnu M K</div>
                <div>
                    <img src={defaultUserAvatar} alt="user avatar" className="rounded-full w-8 h-8"/>
                </div>
            </div>
        </div>
        {children}
    </div>
}

export default HeaderLeads
