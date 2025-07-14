import {BrowserRouter as Router, Routes, Route} from "react-router";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <Route path="" element={<Login />} />
                    <Route path="password">
                        <Route path="reset" element={<ResetPassword />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}

export default App;
