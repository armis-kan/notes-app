import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import ProfileModal from '../components/ProfileModal';
import axios from '../axiosConfig';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('asc');
  const [columns, setColumns] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const response = await axios.get('notes/mynotes');
      setNotes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('You are not authorized to view notes');
      navigate('/auth');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveNote = async (note) => {
    try {
      const response = await axios.post('notes/create', note);
      setNotes([...notes, response.data]);
      setIsModalOpen(false);
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('An error occurred while adding note');
    } finally {
      fetchNotes();
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`notes/${noteId}`);
      setNotes(notes.filter(note => note.id !== noteId));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('An error occurred while deleting note');
    } finally {
      fetchNotes();
    }
  };

  const handleUpdateNote = async (updatedNote) => {
    try {
      const response = await axios.put(`notes/${updatedNote.id}`, updatedNote);
      setNotes(notes.map(note => (note.id === updatedNote.id ? response.data : note)));
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('An error occurred while updating note');
    } finally {
      fetchNotes();
    }
  };

  const sortNotes = (sortBy, order) => {
    const sortedNotes = [...notes].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'created_at') {
        comparison = new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === 'updated_at') {
        comparison = new Date(a.updated_at) - new Date(b.updated_at);
      }
      return order === 'asc' ? comparison : -comparison;
    });
    setNotes(sortedNotes);
  };

  const handleSortChange = (event) => {
    const { value } = event.target;
    setSortBy(value);
    sortNotes(value, sortOrder);
  };

  const handleOrderChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortNotes(sortBy, newOrder);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileIconClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onAddNote={handleAddNote} onProfileIconClick={handleProfileIconClick} />

      <div className={`flex-1 bg-white p-4 ${columns === 3 ? 'ml-20' : ''}`}> {/* Conditional apply ml-20 for larger screens */}
        <h1 className='text-3xl bg-gray-100 p-2 rounded-lg w-fit mt-20 ml-10'>My notes</h1>

        <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between mt-6 mb-4">
          {/* Left section: Sorting options */}
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="text-lg font-semibold ml-10 mr-2">Sort by:</span>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded mr-4 focus:outline-none"
            >
              <option value="created_at">Created</option>
              <option value="updated_at">Updated</option>
            </select>
            <button
              onClick={handleOrderChange}
              className="flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
            >
              {sortOrder === 'asc' ? (
                <img src="./images/upsort.svg" alt="Sort Ascending" className="w-6 h-6" />
              ) : (
                <img src="./images/downsort.svg" alt="Sort Descending" className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Center section: Search bar */}
          <div className="flex items-center justify-center sm:justify-start w-3/4 ml-10 sm:w-auto mt-4 mb-4 sm:ml-10">
            <div className="relative flex items-center w-full max-w-md">
              <input
                type="text"
                placeholder="Search notes"
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none w-full"
              />
              <button className="absolute right-0 p-2 flex items-center bg-gray-200 hover:bg-gray-300 focus:outline-none transition-all ease-in-out h-full">
                <img src="./images/search.svg" alt="Search icon" className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Right section: Column buttons (hidden on small screens) */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => setColumns(3)}
              className={`ml-4 px-3 py-1 rounded focus:outline-none ${columns === 3 ? 'bg-gray-300' : 'bg-gray-200'}`}
            >
              <img src="./images/grid1.svg" alt="Three Columns" className="w-6 h-6" />
            </button>
            <button
              onClick={() => setColumns(4)}
              className={`ml-4 px-3 py-1 rounded focus:outline-none ${columns === 4 ? 'bg-gray-300' : 'bg-gray-200'}`}
            >
              <img src="./images/grid2.svg" alt="Four Columns" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Conditional rendering based on loading state or empty notes */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 max-w-6xl w-full">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col gap-5 items-center justify-center mt-10">
            <p className="text-lg text-gray-700">No notes found...</p>
          </div>
        ) : (
          <div className='flex flex-col mt-10'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-${columns} gap-2 w-full p-8`}
            >
              {filteredNotes.map(note => (
                <NoteCard key={note.id} note={note} onDeleteNote={handleDeleteNote} onUpdateNote={handleUpdateNote} />
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {isModalOpen && <Modal onCloseModal={handleCloseModal} onSaveNote={handleSaveNote} />}
      {isProfileModalOpen && <ProfileModal onCloseProfileModal={handleCloseProfileModal} />}
    </div>
  );
};

export default DashboardPage;
