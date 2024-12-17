import React, { useState } from 'react';
import axiosInstance from '../axios'; // axiosInstance with interceptors and base URL
import axios from 'axios';

const ViewAttendance = () => {
  const [regNo, setRegNo] = useState(''); // Registration number input
  const [date, setDate] = useState(''); // Date input
  const [attendanceData, setAttendanceData] = useState(null); // Holds attendance data of the searched student
  const [error, setError] = useState(''); // Error message if fetching fails

  axios.defaults.withCredentials = true;

  const handleSearch = async () => {
    if (!regNo || !date) {
      setError("Please enter both registration number and date.");
      return;
    }

    try {
      // Construct the endpoint URL using regNo and date
      const url = `/student/attendance/byStudent/${regNo}/date/${date}`;

      // Make the GET request using axiosInstance
      const response = await axiosInstance.get(url);
       console.log(response.data)
      if (response.data.length > 0) {
        setError('')
        const attendanceRecord = response.data[0]; // Get the first attendance record
        setAttendanceData(attendanceRecord); // Store the full attendance record if needed
      } else {
        setError("No attendance record found for the given date and registration number.");
        setAttendanceData(null)
        
      }

     
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Failed to fetch attendance. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-lg font-bold mb-4">View Attendance</h2>

      <input
        type="text"
        placeholder="Enter Registration Number"
        value={regNo}
        onChange={(e) => setRegNo(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-3"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-3"
      />

      <button
        onClick={handleSearch}
        className="w-full mt-3 bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {attendanceData && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="font-semibold">Attendance Details:</h3>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Status:</strong> {attendanceData.status ? 'Present' : "Absent"}</p>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
