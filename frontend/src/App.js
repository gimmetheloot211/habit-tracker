import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

import Home from './pages/Home';
import Navbar from './components/Navbar'
import Login from './pages/Login';
import Signup from './pages/Signup';
import WeekDetails from './pages/WeekDetails';
import YearWeeks from './pages/YearWeeks';
import Habits from './pages/Habits';

function App() {
  const { user, isLoading} = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className='pages'>
          <Routes>
            <Route path="/" element={user ? <Home/> : <Navigate to="/login"/>}></Route>
            <Route path="/week/:weekID" element={user ? <WeekDetails/> : <Navigate to="/login"/>}></Route>
            <Route path="/weeks/:year" element={user ? <YearWeeks/> : <Navigate to="/login"/>}></Route>
            <Route path="/habits" element={user ? <Habits/> : <Navigate to="/login"/>}></Route>
            
            <Route path="/login" element={!user ? <Login/> : <Navigate to ="/"/>}></Route>
            <Route path="/signup" element={!user ? <Signup/> : <Navigate to ="/"/>}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
