import React, { useEffect, useState } from 'react';
import { FaWallet } from "react-icons/fa";
import BarChart from './BarChart';
import { Link, useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExpenses } from '../Redux/expensesSlice';
import api from '../axiosconfig'
import Loader from './Loader';
import MessageAlerter from './MessageAlerter';
import { getFirstErrorMessage } from '../utils/ErrorExtractor';

const UserDashboard = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const [refreshChart, setRefreshChart] = useState(false);

    const is_admin = useSelector(state => state.user.is_admin)

    // for notifications--
    const [alert, setAlert] = useState({ type: false, message: '' });
    const showAlert = (type, message) => {
        setAlert({ type, message });
    };

    // to handle deletion message--
    useEffect(() => {
        if (location.state?.message) {
            showAlert(false, location.state.message); //getting message from url state

            // Clear state after showing the message
            const timeout = setTimeout(() => {
                navigate(location.pathname, { replace: true, state: {} });
            }, 100); // slight delay ensures the message is rendered

            return () => clearTimeout(timeout);
        }
    }, [location, navigate]);


    // gettting values from expense slice--
    const expenses = useSelector(state => state.expenses.expenses)
    const isloading = useSelector(state => state.expenses.loading)
    const iserror = useSelector(state => state.expenses.error)
    const totalExpense = useSelector(state => state.expenses.totalAmount)

    const [fcategory, setFcategory] = useState('')
    const [fstart_date, setStartdate] = useState('')
    const [fend_date, setEnddate] = useState('')


    // for managing form to add expense--
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');

    // adding new expense --
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !amount || !category || !date) {
            showAlert(false, 'Please fill in all required fields.');
            return false;
        }
        // checkig if amount is negative --
        if (Number(amount) < 1) {
            showAlert(false, 'Amount must be at least ₹1.00');
            return false;
        }

        const newExpense = {
            title,
            amount,
            category,
            note,
            date,
        };

        try {
            const response = await api.post('/expenses/', newExpense);
            console.log(response.data)
            dispatch(fetchExpenses());
            showAlert(true, 'Expense added succesfully!');
            setTitle('');
            setAmount('');
            setCategory('');
            setNote('');
            setDate('');
            setRefreshChart(prev => !prev);
        } catch (error) {
            const firstError = getFirstErrorMessage(error.response?.data)
            showAlert(false, firstError);
        }
    };

    useEffect(() => {
        dispatch(fetchExpenses())
    }, [])

    // filter handlgin--
    const handleFilter = () => {
        dispatch(fetchExpenses({
            category: fcategory,
            start_date: fstart_date,
            end_date: fend_date
        }));
    };

    return (
        <>
            <MessageAlerter
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ type: false, message: '' })}
            />
            <div className='w-full h-full hide-scrollbar overflow-auto p-5 mt-20'>
                <div className={`grid ${is_admin ? 'lg:grid-cols-1' : 'lg:grid-cols-2'}  grid-cols-1 gap-2`}>
                    {/* conditional rendering expense adding form according to the current loged in user-- */}
                    {
                        !is_admin &&
                        <div className='w-full h-fit shadow-md bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl'>
                            <h1 className='ml-3 text-2xl font-semibold mt-2 flex gap-x-2 items-center'><span><FaWallet className='size-10 text-indigo-600' /></span>Add new Expenses here</h1>
                            <form className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4  rounded-xl shadow-lg max-w-3xl mx-auto">
                                {/* Title */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="title" className="text-base font-semibold text-black">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Groceries, Coffee"
                                        className="rounded-md border border-indigo-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="amount" className="text-base font-semibold text-black">Amount (₹)</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        min={0}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="e.g., 500"
                                        className="rounded-md border border-indigo-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="category" className="text-base font-semibold text-black">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="rounded-md border border-indigo-500 px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    >
                                        <option value="" disabled>Select a category</option>
                                        <option value="FOOD">🍔 Food</option>
                                        <option value="TRAVEL">✈️ Travel</option>
                                        <option value="UTILITIES">💡 Utilities</option>
                                        <option value="MISC">📦 Miscellaneous</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="note" className="text-base font-semibold text-black">Note (optional)</label>
                                    <input
                                        type="text"
                                        id="note"
                                        name="note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add a note or description..."
                                        className="rounded-md border border-indigo-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="date" className="text-base font-semibold text-black">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="rounded-md border border-indigo-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2 flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition-all shadow-sm"
                                        onClick={e => handleSubmit(e)}
                                    >
                                        Add Expense
                                    </button>
                                </div>
                            </form>

                        </div>
                    }
                    <BarChart refreshTrigger={refreshChart}/>
                    <div>
                    </div>
                </div>
                <div className='w-full p-5 bg-gray-100 shadow-lg'>
                    <div className='flex shadow-lg py-4 px-5 justify-between bg-gradient-to-r from-indigo-400 to-purple-400 rounded-md'>
                        <h1 className='font-bold font-mono lg:text-3xl'>{is_admin ? 'Expenses' : 'Your Expenses'}</h1>
                        <h1 className='font-semibold font-mono lg:text-xl'>Total(₹):<span className='font-normal font-sans'>{totalExpense}</span></h1>
                    </div>

                    {/* filtering from start from here -- */}
                    <div className="w-full p-4 mb-4 bg-white rounded-md shadow flex flex-wrap items-end gap-4">
                        {/* Category Select */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Category</label>
                            <select className="border border-gray-300 rounded px-3 py-2 min-w-[160px]"
                                value={fcategory}
                                onChange={(e) => setFcategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="FOOD">Food</option>
                                <option value="TRAVEL">Travel</option>
                                <option value="UTILITIES">Utilities</option>
                                <option value="MISC">Miscellaneous</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Start Date</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded px-3 py-2"
                                value={fstart_date}
                                onChange={(e) => setStartdate(e.target.value)}
                                max={fend_date || undefined} // limit max start date to selected end date
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">End Date</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded px-3 py-2"
                                value={fend_date}
                                onChange={(e) => setEnddate(e.target.value)}
                                min={fstart_date || undefined} // limit min end date to selected start date
                            />
                        </div>


                        {/* Filter Button */}
                        <div className="flex items-end">
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                                onClick={handleFilter}
                            >
                                Filter
                            </button>
                        </div>
                    </div>


                    {/* expense table start here-- */}
                    <div className="mt-5 max-h-[400px] hide-scrollbar overflow-y-auto rounded-md shadow-inner">
                        <table className="min-w-full table-auto text-left border border-gray-200">
                            <thead className=" top-0 z-30 sticky  bg-indigo-500 text-white">
                                <tr>
                                    <th className="px-4 py-2 bg-indigo-500">#ID</th>
                                    <th className="px-4 py-2 bg-indigo-500">Title</th>
                                    <th className="px-4 py-2 bg-indigo-500">Category</th>
                                    <th className="px-4 py-2 bg-indigo-500">Amount (₹)</th>
                                    <th className="px-4 py-2 bg-indigo-500">Date</th>
                                    <th className="px-4 py-2 bg-indigo-500">Note</th>
                                    <th className="px-4 py-2 bg-indigo-500">Action</th>
                                    {
                                        is_admin
                                        &&
                                        <th className="px-4 py-2 bg-indigo-500">User</th>
                                    }
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isloading ? (
                                    <tr>
                                        <td colSpan={is_admin ? 7 : 6} className="text-center py-6 text-indigo-500 font-semibold">
                                            <div className="flex justify-center">
                                                <Loader />
                                            </div>
                                        </td>
                                    </tr>
                                ) : iserror ? (
                                    <tr>
                                        <td colSpan={is_admin ? 7 : 6} className="text-center py-6 text-red-500 font-semibold">
                                            {typeof iserror === 'string' ? iserror : 'Failed to load expenses.'}
                                        </td>
                                    </tr>
                                ) : expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={is_admin ? 7 : 6} className="text-center py-6 text-gray-500">
                                            No expenses to display.
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.map((exp, index) => (
                                        <tr key={exp.id} className="hover:bg-gray-50 transition duration-200">
                                            <td className="px-4 py-2">{index}</td>
                                            <td className="px-4 py-2">{exp.title}</td>
                                            <td className="px-4 py-2">{exp.category}</td>
                                            <td className="px-4 py-2">{exp.amount}</td>
                                            <td className="px-4 py-2">{exp.date}</td>
                                            <td className="px-4 py-2 truncate max-w-[200px]">{exp.notes}</td>
                                            <td className="px-4 py-2">
                                                <Link
                                                    to={`/expense/${exp.id}/`}
                                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1 rounded"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                            {is_admin && (
                                                <td className="px-4 py-2">{exp.user.username}</td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>

                </div>

            </div>
        </>
    );
}

export default UserDashboard;
