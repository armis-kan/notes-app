import React from 'react';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';

const HomePage = () => {
  const dummyNotes = [
    { id: 1257275, title: 'Note 1', content: 'Creating notes never has never been more fun', created_at: '2021-09-01T12:00:00Z', updated_at: '2021-09-01T12:00:00Z', background_color: '#FFFFFF', text_color: '#000000'},
    { id: 2257257, title: 'Note 2', content: 'I can even use AI to generate my note', created_at: '2021-09-01T12:00:00Z', updated_at: '2021-09-01T12:00:00Z', background_color: '#37E019', text_color: '#000000'},
    { id: 3241, title: 'Note 3', content: 'Organizing notes by color has never been easier', created_at: '2021-09-01T12:00:00Z', updated_at: '2021-09-01T12:00:00Z', background_color: '#8E40F2', text_color: '#000000'},
  ];

  return (
    <div className="flex flex-col absolute inset-0 min-h-screen w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] overflow-x-hidden mb-10">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center mb-20">
        <div className="w-full flex justify-center">
          <div className="flex flex-col p-10">
            <h2 className="text-5xl font-bold text-center">Welcome to your perfect note-taking app</h2>
            <p className="mt-4 text-lg text-gray-700 text-center">
              Manage your notes with ease and never lose track of your ideas again.
            </p>
            <p className="mt-4 text-lg text-gray-700 text-center">
              Now inspired by <b>AI.</b>
            </p>
          </div>
        </div>

        <div className="relative w-full h-fit flex justify-center mt-10 mb-10">
          <div className="relative lg:w-[350px] lg:h-64 w-[300px] h-48 sm:w-full sm:flex sm:flex-col sm:items-center">
            {dummyNotes.map((note, index) => (
              <div
                key={note.id}
                className={`absolute w-full max-w-full transform ${index === 0 ? 'z-20' : 'z-10'} sm:relative sm:mt-4 lg:absolute`}
                style={{
                  top: index === 0 ? '0%' : '20%',
                  left: index === 0 ? '0%' : `${index === 1 ? '-70%' : '70%'}`,
                }}
              >
                <NoteCard note={note} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
