import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utility: Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ViewStudentAttendanceByTeacher = () => {
  const [classDetails, setClassDetails] = useState({ classId: null, classSection: null });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [date, setDate] = useState(getTodayDate); // Initialize with today's date
  const [loading, setLoading] = useState(false);

  // Fetch class and section details on mount
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const { data: username } = await axiosInstance.get("/userauthdata/getUsername");
        console.log("Username:", username);

        const { data, status } = await axiosInstance.get(`/teacher/class-details/${username}`);
        if (status === 200) {
          console.log("Class Details:", data);
          setClassDetails({ classId: data.classEntity, classSection: data.classSection });
        } else {
          console.warn("Unexpected response:", status);
        }
      } catch (error) {
        console.error("Error fetching class details:", error);
        toast.error("Error fetching class details. Please try again.");
      }
    };

    fetchClassDetails();
  }, []);

 

  // Fetch attendance records (memoized for better performance)
  const fetchAttendance = useCallback(
    async (selectedDate) => {
      const { classId, classSection } = classDetails;
      if (!classId || !classSection) {
        toast.warning("Class and section details are not available.");
        return;
      }
      setLoading(true);
      try {
        const { data, status } = await axiosInstance.get(
          `/student/attendance/byClass/${classId}/${classSection}/date/${selectedDate}`
        );
        if (status === 200) {
          console.log("Attendance Records:", data);
          setAttendanceRecords(data);
        } else {
          console.warn("Unexpected response:", status);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast.error("Error fetching attendance. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [classDetails]
  );

   // Fetch attendance records whenever classDetails or date changes
   useEffect(() => {
    if (classDetails.classId && classDetails.classSection) {
      fetchAttendance(date);
    }
  }, [classDetails, date,fetchAttendance]);

  // Handle date change
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <ToastContainer autoClose={3000} />

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Student Attendance</h1>

      {/* Class and Section Details */}
      <div className="mb-6">
        <p className="text-lg text-gray-600">
          <strong>Class:</strong> {classDetails.classId || "Loading..."}{" "}
          <strong>Section:</strong> {classDetails.classSection || "Loading..."}
        </p>
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
          Select Date:
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Attendance Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading attendance records...</p>
      ) : attendanceRecords.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left font-bold text-gray-800">Student Info</th>
              <th className="py-2 px-4 text-center font-bold text-gray-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-gray-800">
                  {record.regNo} - {record.firstName} {record.lastName}
                </td>
                <td className="py-2 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      record.status ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {record.status ? "Present" : "Absent"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No attendance records found for the selected date.</p>
      )}
    </div>
  );
};

export default ViewStudentAttendanceByTeacher;
