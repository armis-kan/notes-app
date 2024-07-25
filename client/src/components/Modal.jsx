import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getToken } from '../services/tokenService';
import { toast } from 'react-hot-toast';

const Modal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalBackgroundColor, setModalBackgroundColor] = useState('#FFFFFF');
  const [modalTextColor, setModalTextColor] = useState('#000000');
  const [loading, setLoading] = useState(false);
  const [AIWindowVisible, setAIWindowVisible] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAILoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [transcribing, setTranscribing] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onSave({ title, content, background_color: modalBackgroundColor, text_color: modalTextColor });
      setTitle('');
      setContent('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleAIQuestionSubmit = async (event) => {
    event.preventDefault();
    setAILoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/ai/generate-text`,
        { prompt: aiQuestion },
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
        }
      );
      setAILoading(false);
      setContent(content + response.data.generatedText.choices[0].message.content);
      setAiQuestion('');
      setAIWindowVisible(false);
    } catch (error) {
      toast.error('Something went wrong ' + error);
      setAILoading(false);
    }
  };

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      toast.success('Recording started');
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            const formData = new FormData();
            formData.append('audio', event.data, 'audio.webm');
            setTranscribing(true);
            try {
              const response = await axios.post(`${process.env.REACT_APP_API_URL}/ai/speech-to-text`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${getToken()}`,
                },
              });
              setContent(content + ' ' + response.data.transcript);
              setIsSpeaking(false);
              setRecording(false);
            } catch (error) {
              toast.error('Error processing audio');
            } finally {
              setTranscribing(false);
              setIsSpeaking(false);
              setRecording(false);
            }
          }
        };
        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
        setIsSpeaking(true);
      }).catch(error => {
        toast.error('Error accessing microphone');
      });
    }
  };


  const stopRecording = () => {
    if (mediaRecorder) {
      toast.success('Recording stopped');
      mediaRecorder.stop();
      setMediaRecorder(null);
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
      <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 flex items-center justify-center z-50">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Note
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
                  <div className='flex flex-row gap-2 items-center mb-2'>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-900 dark:text-white">Content</label>
                    <button
                      className='w-6 h-6 rounded-full'
                      title='Ask AI to generate text'
                      onClick={(e) => { e.preventDefault(); setAIWindowVisible(!AIWindowVisible); }}
                    >
                      <img src='../images/ai.svg' className='w-6 h-6' alt='AI' />
                    </button>
                    <button
                      className={`flex justify-center items-center gap-3 w-6 h-6 rounded-full border-2 ${isSpeaking ? 'border-red-500 animate-pulse' : 'border-gray-300'}`}
                      title='Use Speech Input'
                      onClick={(e) => { e.preventDefault(); isSpeaking ? stopRecording() : startRecording(); }}
                    >
                      <img src='../images/voice.svg' className='w-4 h-4' alt='Speech' />
                    </button>
                    {transcribing && <div className='text-xs p-1 bg-red-600 rounded-lg text-white animate-pulse'>Generating...</div>}
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal_background_color" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Background Color</label>
                    <input
                      type="color"
                      id="modal_background_color"
                      className="rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 p-2.5 w-full"
                      value={modalBackgroundColor}
                      onChange={(e) => setModalBackgroundColor(e.target.value)}
                    />
                    <div
                      className="w-full h-8 mt-2 rounded-lg"
                      style={{ backgroundColor: modalBackgroundColor }}
                    ></div>
                  </div>
                  <div>
                    <label htmlFor="modal_text_color" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Text Color</label>
                    <input
                      type="color"
                      id="modal_text_color"
                      className="rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 p-2.5 w-full"
                      value={modalTextColor}
                      onChange={(e) => setModalTextColor(e.target.value)}
                    />
                    <div
                      className="w-full h-8 mt-2 rounded-lg"
                      style={{ backgroundColor: modalTextColor }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className='w-full flex items-center justify-center mt-10'>
                <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={loading}>
                  {loading ? (
                    <svg
                      className="w-5 h-5 mx-auto text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                      </svg>
                      Add new note
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* AI Input Window */}
      {AIWindowVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-4 md:p-5 w-[400px]">
            <h3 className="text-lg font-semibold text-gray-900">Ask AI to write content</h3>
            <form className="mt-3" onSubmit={handleAIQuestionSubmit}>
              <textarea
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Example: Write a short story about a robot and a human"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-center items-center mt-3 gap-6">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setAIWindowVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-all ease-in-out"
                >
                  {aiLoading ? (
                    <svg
                      className="w-5 h-5 ms-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      Ask AI <img src="../images/ai.svg" className="w-5 h-5 ms-1" alt="AI" />
                    </>
                  )}

                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Modal;