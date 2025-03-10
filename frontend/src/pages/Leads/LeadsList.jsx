import Actions from "../../components/Leads/Actions";
import HeaderLeads from "../../components/Leads/HeaderLeads";
import SideBar from "../../components/SideBar";
import Table from "../../components/Leads/Table";

const LeadsList = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="w-auto overflow-auto">
                <div>
                    <HeaderLeads children={<Actions />} />
                </div>
                <div className="overflow-auto flex pt-40">
                    <Table />
                </div>
            </div>
        </div>
    )
}

export default LeadsList;
