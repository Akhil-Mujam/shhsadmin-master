import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceUpload = () => {
  const [students, setStudents] = useState([]); // Array to hold student objects
  const [attendance, setAttendance] = useState({}); // Object to track attendance
  const [loading, setLoading] = useState(false); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [studentsPerPage] = useState(10); // Number of students to display per page
  const [attendanceStatus, setAttendanceStatus] = useState(false); // Track the status of today's attendance
  const [classId, setClassId] = useState(null);
  const [classSection, setClassSection] = useState(null);
  const currentDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  // Fetch the class and section when the component mounts
  useEffect(() => {
    const getSectionandClass = async () => {
      try {
        const usernameresponse = await axiosInstance.get('/userauthdata/getUsername');
        const username = usernameresponse.data;
        console.log("getSection username = " + username);

        const response = await axiosInstance.get(`/teacher/class-details/${username}`);
        if (response.status === 200) {
          console.log("classes: " + JSON.stringify(response.data));
          setClassId(response.data.classEntity);
          setClassSection(response.data.classSection);
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching class and section:", error);
        toast.error("Error fetching class and section details. Please check your connection and try again.");
      }
    };

    getSectionandClass();
  }, []);

  // Fetch students when classId and classSection are set
  useEffect(() => {
    if (!classId || !classSection) return; // Ensure classId and classSection are available

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/student/getClassStudents/${classId}/${classSection}`);
        console.log("Fetched students:", response.data); // Debugging
        setStudents(response.data);

        const initialAttendance = {};
        response.data.forEach((student) => {
          initialAttendance[student.regNo] = true;
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Error fetching student data!');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId, classSection]); // Runs only when classId and classSection are set

  // Check if today's attendance has already been submitted
  useEffect(() => {
    if (!classId || !classSection) return; // Ensure classId and classSection are available

    const checkAttendanceStatus = async () => {
      try {
        const response = await axiosInstance.get(`/student/attendance/checkToday/${classId}/${classSection}`);
        setAttendanceStatus(response.data); // 'submitted' or 'not submitted'
        console.log("Attendance status:", response.data);
      } catch (error) {
        console.error('Error checking attendance status:', error);
      }
    };

    checkAttendanceStatus();
  }, [classId, classSection]); // Runs only when classId and classSection are set

  // Handle checkbox change
  const handleCheckboxChange = (regNo) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [regNo]: !prevAttendance[regNo], // Toggle present/absent state
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const studentAttendances = students.map((student) => ({
      regNo: student.regNo,
      status: attendance[student.regNo], // Attendance status based on checkbox
    }));

    const attendanceData = {
      attendanceDate: currentDate, // Today's date
      className: classId, // Class ID
      classSection: classSection, // Class Section
      studentAttendances, // Array of student attendance data
    };

    try {
      if (attendanceStatus) {
        toast.warning('Attendance for today has already been submitted. You can update it.');
      } else {
        const response = await axiosInstance.post('/student/attendance/markBatch', attendanceData);
        console.log('Attendance uploaded:', response.data);
        setAttendanceStatus('submitted'); // Mark as submitted after successful upload
        toast.success('Attendance submitted successfully!');
      }
    } catch (error) {
      console.error('Error uploading attendance:', error);
      toast.error('Error submitting attendance!', { autoClose: 1500 });
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const studentAttendances = students.map((student) => ({
      regNo: student.regNo,
      status: attendance[student.regNo], // Attendance status based on checkbox
    }));

    const attendanceData = {
      attendanceDate: currentDate,
      className: classId,
      classSection: classSection,
      studentAttendances,
    };

    try {
      const response = await axiosInstance.put('/student/attendance/updateBatch', attendanceData);
      console.log('Attendance updated:', response.data);
      toast.success('Attendance updated successfully!');
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Error updating attendance!', { autoClose: 1500 });
    }
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = Array.isArray(students) ? students.slice(indexOfFirstStudent, indexOfLastStudent) : [];

  const totalPages = Math.ceil(students.length / studentsPerPage);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6  rounded-xl shadow-xl">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={attendanceStatus ? handleUpdate : handleSubmit} className="space-y-6">
          <ToastContainer autoClose={3000} /> {/* Toast container for notifications */}

          {loading ? (
            <p className="text-center text-gray-600">Loading students...</p>
          ) : (
            <>
              <table className="min-w-full bg-white table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left font-bold text-gray-800">Registration Number</th>
                    <th className="py-2 px-4 text-left font-bold text-gray-800">Name</th>
                    <th className="py-2 px-4 text-left font-bold text-gray-800">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                {currentStudents.length > 0 ? (
                    currentStudents.map(student => (
                      <tr key={student.regNo} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-semibold text-gray-800">{student.regNo}</td>
                        <td className="py-2 px-4 font-semibold text-gray-800">{`${student.firstName} ${student.lastName}`}</td>
                        <td className="py-2 px-4">
                          <input
                            type="checkbox"
                            checked={attendance[student.regNo]}
                            onChange={() => handleCheckboxChange(student.regNo)}
                            className="w-6 h-6 text-blue-600 border-gray-300 rounded-full transition-transform transform duration-200 ease-in-out hover:scale-110"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-600">
                        No students available.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition duration-200"
                >
                  Previous
                </button>
                <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Submit/Update Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              attendanceStatus 
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } transition duration-300`}
          >
            {attendanceStatus  ? 'Update Attendance' : 'Submit Attendance'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AttendanceUpload;
