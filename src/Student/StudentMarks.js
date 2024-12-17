import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import MarksTable from './MarksTable';

const StudentMarks = () => {
  const [marksData, setMarksData] = useState([]);
  const [regNo, setRegNo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Registration Number
  useEffect(() => {
    const fetchRegNo = async () => {
      try {
        const response = await axiosInstance.get("/userauthdata/getUsername");
        setRegNo(response.data); // Assuming response.data contains the regNo
      } catch (err) {
        console.error("Error fetching regNo:", err);
        setError("Unable to fetch registration number.");
      }
    };

    fetchRegNo();
  }, []);

  // Fetch Marks Data
  useEffect(() => {
    if (!regNo) return; // Only fetch marks when regNo is available

    const fetchMarks = async () => {
      try {
        const response = await axiosInstance.get(`/examresult/stundentscore/${regNo}`);
        setMarksData(response.data);
      } catch (err) {
        console.error("Error fetching student scores:", err);
        setError("Unable to fetch marks data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [regNo]); // Trigger when regNo is updated

  return (
    <div className="mt-6 max-w-full p-4">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Marks for Reg No: {regNo || "Loading..."}
      </h2>

      {loading ? (
        <p>Loading marks...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : marksData && marksData.length > 0 ? (
        <MarksTable marksData={marksData} />
      ) : (
        <p className="text-center text-gray-500">No marks data found.</p>
      )}
    </div>
  );
};

export default StudentMarks;
