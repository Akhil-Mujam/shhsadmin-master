import React, { useState } from 'react';
import axiosInstance from '../axios';
import MarksTable from '../Student/MarksTable';

const ViewMarks = () => {
  const [regNo, setRegNo] = useState('');
  const [error, setError] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false); // Initialize as false to avoid showing the loader initially.

  const fetchMarks = async () => {
    // Validate input
    if (!regNo.trim()) {
      setError("Registration number cannot be empty.");
      return;
    }

    setLoading(true); // Show loader
    setError(null); // Clear previous errors
    setMarksData([]); // Clear previous results

    try {
      const response = await axiosInstance.get(`/examresult/stundentscore/${regNo}`);
      
      if (response.data && response.data.length > 0) {
        setMarksData(response.data);
      } else {
        setError("No marks data found for this student.");
      }
    } catch (err) {
      console.error("Error fetching student scores:", err);
      setError("Unable to fetch marks data. Please try again.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Search Student Marks</h2>

      {/* Input Field */}
      <div className="flex flex-col md:flex-row items-center mb-4">
        <input
          type="text"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          placeholder="Enter Student Reg No"
          className="p-2 border rounded mb-4 md:mb-0 md:mr-2 w-full"
        />
        <button 
          onClick={fetchMarks}
          className="p-2 bg-blue-500 text-white rounded w-full md:w-auto"
        >
          Search
        </button>
      </div>

      {/* Feedback Section */}
      {loading ? (
        <p className="text-center text-gray-600">Loading marks...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : marksData.length > 0 ? (
        <MarksTable marksData={marksData} />
      ) : null} {/* Do not render anything if there’s no error or marksData */}
    </div>
  );
};

export default ViewMarks;
