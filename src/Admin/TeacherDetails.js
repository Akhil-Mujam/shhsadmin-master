import React, { useEffect, useState } from 'react';
import axiosInstance from '../axios'; // Assuming axiosInstance is configured
import DataTable from './DataTable';
import TeacherTable from './TeacherTable';

const sampleTeachers = [
  {
    empId: "T001",
    firstName: "John",
    lastName: "Doe",
    subject: "Mathematics",
    email: "john.doe@example.com",
    phone: "1234567890",
  },
  {
    empId: "T002",
    firstName: "Jane",
    lastName: "Smith",
    subject: "Science",
    email: "jane.smith@example.com",
    phone: "0987654321",
  },
  {
    empId: "T003",
    firstName: "Alice",
    lastName: "Johnson",
    subject: "English",
    email: "alice.johnson@example.com",
    phone: "1122334455",
  },
];

const fields = [
  { key: 'regNo', label: 'Employee ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'password', label: 'Password' },
  { key: 'address', label: 'Address' },
  { key: 'phno', label: 'Phone' },
];

const TeacherDetails = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Pagination: current page index (starts at 0)
  const [totalPages, setTotalPages] = useState(0); // Total pages available
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageSize] = useState(10); // Number of teachers per page

  const fetchTeachers = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/teacher/all', {
        params: { page, size: pageSize },
      });
      const { content, totalPages } = response.data; // Assuming backend response structure
      setTeachers(content);
      console.log(teachers)
      setTotalPages(totalPages);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teacher data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(currentPage);
    console.log(teachers)
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teacher Details</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <TeacherTable
            data={teachers.length > 0 ? teachers : sampleTeachers}
            fields={fields}
            title="Teacher"
            isStudent={false}
          />

          {/* Pagination Controls */}
          {/* <div className="flex justify-center items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 === totalPages}
            >
              Next
            </button>
          </div> */}
        </>
      )}
    </div>
  );
};

export default TeacherDetails;
