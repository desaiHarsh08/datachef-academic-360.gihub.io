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
import { useEffect } from "react";
import { gapi } from 'gapi-script'

function App() {

  const clientId = process.env.REACT_APP_CLIENT_ID;

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    }
  }, [])
  
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
        <Route exact path="/edit" element={<EditStudent />} />
      </Routes>
    </Router>
  );
}

export default App;
