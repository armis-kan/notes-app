import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EditNoteModal = ({ note, onClose, onSave }) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [backgroundColor, setBackgroundColor] = useState(note.background_color || '#FFFFFF');
    const [textColor, setTextColor] = useState(note.text_color || '#000000');

    const handleSave = (event) => {
        event.preventDefault();
        onSave({ ...note, title, content, background_color: backgroundColor, text_color: textColor });
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50"
        >
            <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 flex items-center justify-center z-50">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Edit Note
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={onClose}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form className="p-4 md:p-5" onSubmit={handleSave}>
                            <div className="grid gap-4 mb-4 grid-cols-1">
                                <div>
                                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Note title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                                    <textarea
                                        id="content"
                                        rows="4"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Write note content here"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label htmlFor="background_color" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Background Color</label>
                                        <input
                                            type="color"
                                            id="background_color"
                                            className="rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 p-2.5 w-full"
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                        />
                                        <div
                                            className="w-full h-8 mt-2 rounded-lg"
                                            style={{ backgroundColor: backgroundColor }}
                                        ></div>
                                    </div>
                                    <div>
                                        <label htmlFor="text_color" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Text Color</label>
                                        <input
                                            type="color"
                                            id="text_color"
                                            className="rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 p-2.5 w-full"
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                        />
                                        <div
                                            className="w-full h-8 mt-2 rounded-lg"
                                            style={{ backgroundColor: textColor }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex justify-center items-center mt-10'>
                                <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EditNoteModal;
