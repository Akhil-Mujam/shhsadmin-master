import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const [message, setMessage] = useState('');
  const maxLength = 250;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter a notification message.');
      return;
    }

    try {
      const response = await axios.post('/api/send-notification', { message });

      if (response.status === 200) {
        toast.success('Notification sent successfully!');
        setMessage('');
      } else {
        toast.error('Failed to send notification.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Error sending notification.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-r from-blue-100 to-blue-200 shadow-xl rounded-lg border border-blue-300">
      <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">
        Send Notification to All Students
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows="5"
            maxLength={maxLength}
            className="w-full p-4 border border-blue-300 rounded-lg resize-none text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            style={{
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-light.png")',
            }}
          />
          <span
            className={`absolute bottom-3 right-3 text-xs ${message.length === maxLength ? 'text-red-500' : 'text-gray-500'}`}
          >
            {message.length}/{maxLength}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-dark-purple hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send Notification
        </button>
      </form>
      <ToastContainer
       
        autoClose={2000}
       
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default Notifications;
