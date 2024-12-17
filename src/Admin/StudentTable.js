import React, { useMemo, useState, useEffect } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import CommonModal from './CommonModal';
import axiosInstance from '../axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentTable = ({ data, fields }) => {
  const [filterInput, setFilterInput] = useState('');
  const [classNameFilter, setClassNameFilter] = useState('');
  const [classSectionFilter, setClassSectionFilter] = useState('');
  const [students, setStudents] = useState(data);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableSections, setAvailableSections] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState(null);

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

  const columnHelper = createColumnHelper();
  const columns = useMemo(() => {
    const baseColumns = fields.map((field) =>
      columnHelper.accessor(field.key, { header: field.label })
    );

    // Add an "Actions" column for edit functionality
    baseColumns.push(
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => handleEdit(row.original)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Edit
          </button>
        ),
      })
    );

    return baseColumns;
  }, [fields]);

  const table = useReactTable({
    data: students,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const fetchFilteredStudents = async () => {
      try {
        const response = await axiosInstance.get('/students', {
          params: {
            className: classNameFilter || undefined,
            classSection: classSectionFilter || undefined,
          },
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to fetch student data.');
      }
    };

    if (classNameFilter || classSectionFilter) {
      fetchFilteredStudents();
    } else {
      setStudents(data); // Reset to initial data if no filters are applied
    }
  }, [classNameFilter, classSectionFilter, data]);

  const handleFilterChange = (e) => {
    setGlobalFilter(e.target.value);
    setFilterInput(e.target.value);
  };

  const handleClassNameChange = (e) => {
    const selectedClassName = e.target.value;
    setClassNameFilter(selectedClassName);

    const sections = getClassSections(selectedClassName);
    setAvailableSections(sections);

    if (!sections.includes(classSectionFilter)) {
      setClassSectionFilter('');
    }
  };

  const handleClassSectionChange = (e) => {
    setClassSectionFilter(e.target.value);
  };

  const handleEdit = (row) => {
    setModalData(row);
    setModalTitle('Edit Student');
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setModalData(null);
    setModalTitle('Add Student');
    setIsModalVisible(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalData) {
        // Update existing student
        const response = await axiosInstance.put(`/students/update/${modalData.studentId}`, formData);
        toast.success(response.data.message || 'Student updated successfully.');
      } else {
        // Add a new student
        const response = await axiosInstance.post('/students/add', formData);
        toast.success(response.data.message || 'Student added successfully.');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form.');
    }
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <input
          value={filterInput}
          onChange={handleFilterChange}
          placeholder={`Search by ${fields[0].label}`}
          className="p-2 border border-gray-300 rounded-lg w-1/4"
        />
        <select
          value={classNameFilter}
          onChange={handleClassNameChange}
          className="p-2 border border-gray-300 rounded-lg w-1/4"
        >
          <option value="">Select Class</option>
          {['Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => i + 1)].map(
            (classOption) => (
              <option key={classOption} value={classOption}>
                {classOption}
              </option>
            )
          )}
        </select>
        <select
          value={classSectionFilter}
          onChange={handleClassSectionChange}
          className="p-2 border border-gray-300 rounded-lg w-1/4"
        >
          <option value="">Select Section</option>
          {availableSections.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Add Student
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

      <CommonModal
  isVisible={isModalVisible}
  onClose={() => setIsModalVisible(false)}
  onSubmit={handleModalSubmit}
  fields={fields}
  title={modalTitle}
  initialData={modalData}
  defaultRole="Student"
/>

    </div>
  );
};

export default StudentTable;
