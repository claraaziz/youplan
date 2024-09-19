import { useState } from "react";
import books from "../Books.json";
import axios from "axios";

const Create = ({ plans, setPlans, handleAddBtn }) => {
    const booksArray = Object.entries(books);
    const [newPlan, setNewPlan] = useState("");
    const [days, setDays] = useState([
        {  devotional: '', readings: [{ book: '', chapter: '' }] }
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios.post('http://localhost:5000/plans', {title: newPlan, days:days})
            setPlans([...plans, { title: newPlan, days: days }]);
            setNewPlan("")
            handleAddBtn();
        } catch(err){
            console.error('error creating plan: ', err.response?.data || err.message);
        }
        
    };

    const addDay = () => {
        setDays([...days, { devotional: '', readings: [{ book: '', chapter: '' }] }]);
        console.log({ newPlan, days });
    };

    const handleDayChange = (dayIndex, field, value) => {
        const newDays = [...days];
        newDays[dayIndex][field] = value;
        setDays(newDays);
    };

    const removeDay = (dayIndex) => {
        setDays(days.filter((_, index) => index !== dayIndex));
    };

    const addReading = (dayIndex) => {
        const newDays = [...days];
        newDays[dayIndex].readings.push({ book: '', chapter: '' });
        setDays(newDays);
    };

    const handleReadingChange = (dayIndex, readingIndex, field, value) => {
        const newDays = [...days];
        newDays[dayIndex].readings[readingIndex][field] = value;
        setDays(newDays);
    };

    const removeReading = (dayIndex, readingIndex) => {
        const newDays = [...days];
        newDays[dayIndex].readings = newDays[dayIndex].readings.filter((_, index) => index !== readingIndex);
        setDays(newDays);
    };

    return (
        <>
            <h1 className="text-2xl font-extrabold">Create a new plan</h1>
            <form onSubmit={handleSubmit} className="mt-4 bg-slate-50 rounded-lg shadow-lg p-5">
                <label htmlFor="title" className="text-left font-medium">Title: </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    onChange={e => setNewPlan(e.target.value)}
                    required
                    placeholder="Plan Name"
                    className="pl-2 pr-2 pt-1 pb-2 rounded-sm shadow-sm mt-1 text-sm text-left" 
                /> <br />
                {days.map((day, dayIndex) => (
                    <div key={dayIndex} className=" mt-2 mb-2">
                        <h2 className="text-lg font-medium">Day {dayIndex + 1}</h2>
                        <label className="text-left" htmlFor={`devotional-${dayIndex}`}>Devotional message: </label> <br />
                        <textarea
                            className="w-full pl-2 pr-2 pt-1 pb-2 rounded-sm shadow-sm mt-1 text-sm"
                            id={`devotional-${dayIndex}`}
                            value={day.devotional}
                            onChange={(e) => handleDayChange(dayIndex, 'devotional', e.target.value)}
                            placeholder="Devotional"
                        /> <br />
                        {day.readings.map((reading, readingIndex) => (
                            <div key={readingIndex} className="">
                                <div className="">
                                    <label htmlFor={`book-${dayIndex}-${readingIndex}`}>Book: </label>
                                    <select
                                        id={`book-${dayIndex}-${readingIndex}`}
                                        value={reading.book}
                                        onChange={(e) => handleReadingChange(dayIndex, readingIndex, 'book', e.target.value)}
                                        required
                                        className="pl-2 pr-2 pt-1 pb-2 rounded-sm shadow-sm mt-1 text-sm w-" >
                                        <option value="">Select a book</option>
                                        {booksArray.map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor={`chapter-${dayIndex}-${readingIndex}`}>Chapter: </label>
                                    <input
                                        id={`chapter-${dayIndex}-${readingIndex}`}
                                        type="number"
                                        value={reading.chapter}
                                        onChange={(e) => handleReadingChange(dayIndex, readingIndex, 'chapter', e.target.value)}
                                        placeholder="Chapter"
                                        min="1"
                                        required
                                        className="pl-2 pr-2 pt-1 pb-2 rounded-sm shadow-sm mt-1 text-sm"
                                    />
                                </div>
                                <div className="">
                                    {
                                        (readingIndex >= 1) && <button
                                        className="text-center text-red-400 text-sm font-bold mt-2 pl-2 pr-2 rounded-md pt-1 pb-2 "
                                        type="button"
                                        onClick={() => removeReading(dayIndex, readingIndex)}>
                                        Remove Chapter
                                    </button>
                                    }
                                </div>
                            </div>
                        ))}
                            <button
                                type="button"
                                onClick={() => addReading(dayIndex)}
                                className="mt-4 mb-4 text-blue-400 rounded-md pl-2 pr-2 pt-1 pb-1 font-bold text-sm"
                            >
                                Add Chapter
                            </button>
                            {
                                dayIndex >=1 && <button
                                type="button"
                                onClick={() => removeDay(dayIndex)}
                                className=" bg-red-400 rounded-md text-white pl-2 pr-2 pt-1 pb-1 font-bold text-sm"
                            >
                                Remove Day
                            </button>
                            } <br />
                    </div>
                ))}
                <button type="button" onClick={addDay} className="text-left bg-blue-400 rounded-md text-white pl-2 pr-2 pt-1 pb-1 font-bold mb-5">Add Day</button> <br />
                <button type="submit" className="text-center bg-orange-300 pb-2 pt-1 pl-2 pr-2 rounded-lg text-md font-bold">Create Plan</button>
            </form>
        </>
    );
};

export default Create;
