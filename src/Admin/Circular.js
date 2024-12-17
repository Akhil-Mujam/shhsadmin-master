import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Circular = () => {
  const [circulars, setCirculars] = useState([]); // Array to hold circulars
  const [showModal, setShowModal] = useState(false); // Show/hide modal
  const [title, setTitle] = useState(''); // New circular title
  const [driveLink, setDriveLink] = useState(''); // New circular drive link
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch all circulars when the component mounts
  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/circular');
      console.log("Fetched circulars:", response.data); // Debugging
      setCirculars(response.data);
    } catch (error) {
      console.error('Error fetching circulars:', error);
      toast.error('Error fetching circulars!');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete circular
  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/circular/${id}`);
      console.log('Circular deleted:', response.data);
      toast.success('Circular deleted successfully!');
      // Remove the deleted circular from the state
      setCirculars((prevCirculars) => prevCirculars.filter((circular) => circular.id !== id));
    } catch (error) {
      console.error('Error deleting circular:', error);
      toast.error('Error deleting circular!');
    }
  };

  // Handle add circular
  const handleAdd = async () => {
    if (!title || !driveLink) {
      toast.warning('Please fill in all fields!');
      return;
    }

    const newCircular = { title, driveLink };

    try {
      const response = await axiosInstance.post('/circular/', { withCredentials: true }, newCircular);
      console.log('Circular added:', response.data);
      toast.success('Circular added successfully!');
      // Add the new circular to the state
      setCirculars((prevCirculars) => [...prevCirculars, response.data]);
      setShowModal(false); // Close the modal
      setTitle(''); // Reset fields
      setDriveLink('');
    } catch (error) {
      console.error('Error adding circular:', error);
      toast.error('Error adding circular!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <ToastContainer autoClose={3000} /> {/* Toast notifications */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Circulars</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Add Circular
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading circulars...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left font-bold text-gray-800">Title</th>
              <th className="py-2 px-4 text-left font-bold text-gray-800">Drive Link</th>
              <th className="py-2 px-4 text-center font-bold text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {circulars.length > 0 ? (
              circulars.map((circular) => (
                <tr key={circular.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-800">{circular.title}</td>
                  <td className="py-2 px-4 text-blue-500 underline">
                    <a href={circular.driveLink} target="_blank" rel="noopener noreferrer">
                      {circular.driveLink}
                    </a>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleDelete(circular.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-600">
                  No circulars available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Add Circular Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Circular</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Drive Link</label>
                <input
                  type="text"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Circular;
