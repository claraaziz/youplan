import './App.css';
import PlanList from './Pages/PlanList';
import PlanPage from './Pages/PlanPage'
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <div className='bg-[#EFEFEF] min-h-screen flex items-center justify-center text-center'>
      <div className='overflow-visible scroll-smooth m-20'>
        <Routes>
          <Route path='/' element={<PlanList/>} />
          <Route path='/plan/:planId' element={<PlanPage/>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
