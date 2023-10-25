
import './App.css';
import Signup from './sections/Signup';
import Login from './sections/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './sections/Dashboard';

function App() {
  return (
    <>
    <ToastContainer />
    <Router>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
      </Router>
      </>
  );
}

export default App;
