import React from 'react';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';

const HomePage = () => {
  const dummyNotes = [
    { id: 1257275, title: 'Note 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', created_at: '2021-09-01T12:00:00Z', updated_at: '2021-09-01T12:00:00Z'},
    { id: 2257257, title: 'Note 2', content: 'Pellentesque euismod magna vel luctus condimentum.', created_at: '2021-09-01T12:00:00Z', updated_at: '2021-09-01T12:00:00Z'},
    { id: 3241, title: 'Note 3', content: 'Nullam vitae dui at nisi dignissim tempus.', created_at: '2021-09-01T12:00:00Z', updated_at: '2021-09-01T12:00:00Z'},
    { id: 47357, title: 'Note 4', content: 'Fusce vel arcu in elit dignissim vulputate sed nec odio.', created_at: '2021-09-01T12:00:00Z', updated_at: '2021-09-01T12:00:00Z'},
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-rose-100 to-green-100">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="flex flex-col p-10">
            <h2 className="text-5xl font-bold text-center md:text-left">Welcome to your perfect note-taking app</h2>
            <p className="mt-4 text-lg text-gray-700 text-center md:text-left">
              Manage your notes with ease and never lose track of your ideas again.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 mb-5">
          <h2 className="text-3xl font-bold mb-4 pl-10">Your Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 px-10">
            {dummyNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
