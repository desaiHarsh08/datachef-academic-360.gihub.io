import DashboardHome from "./components/DashboardHome";
import Dashboard from "./pages/Dashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./pages/Home";
import AddStudent from "./components/AddStudent";
import EditStudent from "./components/EditStudent";
import SearchStudent from "./components/SearchStudent";
import DeleteStudent from "./components/DeleteStudent";
import Settings from "./components/Settings";


function App() {




  
  return (
    <Router>
      <div className="App">

      </div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/dashboard" element={<Dashboard />}>
          <Route exact path="" element={<DashboardHome />} />
          <Route exact path="add" element={<AddStudent />} />
          <Route exact path="search" element={<SearchStudent />} />
          <Route exact path="delete" element={<DeleteStudent />} />
          <Route exact path="settings" element={<Settings />} />
        </Route>
        <Route exact path="/view" element={<EditStudent />} />
      </Routes>
    </Router>
  );
}

export default App;
