import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MdEditDocument, MdEdit, MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux'
import api from '../axiosconfig'
import { useParams } from 'react-router-dom'
import Loader from '../Components/Loader'
import { useNavigate, useLocation } from 'react-router'
import { getFirstErrorMessage } from '../utils/ErrorExtractor'
import MessageAlerter from './MessageAlerter';
import { fetchExpenses } from '../Redux/expensesSlice'

const ExpenseDetails = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // for notifications--
    const [alert, setAlert] = useState({ type: false, message: '' });
    const showAlert = (type, message) => {
        setAlert({ type, message });
    };

    const is_admin = useSelector(state => state.user.is_admin)
    // Initial expense

    const [expense, setExpense] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedExpense, setEditedExpense] = useState(null); //state used for editing data, so that the detailes won't get affected


    const [loading, toggleLoading] = useState(true)
    const [fetchfailed, toggleFetchFailed] = useState({ status: false, msg: '' })
    const { id } = useParams();

    // fetching expenses ---
    const fetchexpense = async () => {
        try {
            const response = await api.get(`expenses/${id}`)
            setExpense(response.data)
            toggleLoading(false)
        } catch (error) {
            if (error.response?.status === 404) {
                toggleFetchFailed({ status: true, msg: 'Expense not Found.' })
            }
        } finally {
            toggleLoading(false)
        }
    }

    // useeffect for fetching expenses --
    useEffect(() => {
        fetchexpense()
    }, [])




    // updating expenses in clone object--
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'amount') {
            
            if (!/^\d*\.?\d*$/.test(value)) return;
        }
        setEditedExpense((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // saving edited expense--
    const handleSave = async (e) => {
        e.preventDefault();
        const { id, user, ...updatedData } = editedExpense;
        try {
            const response = await api.put(`/expenses/${editedExpense.id}/`, updatedData);
            showAlert(true, 'Expense updated successfully');
            setIsEditing(false);
            dispatch(fetchExpenses());
            fetchexpense()
            console.log(response.data)
        } catch (error) {
            showAlert('error', 'Failed to update expense');
            console.error(error.response?.data || error.message);
        }
    };

    // delete expense--
    const handleDelete = async () => {
        try {
            await api.delete(`/expenses/${id}/`);
            navigate('/dashboard/', { replace: true, state: { message: 'Expense deleted successfully' } });
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    const toggleEdit = () => {
        setIsEditing(true);
        setEditedExpense({ ...expense }); //cloning current expense for editing
    };

    // for framar motion--
    const variants = {
        initial: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            position: 'absolute',
        }),
        animate: {
            x: 0,
            opacity: 1,
            position: 'relative',
            transition: { duration: 0.4 },
        },
        exit: (direction) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            position: 'absolute',
            transition: { duration: 0.4 },
        }),
    };

    return (
        <>
            <MessageAlerter
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ type: false, message: '' })}
            />
            <div className="p-6 max-w-3xl mx-auto mt-20 bg-white shadow-md rounded-lg space-y-6">

                <h2 className="text-2xl font-bold text-indigo-700">Expense Details</h2>
                {loading ?
                    <div className='w-full flex justify-center mt-5'>
                        <Loader />
                    </div>
                    : fetchfailed && fetchfailed.msg ?
                        <>
                            <div className='h-fit rounded-md w-fit flex bg-red-600 px-6 text-white'>{fetchfailed.msg}</div>

                        </>
                        :
                        <AnimatePresence custom={isEditing ? -1 : 1} mode="wait">
                            {isEditing ? (
                                <motion.div
                                    key="view1"
                                    variants={variants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    custom={1}
                                    className="p-5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl  shadow"
                                >
                                    <div className='flex items-center gap-5 py-3'>
                                        <MdEditDocument className='size-9' />
                                        <h1 className='text-xl font-semibold'>Edit your Expense here</h1>
                                    </div>
                                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4  ">
                                        {/* Title */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-base font-semibold">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={editedExpense.title}
                                                onChange={handleChange}
                                                className="border border-indigo-500 rounded-lg px-3 py-2"
                                                required
                                            />
                                        </div>

                                        {/* Amount */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-base font-semibold">Amount (₹)</label>
                                            <input
                                                type="text"
                                                inputMode="decimal" // allows numeric keyboard on mobile
                                                name="amount"
                                                value={editedExpense.amount}
                                                onChange={handleChange}
                                                className="border border-indigo-500 rounded-lg px-3 py-2"
                                                pattern="^\d*\.?\d*$" // optional: prevents invalid characters
                                            />

                                        </div>

                                        {/* Category */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-base font-semibold">Category</label>
                                            <select
                                                name="category"
                                                value={editedExpense.category}
                                                onChange={handleChange}
                                                className="border border-indigo-500 rounded-lg px-3 py-2"
                                                required
                                            >
                                                <option value="" disabled>Select a category</option>
                                                <option value="FOOD">🍔 Food</option>
                                                <option value="TRAVEL">✈️ Travel</option>
                                                <option value="UTILITIES">💡 Utilities</option>
                                                <option value="MISC">📦 Miscellaneous</option>
                                            </select>
                                        </div>

                                        {/* Notes */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-base font-semibold">Note</label>
                                            <input
                                                type="text"
                                                name="notes"
                                                value={editedExpense.notes}
                                                onChange={handleChange}
                                                className="border border-indigo-500 rounded-lg px-3 py-2"
                                            />
                                        </div>

                                        {/* Date */}
                                        <div className="flex flex-col gap-1">
                                            <label className="text-base font-semibold">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={editedExpense.date}
                                                onChange={handleChange}
                                                className="border border-indigo-500 rounded-lg px-3 py-2"
                                                required
                                            />
                                        </div>

                                        {/* Buttons */}
                                        <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="view2"
                                    variants={variants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    custom={-1}
                                    className="p-5 bg-white rounded shadow"
                                >
                                    <div className="space-y-4 text-gray-900 w-full md:max-w-xl bg-gradient-to-r from-indigo-400 to-purple-400 p-6 rounded-2xl shadow-lg">
                                        <h2 className="text-2xl font-bold text-white">💰 Expense Summary</h2>

                                        <div className="bg-white rounded-xl p-5 space-y-3 shadow-sm">
                                            <p className='text-base md:text-lg font-semibold'>
                                                <span className="text-indigo-600">📝 Title:</span> {expense.title}
                                            </p>
                                            <p className='text-base md:text-lg font-semibold'>
                                                <span className="text-indigo-600">💸 Amount:</span> ₹{expense.amount}
                                            </p>
                                            <p className='text-base md:text-lg font-semibold'>
                                                <span className="text-indigo-600">📂 Category:</span> {expense.category}
                                            </p>
                                            <p className='text-base md:text-lg font-semibold'>
                                                <span className="text-indigo-600">📅 Date:</span> {new Date(expense.date).toLocaleDateString()}
                                            </p>
                                            <p className='text-base md:text-lg font-semibold'>
                                                <span className="text-indigo-600">🗒️ Note:</span> {expense.notes || "—"}
                                            </p>
                                            <p className='text-base md:text-lg font-semibold'>
                                                <span className="text-indigo-600">👤 Created by:</span> {expense.user?.username}
                                            </p>
                                        </div>

                                        {/* Friendly Summary */}
                                        <div className="bg-indigo-100 border-l-4 border-indigo-500 p-4 text-indigo-800 rounded-md shadow-sm">
                                            <p>
                                                🎉 Hey! You spent <strong>₹{expense.amount}</strong> on <strong>{expense.category.toLowerCase()}</strong> – keep tracking to stay within budget!
                                            </p>
                                        </div>

                                        {/* Actions */}

                                        <div className="flex gap-4 pt-2">
                                            {is_admin &&
                                                <button
                                                    onClick={handleDelete}
                                                    className="bg-red-600 flex items-center text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                                >
                                                    <span><MdDelete className='text-black' /></span> Delete
                                                </button>
                                            }
                                            <button
                                                onClick={toggleEdit}
                                                className="bg-white border flex items-center gap-x-2  border-indigo-600 text-indigo-700 font-semibold px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                                            >
                                                <span><MdEdit className='text-green-600' /></span>Edit
                                            </button>
                                        </div>

                                    </div>
                                </motion.div>

                            )}
                        </AnimatePresence>
                }
            </div>
        </>
    );
};

export default ExpenseDetails;
