import {BrowserRouter as Router, Routes, Route} from "react-router";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import LeadsList from "./pages/Leads/LeadsList";
import AddLeads from "./pages/Leads/AddLeads";
import NotFoundError from "./pages/NotFoundError";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <Route path="" element={<Login />} />
                    <Route path="password">
                        <Route path="reset" element={<ResetPassword />} />
                    </Route>
                    <Route path="leads">
                        <Route path="" element={<LeadsList />} />
                        <Route path="create" element={<AddLeads />} />
                    </Route>
                </Route>
                <Route path="*" Component={NotFoundError} />
            </Routes>
        </Router>
    )
}

export default App;
