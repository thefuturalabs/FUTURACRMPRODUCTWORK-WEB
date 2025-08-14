import { FaBuilding, FaList } from "react-icons/fa6";
import { HiOutlineAtSymbol, HiOutlinePhone, HiOutlineUser } from "react-icons/hi";
import { RiUserSearchLine } from "react-icons/ri"
import { GiOnTarget, GiSandsOfTime } from "react-icons/gi"
import { VscTypeHierarchySub } from "react-icons/vsc";
import { MdOutlineArrowLeft, MdOutlineHeadsetMic, MdOutlineSave } from "react-icons/md"
import { useNavigate } from "react-router";
import SideBar from "../../components/SideBar";
import HeaderLeads from "../../components/Leads/HeaderLeads";

const AddLeads = () => {
    
    const navigate = useNavigate()

    const handleLeadsForm = (formData) => {
        const formFields = Array.from(formData)
        console.log(formFields)
    }

    return (
        <div className="flex">
            <SideBar />
            <HeaderLeads />
            <div className="p-3 mt-16 flex gap-3 flex-col w-full">
                <div>
                    <h2 className="text-lg">Get in touch</h2>
                </div>
                <form action={handleLeadsForm} className="flex gap-5 flex-col">
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full bg-white flex items-center">
                            <HiOutlinePhone className="p-3 text-5xl" color="gray"/>
                            <input type="text" placeholder="Number" name="number" className="p-3 w-full outline-none"/>
                        </div>
                        <div className="w-full bg-white flex items-center">
                            <HiOutlineUser className="p-3 text-5xl" color="gray"/>
                            <input type="text" placeholder="Name" name="name" className="p-3 w-full outline-none"/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full bg-white flex items-center">
                            <HiOutlineAtSymbol className="p-3 text-5xl" color="gray"/>
                            <input type="text" placeholder="Email (Eg: vish*****@gmail.com)" name="email" className="p-3 w-full outline-none"/>
                        </div>
                        <div className="w-full bg-white flex items-center">
                            <RiUserSearchLine  className="p-3 text-5xl" color="gray"/>
                            <input readOnly type="text" placeholder="Enquiry Source" name="enquiry_source" className="p-3 w-full outline-none"/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full bg-white flex items-center">
                            <GiSandsOfTime className="p-3 text-5xl" color="gray"/>
                            <input readOnly type="text" placeholder="Enquiry Status" name="enquiry_status" className="p-3 w-full outline-none"/>
                        </div>
                        <div className="w-full bg-white flex items-center">
                            <GiOnTarget className="p-3 text-5xl" color="gray"/>
                            <input readOnly type="text" rows={1} placeholder="Purpose" name="purpose" className="p-3 w-full outline-none resize-none"/>
                        </div>
                    </div>
                    <div className="w-full bg-white flex items-center">
                        <FaBuilding className="p-3 text-5xl" color="gray"/>
                        <textarea rows={1} placeholder="Address" name="address" className="p-3 w-full resize-none outline-none"/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full bg-white flex items-center">
                            <VscTypeHierarchySub className="p-3 text-5xl" color="gray"/>
                            <input type="text" placeholder="Type" name="type" className="p-3 w-full outline-none resize-none"/>
                        </div>
                        <div className="w-full bg-white flex items-center">
                            <MdOutlineHeadsetMic className="p-3 text-5xl" color="gray"/>
                            <input type="text" placeholder="Agent" name="agent" className="p-3 w-full resize-none outline-none"/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full bg-white flex items-center">
                            <FaBuilding className="p-3 text-5xl" color="gray"/>
                            <input type="text" placeholder="Company Name" name="company_name" className="p-3 w-full outline-none resize-none"/>
                        </div>
                        <div className="w-full bg-white flex items-center">
                            <FaList className="p-3 text-5xl" color="gray"/>
                            <input type="text" placeholder="Course" name="course" className="p-3 w-full outline-none resize-none"/>
                        </div>
                    </div>
                    <div className="flex justify-end mt-3 gap-3">
                        <button type="button" onClick={() => navigate(-1)} className="bg-red-600 text-white p-1 rounded-sm px-2 flex items-center gap-1"><MdOutlineArrowLeft /> Back</button>
                        <button className="bg-primary text-white p-1 rounded-sm px-2 flex items-center gap-1"><MdOutlineSave/> Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddLeads
