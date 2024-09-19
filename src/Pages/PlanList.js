import React, { useState, useEffect } from "react";
import Create from '../Components/Create'
import { Link } from 'react-router-dom';
import axios from "axios";
import logo from '../assets/Logo.png'

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [add, setAdd] = useState(false);

  const handleAddBtn = () => {
    setAdd(!add);
  }

  // useEffect(() => {
  //   localStorage.setItem('plans', JSON.stringify(plans));
  // }, [plans]);

  const fetchPlans = async () => {
    try{
      const response = await axios.get('http://localhost:5000/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, [plans])

  const removePlan = async (planId) => {
    try{
      await axios.delete(`http://localhost:5000/plans/${planId}`)
      const newPlans = plans.filter(plan => plan._id !== planId);
      setPlans(newPlans);
    } catch (err) {
        console.error('Error removing plan:', err); 
    }
};

  return (
    <div className="bg-[#EFEFEF] min-h-screen flex flex-col items-center justify-center text-center">
      <img src={logo} alt='logo' className="max-w-xs mb-10 "/>
      {/* <h1 className="text-3xl font-extrabold pb-3 pt-5">Your Plans</h1> */}
      
      {add ? <div>
        <Create plans={plans} setPlans={setPlans} handleAddBtn={handleAddBtn}/>
        <button onClick={handleAddBtn} className="pr-4 pl-4 pb-2 pt-1 mt-3 text-[#FF974B] rounded-full text-md font-bold">Go back</button>
      </div>
      : <div>
      {plans.map((p) => (
        <div key={p._id} className="bg-slate-50 p-5 pl-10 pr-10 rounded-xl shadow-lg mb-2">
          <h3 className="text-xl font-bold text-left">{p.title}</h3>
          <p className="text-lg font-medium text-left mb-5">{p.days.length} days</p>
          <Link to={`/plan/${p._id}`} className="bg-orange-300 pt-2 pb-2 pl-3 pr-3 m-2 rounded-lg font-semibold">View Plan</Link>
          <button onClick={() => removePlan(p._id)} className="bg-red-400 text-white pt-2 pb-2 pl-3 pr-3 rounded-lg font-semibold">Remove</button>
        </div>
      ))}
    <button onClick={handleAddBtn} className="pr-4 pl-4 pb-2 pt-1 mt-3 bg-orange-300 rounded-full text-3xl font-bold shadow-md">+</button>
    </div> }
    </div>
  );
}

export default PlanList;