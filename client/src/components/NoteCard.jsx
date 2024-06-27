import React, { useState, useEffect } from 'react';
import formatTimestamp from '../utils/formatTimestamp';
import EditModal from './EditNoteModal';
import DeleteModal from './DeleteNoteModal';
import axios from '../axiosConfig';

const NoteCard = ({ note, onDeleteNote, onUpdateNote }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [backgroundStyle, setBackgroundStyle] = useState({});
    const [textStyle, setTextStyle] = useState({});

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editModalData, setEditModalData] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (note.created_at) {
            const formattedCreatedAt = formatTimestamp(note.created_at);
            setCreatedAt(`${formattedCreatedAt.date} ${formattedCreatedAt.time}`);
        }
        if (note.updated_at) {
            const formattedUpdatedAt = formatTimestamp(note.updated_at);
            setUpdatedAt(`${formattedUpdatedAt.date} ${formattedUpdatedAt.time}`);
        }

        setBackgroundStyle({
            backgroundColor: note.background_color,
        });
        setTextStyle({
            color: note.text_color,
        });
    }, [note]);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleEditNote = () => {
        setEditModalData(note);
        setIsEditModalOpen(true);
    };

    const handleDeleteNote = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditModalData(null);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleUpdateNote = async (updatedNote) => {
        try {
            const response = await axios.put(`notes/${updatedNote.id}`, updatedNote);
            onUpdateNote(response.data);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleDeletingNote = async () => {
        try {
            await axios.delete(`notes/${note.id}`);
            onDeleteNote(note.id);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative block max-w-md md:max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-all ease-in-out"
            style={backgroundStyle}
        >
            <div className="relative overflow-auto h-[300px]">
                <h5 className="mb-2 text-2xl font-bold tracking-tight" style={textStyle}>{note.title}</h5>
                <div className="max-h-[200px] overflow-auto">
                    <p className="font-normal whitespace-normal break-words" style={textStyle}>
                        {note.content}
                    </p>
                </div>
                <div className="flex justify-between mt-4 absolute bottom-0 left-0 right-0">
                    <div className="flex justify-center items-center gap-2">
                        <button
                            title="Edit this note"
                            onClick={handleEditNote}
                            className={`hover:bg-green-500 bg-gray-800 p-2 rounded-full hover:p-2 hover:rounded-full transition-all duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img src="./images/edit.svg" alt="Edit note" className="w-6 h-6" />
                        </button>
                        <button
                            title="Delete this note"
                            onClick={handleDeleteNote}
                            className={`hover:bg-red-500 bg-gray-800 p-2 rounded-full hover:p-2 hover:rounded-full transition-all duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img src="./images/delete.svg" alt="Delete note" className="w-6 h-6" />
                        </button>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm" style={{ color: `${textStyle.color}90` }}>Created on: {createdAt}</p>
                        <p className="text-gray-400 text-sm" style={{ color: `${textStyle.color}90` }}>Updated on:{updatedAt}</p>
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <EditModal
                        note={editModalData}
                        onClose={handleCloseEditModal}
                        onSave={handleUpdateNote}
                    />
                )}

                {/* Delete Modal */}
                {isDeleteModalOpen && (
                    <DeleteModal
                        note={note}
                        onClose={handleCloseDeleteModal}
                        onDelete={handleDeletingNote}
                    />
                )}
            </div>
        </div>
    );
};

export default NoteCard;