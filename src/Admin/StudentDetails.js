import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from './DataTable';
import axiosInstance from '../axios'; // axiosInstance with interceptors and base URL
import StudentTable from './StudentTable';

const sampleStudents = [
  {
    regNo: "2024001",
    firstName: "John",
    lastName: "Doe",
    fatherName: "Richard Doe",
    motherName: "Emily Doe",
    address: "123 Main St",
    className: "10",
    classSection: "A",
  },
  {
    regNo: "2024002",
    firstName: "Jane",
    lastName: "Smith",
    fatherName: "James Smith",
    motherName: "Mary Smith",
    address: "456 Elm St",
    className: "9",
    classSection: "B",
  },
  {
    regNo: "2024003",
    firstName: "Alice",
    lastName: "Johnson",
    fatherName: "Michael Johnson",
    motherName: "Sophia Johnson",
    address: "789 Oak St",
    className: "8",
    classSection: "C",
  },
];

const fields = [
  { key: 'regNo', label: 'Reg No' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'fatherName', label: 'Father Name' },
  { key: 'motherName', label: 'Mother Name' },
  { key: 'phNo', label: 'Phone No' },
  { key: 'address', label: 'Address' },
  { key: 'className', label: 'Class' },
  { key: 'classSection', label: 'Section' },
];

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0); // Current page
  const [size, setSize] = useState(30); // Page size
  const [totalPages, setTotalPages] = useState(0); // Total pages for pagination

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const classId = "X";
        const classSection = "A";
        const url = `student/getClassStudents/${classId}/${classSection}`;
        
        const response = await axios.get(url, {
          params: { page, size },
        });
        console.log(response.data)
        //setStudents(response.data); // Assuming response structure has `students`
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Details</h2>

      <StudentTable
        data={students.length > 0 ? students : sampleStudents}
        fields={fields}
        title="Student"
        isStudent={true}
      />
    </div>
  );
};

export default StudentDetails;
