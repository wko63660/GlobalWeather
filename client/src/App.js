// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import './App.css';
import Login from './pages/Login';
import UserPage from './pages/UserPage';
import { AdminMainPage } from './pages/admin';
import DisplayMap from './components/map';
import HistorialChart from './components/HistorialChart';
import PastHoursChart from './components/Past10HoursWeather';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <ProtectedRoute /> */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/user/*" element={<UserPage />} />
            <Route path="/admin/*" element={<AdminMainPage />} />
          </Route>
        </Routes>
      </Router>
      {/* <div>
        <PastHoursChart location={"Hong Kong"} />
      </div>
      <div>
        <DisplayMap />
      </div> */}
    </div>
  );
}

export default App;
