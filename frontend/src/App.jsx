import React, {useState} from 'react'
import './App.css'
import {BrowserRouter as Router , Route , Routes,Navigate} from 'react-router-dom' 
import {Toaster} from 'react-hot-toast'
// import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify'
import RefrshHandler from './RefrshHandler'
import UploadDataset from './pages/Dashboard/UploadDataset'
import ViewProcessedDatasets from './pages/Dashboard/ViewProcessedDatasets'
import PreprocessedDatasets from './pages/Dashboard/PreprocessedDatasets'
import DashboardHome from './pages/Dashboard/DashboardHome';
function App() {
 const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div>
      <Router>
         <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route 
          path='/'
          element= {<LandingPage/>}
          />
          <Route 
          path='/login'
          element= {<Login/>}
          />
          <Route 
          path='/signup'
          element= {<Signup/>}
          />
         <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />  {/* ✅ Dashboard home */}
        <Route path="preprocess" element={<PreprocessedDatasets />} />
        <Route path="upload" element={<UploadDataset />} />
        <Route path="processed" element={<ViewProcessedDatasets />} />
      </Route>

           
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  )
}

export default App
