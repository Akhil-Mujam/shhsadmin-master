import React, { useMemo, useState ,useCallback } from 'react';


import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonModal from './CommonModal';
import axiosInstance from '../axios';

const TeacherTable = ({ data, fields, onMakeClassTeacher, onRemoveClassTeacher }) => {
  const [filterInput, setFilterInput] = useState('');
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClassTeacherModalVisible, setIsClassTeacherModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState(null);
  const [classTeacherDetails, setClassTeacherDetails] = useState({ className: '', classSection: '' });

 

  const getClassSections = (className) => {
    if (className === 'Nursery' || className === 'LKG' || className === 'UKG') {
      return ['A'];
    } else if (parseInt(className) >= 1 && parseInt(className) <= 5) {
      return ['A', 'B', 'C'];
    } else if (parseInt(className) >= 6 && parseInt(className) <= 10) {
      return ['A', 'B'];
    }
    return [];
  };

  const handleClassTeacher = useCallback((teacher) => {
    if (teacher.role === 'Class Teacher') {
      // Remove class teacher role
      onRemoveClassTeacher(teacher.id); // API call to remove
      toast.success('Removed as Class Teacher!');
    } else {
      setModalData(teacher); // Set data for modal
      setClassTeacherDetails({ className: '', classSection: '' });
      setIsClassTeacherModalVisible(true);
    }
  }, [onRemoveClassTeacher]);

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper();
    const baseColumns = fields.map((field) =>
      columnHelper.accessor(field.key, { header: field.label })
    );

    baseColumns.push(
      columnHelper.display({
        id: 'classTeacher',
        header: 'Class Teacher',
        cell: ({ row }) => {
          const isClassTeacher = row.original.role === 'Class Teacher';
          return (
            <button
              onClick={() => handleClassTeacher(row.original)}
              className={`px-4 py-2 rounded-lg ${
                isClassTeacher
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isClassTeacher ? 'Remove as Class Teacher' : 'Make as Class Teacher'}
            </button>
          );
        },
      })
    );

    baseColumns.push(
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ),
      })
    );

    return baseColumns;
  }, [fields,handleClassTeacher]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleFilterChange = (e) => {
    setGlobalFilter(e.target.value);
    setFilterInput(e.target.value);
  };

  const handleEdit = (row) => {
    setModalData(row); // Pre-fill data for editing
    setModalTitle('Edit Teacher');
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setModalData(null); // No initial data for adding
    setModalTitle('Add Teacher');
    setIsModalVisible(true);
  };

  

  const handleClassTeacherSubmit = async () => {
    if (!classTeacherDetails.className || !classTeacherDetails.classSection) {
      toast.error("Please select a class and section.");
      return;
    }
  
    const regNo = modalData.regNo; // Get the teacher's registration number from modalData
    try {
      // Make a POST request to the backend API to assign the class teacher
      const response = await axiosInstance.post('/teacher/assign', null, {
        params: {
          regNo: regNo,
          classEntity: classTeacherDetails.className,
          classSection: classTeacherDetails.classSection,
        },
      });
      console.log(response.data)
      toast.success(response.data); // Display success message from the backend
      setIsClassTeacherModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error assigning class teacher:", error);
      toast.error(error.response.data);
    }
  };
  

  const handleModalSubmit = async(formData) => {
    if (modalData) {
        const teacherId = modalData.teacherId; // Get teacherId from the modalData
        try{
            const response =  await axiosInstance.put(`/teacher/update/${teacherId}`,formData)
            console.log(response.data)
            toast.success(response.data);
          }
          catch(error){
            console.error("Error in adding teacher:", error);
            toast.error(error.response.data);
          }
      
      // Call API to update teacher
    } else {
      try{
        const response =  await axiosInstance.post('/teacher/add',formData)
        console.log(response.data)
        toast.success(response.data);
      }
      catch(error){
        console.error("Error in adding teacher:", error);
        toast.error("Failed to add teacher.");
      }
      // Call API to add teacher
      
    }
    setIsModalVisible(false);
  };

  const handleClassNameChange = (className) => {
    setClassTeacherDetails({
      className,
      classSection: getClassSections(className)[0], // Default to the first section
    });
  };

  const handleClassSectionChange = (classSection) => {
    setClassTeacherDetails((prev) => ({ ...prev, classSection }));
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <input
          value={filterInput}
          onChange={handleFilterChange}
          placeholder={`Search by ${fields[0].label}`}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Add Teacher
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-blue-500 text-white">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-blue-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
        >
          Previous
        </button>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      <CommonModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleModalSubmit}
        fields={fields}
        title={modalTitle}
        initialData={modalData}
        defaultRole="Teacher"
        />


      {/* Class Teacher Modal */}
      {isClassTeacherModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Assign as Class Teacher</h2>
            <select
              value={classTeacherDetails.className}
              onChange={(e) => handleClassNameChange(e.target.value)}
              required
              className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
            >
              <option value="">Select Class</option>
              {['Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => (i + 1).toString())].map(
                (classOption) => (
                  <option key={classOption} value={classOption}>
                    {classOption}
                  </option>
                )
              )}
            </select>
            <select
              value={classTeacherDetails.classSection}
              onChange={(e) => handleClassSectionChange(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-lg w-full"
            >
              <option value="">Select Section</option>
              {getClassSections(classTeacherDetails.className).map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClassTeacherSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Assign
              </button>
              <button
                onClick={() => setIsClassTeacherModalVisible(false)}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTable;
