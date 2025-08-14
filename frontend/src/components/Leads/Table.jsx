import { FaGears } from "react-icons/fa6";
import { HiMiniEllipsisVertical } from "react-icons/hi2";
import { leadsList } from "../../Constants/dummyList";

const Table = () => {

    const handleAllSelected = ({ target: { checked } }) => {
        const checkBox = document.querySelectorAll("input[type=checkbox]")
        Array.from(checkBox).forEach(element => element.checked = checked ? true : false)
    }

    return <table className="m-2 bg-white shadow shadow-gray-500">
        <thead>
            <tr className="truncate bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <th className="p-3 relative flex items-center">
                    <input type="checkbox" name="" onChange={handleAllSelected} id="" className="appearance-none peer cursor-pointer border-2 border-primary rounded-sm w-4 h-4 checked:bg-primary" />
                    <span className="absolute top-1/2 opacity-0 peer-checked:opacity-100 text-white left-1/2 pointer-events-none  transform -translate-x-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                    </span>
                </th>
                <th className="p-3"><FaGears /></th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Purpose</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Source</th>
                <th className="p-3">Email</th>
                <th className="p-3">Address</th>
            </tr>
        </thead>
        <tbody>
            {
                leadsList.map((item, index) => {
                    return (
                        <tr className="truncate hover:bg-gray-100 cursor-pointer" key={index}>
                            <td className="p-3 relative flex items-center">
                                <input type="checkbox" name=""  id="" className="appearance-none peer cursor-pointer border-2 border-primary rounded-sm w-4 h-4 checked:bg-primary" />
                                <span className="absolute top-1/2 opacity-0 peer-checked:opacity-100 text-white left-1/2 pointer-events-none  transform -translate-x-1/2 -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </td>
                            <td className="p-3"><HiMiniEllipsisVertical /></td>
                            <td className="p-3">{item.name}</td>
                            <td className="p-3">{item.phone}</td>
                            <td className="p-3">{item.assignedTo}</td>
                            <td className="p-3">{item.purpose}</td>
                            <td className="p-3">{item.type}</td>
                            <td className="p-3">{item.status}</td>
                            <td className="p-3">{item.source}</td>
                            <td className="p-3">{item.email}</td>
                            <td className="p-3">{item.address}</td>
                        </tr>
                    );
                })
            }
        </tbody>
      </table>
}

export default Table;
