import {BrowserRouter as Router,Routes,Route} from "react-router-dom";

import Registration from './components/Registration';
import Login from "./components/Login"
import Dashboard from "./components/Dashboard";
import Invoice from "./components/Invoice";
import Records from "./components/Records"

function App() {
  return (
    <Router>
    <Routes>
      <Route exact path="/registration" element={<Registration/>}></Route>
      <Route exact path="/dashboard" element={<Dashboard/>}></Route>
      <Route exact path="/records" element={<Records/>}></Route>
      <Route exact path="/invoice" element={<Invoice/>}></Route>
      <Route exact path="/" element={<Login/>}></Route>
      </Routes>
     </Router>
  );
}

export default App;
