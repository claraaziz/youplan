import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Chapter from '../Components/Chapter.js'
import Devotional from '../Components/Devotional.js'
import axios from 'axios';
import logo from '../assets/Logo.png'

const PlanPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [plan, setPlan] = useState(null);
    const [pageCounter, setPageCounter] = useState(1);
    const [chapterCounter, setChapterCounter] = useState(0);
    const [showChapters, setShowChapters] = useState(false);
    const [showDevotional, setShowDevotional] = useState(false);

    const fetchPlans = async () => {
        try{
            const res = await axios.get(`http://localhost:5000/plans/${params.planId}`);
            setPlan(res.data);
        } catch(err) {
            console.error('Error fetching plans:', err);
        }
    }
    useEffect(() => {
        // const plans = JSON.parse(localStorage.getItem('plans')) || [];
        // const foundPlan = plans.find((p) => p.id == params.planId);
        // setPlan(foundPlan);
        fetchPlans();
    })
    // }, [params.planId]);

    if (!plan) {
        return <div>Loading... or Plan not found</div>;
    }

    const handleReadingChapters = () => {
        setShowChapters(true);
        setShowDevotional(false);
    }

    const handleReadingDevotional = () => {
        setShowDevotional(true);
        setShowChapters(false);
    }
    
    const setNext = () => {
        setPageCounter(prevCounter => {
            const newCounter = prevCounter + 1;
            return newCounter > plan.days.length ? plan.days.length : newCounter;
        });
        setChapterCounter(0);
    }

    const setPrev = () => {
        setPageCounter(prevCounter => {
            const newCounter = prevCounter - 1;
            return newCounter < 1 ? 1 : newCounter;
        });
        setChapterCounter(0);
    }

    const setNextChap = () => {
        setChapterCounter(prevCounter => {
            const newCounter = prevCounter + 1;
            const maxChapters = plan.days[pageCounter - 1]?.readings?.length || 0;
            return newCounter >= maxChapters ? maxChapters - 1 : newCounter;
        });
    }

    const setPrevChap = () => {
        setChapterCounter(prevCounter => {
            const newCounter = prevCounter - 1;
            return newCounter < 0 ? 0 : newCounter;
        });
    }

    const currentDay = plan.days[pageCounter - 1];
    const currentReading = currentDay?.readings[chapterCounter];

    return(
        <div className="bg-[#EFEFEF] min-h-screen flex flex-col items-center justify-center text-center">
      <img src={logo} alt='logo' className="max-w-xs mb-10"/>
            <div className="flex gap-x-10  items-center justify-center">
                <button onClick={setPrev} className="font-medium bg-orange-300 pl-3 pr-3 rounded-lg shadow-sm">Previous Day</button>
                <h1 className="text-3xl font-bold">{plan.title}</h1>
                <button onClick={setNext} className="font-medium bg-orange-300 pl-3 pr-3 rounded-lg shadow-sm">Next Day</button>
            </div>
            <div>
                <div className="flex gap-x-10 items-center justify-center">
                    <button onClick={handleReadingDevotional} className="bg-slate-50 pb-1 pt-1 pl-2 pr-2 rounded-md font-semibold shadow-md text-lg">Devotional</button>
                    <h2 className="font-bold text-2xl mt-5 mb-5 text-center"> Day {pageCounter}</h2>
                    <button onClick={handleReadingChapters} className="bg-slate-50 pb-1 pt-1 pl-2 pr-2 rounded-md font-semibold shadow-md text-lg">Chapters</button>
                </div>
                {showChapters && currentReading && (
                    <div>
                        <div className="flex gap-x-10  items-center justify-center">
                            <button onClick={setPrevChap} className="font-medium text-orange-400 pl-3 pr-3 rounded-lg">Prev chapter</button>
                            <button onClick={setNextChap} className="font-medium text-orange-400 pl-3 pr-3 rounded-lg">Next chapter</button>
                        </div>
                        <div>
                            <Chapter
                                bookIndex={currentReading.book}
                                chapterIndex={currentReading.chapter}
                            />
                        </div>
                    </div>
                )}
                {showDevotional && currentDay && (
                    <Devotional devotional={currentDay.devotional} />
                )}
            </div>
            <button onClick={() => navigate(-1)} className="pr-4 pl-4 pb-2 pt-1 mt-3 text-[#FF974B] rounded-full text-md font-bold">
                Go Back
            </button>
        </div>
    )
}

export default PlanPage;