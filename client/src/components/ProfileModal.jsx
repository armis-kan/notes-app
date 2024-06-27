import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../axiosConfig';
import { toast } from 'react-hot-toast';

const ProfileModal = ({ onClose }) => {
    const [, setLoading] = useState(true);

    const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);

    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const [tempUsername, setTempUsername] = useState(username);
    const [tempBio, setTempBio] = useState(bio);

    const fetchUser = async () => {
        try {
            const response = await axios.get('users/');

            setUsername(response.data.username);
            setBio(response.data.bio);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSaveUsername = async () => {
        setUsername(tempUsername);
        setIsEditingUsername(false);

        try {
            await axios.put('users/update-username', { changedUsername: tempUsername });
            toast.success('Username updated successfully');
        } catch (error) {
            toast.error('An error occurred while updating username');
            console.error('Error updating username:', error);
        } finally {
            fetchUser();
        }
    };

    const handleCancelUsernameEdit = () => {
        setTempUsername(username);
        setIsEditingUsername(false);
    };

    const handleSaveBio = async () => {
        setBio(tempBio);
        setIsEditingBio(false);

        try {
            await axios.put('users/update-bio', { bio: tempBio });
            toast.success('Bio updated successfully');
        } catch (error) {
            toast.error('An error occurred while updating bio');
            console.error('Error updating bio:', error);
        } finally {
            fetchUser();
        }
    };

    const handleCancelBioEdit = () => {
        setTempBio(bio);
        setIsEditingBio(false);
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const response = await axios.post('users/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Profile picture updated successfully');
            setProfilePicture(response.data.profile_picture);
            setIsEditingProfilePicture(false);
        } catch (error) {
            toast.error('An error occurred while updating profile picture');
            console.error('Error updating profile picture:', error);
        } finally {
            fetchUser();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50"
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            My Profile
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

                    <div className="p-4 md:p-5 text-center flex flex-col items-center mb-4">
                        <img
                            src={`${profilePicture}` || "https://placehold.co/600x400.png"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mx-auto object-cover"
                        />
                        <div className="flex items-center justify-center">
                            {isEditingProfilePicture ? (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="block w-fit text-center mt-2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                    />
                                    <button onClick={() => setIsEditingProfilePicture(false)} className="ml-2 mt-2 text-red-500 hover:text-red-700">
                                        <img src="./images/close.svg" alt="Cancel" className="w-6 h-6 hover:p-1 hover:rounded-full transition-all ease-in-out" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditingProfilePicture(true)} className="ml-2 mt-2 text-blue-500 hover:text-blue-700">
                                        <img src="./images/edit.svg" alt="Edit" className="w-5 h-5 opacity-50 hover:bg-black hover:opacity-100 hover:p-1 hover:rounded-full transition-all ease-in-out" />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center justify-center mt-5">
                            {isEditingUsername ? (
                                <>
                                    <input
                                        type="text"
                                        value={tempUsername}
                                        onChange={(e) => setTempUsername(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1 text-center"
                                    />
                                    <button onClick={handleSaveUsername} className="ml-2 text-blue-500 hover:text-blue-700">
                                        <img src="./images/save.svg" alt="Save" className="w-6 h-6 hover:p-1 hover:rounded-full transition-all ease-in-out" />
                                    </button>
                                    <button onClick={handleCancelUsernameEdit} className="ml-2 text-red-500 hover:text-red-700">
                                        <img src="./images/close.svg" alt="Cancel" className="w-6 h-6 hover:p-1 hover:rounded-full transition-all ease-in-out" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{username}</h4>
                                    <button onClick={() => setIsEditingUsername(true)} className="ml-2 text-blue-500 hover:text-blue-700">
                                        <img src="./images/edit.svg" alt="Edit" className="w-5 h-5 opacity-50 hover:bg-black hover:opacity-100 hover:p-1 hover:rounded-full transition-all ease-in-out" />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center justify-center mt-4">
                            {isEditingBio ? (
                                <>
                                    <textarea
                                        value={tempBio}
                                        onChange={(e) => setTempBio(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1 text-center"
                                    />
                                    <button onClick={handleSaveBio} className="ml-2 text-blue-500 hover:text-blue-700">
                                        <img src="./images/save.svg" alt="Save" className="w-6 h-6 hover:p-1 hover:rounded-full transition-all ease-in-out" />
                                    </button>
                                    <button onClick={handleCancelBioEdit} className="ml-2 text-red-500 hover:text-red-700">
                                        <img src="./images/close.svg" alt="Cancel" className="w-6 h-6 hover:p-1 hover:rounded-full transition-all ease-in-out" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{bio}</p>
                                    <button onClick={() => setIsEditingBio(true)} className="ml-2 text-blue-500 hover:text-blue-700">
                                        <img src="./images/edit.svg" alt="Edit" className="w-5 h-5 opacity-50 hover:bg-black hover:opacity-100 hover:p-1 hover:rounded-full transition-all ease-in-out" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileModal;
