import React, { useMemo, useState } from 'react';
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
import 'react-toastify/dist/ReactToastify.css'; // Styles for toast notifications

const DataTable = ({ data, fields, title, isStudent }) => {
  const [filterInput, setFilterInput] = useState('');
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showClassTeacherModal, setShowClassTeacherModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
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

  const columnHelper = createColumnHelper();
  const columns = useMemo(() => {
    const baseColumns = fields.map((field) =>
      columnHelper.accessor(field.key, { header: field.label })
    );

    if (!isStudent) {
      baseColumns.push(
        columnHelper.display({
          id: 'classTeacher',
          header: 'Class Teacher',
          cell: ({ row }) => {
            const isClassTeacher = !!row.original.isClassTeacher;
            return (
              <button
                onClick={() => handleClassTeacher(row.original)}
                className={`px-4 py-2 rounded-lg ${
                  isClassTeacher
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isClassTeacher ? 'Remove as Class Teacher' : 'Make Class Teacher'}
              </button>
            );
          },
        })
      );
    }

    baseColumns.push(
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => handleEditItem(row.original)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-600"
          >
            Edit
          </button>
        ),
      })
    );

    return baseColumns;
  }, [fields, isStudent]);

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

  // Handle the modal to add a new item
  const handleAddItem = () => {
    setCurrentItem({ role: isStudent ? 'Student' : 'Teacher' });
    setIsEditing(false); // Reset to "Add" mode
    setShowModal(true);
  };

  // Handle the modal to edit an existing item
  const handleEditItem = (item) => {
    setCurrentItem({ ...item, role: isStudent ? 'Student' : 'Teacher' });
    setIsEditing(true); // Set to "Edit" mode
    setShowModal(true);
  };

  const handleClassTeacher = (item) => {
    setCurrentItem(item);
    setClassTeacherDetails({ className: '', classSection: '' });
    setShowClassTeacherModal(true);
  };

  const handleClassTeacherSubmit = () => {
    // API Call to Assign Class Teacher
    console.log('Assign Class Teacher', classTeacherDetails);
    toast.success('Class Teacher Assigned Successfully!');
    setShowClassTeacherModal(false);
  };

  // Handle adding or updating an item
  const handleAddOrUpdateItem = () => {
    if (isEditing) {
      toast.success(`${title} successfully updated!`);
    } else {
      toast.success(`${title} successfully added!`);
    }
    setShowModal(false);
    setCurrentItem({}); // Reset the current item
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer />
      <button
        onClick={handleAddItem} // Use handleAddItem for adding
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg transition duration-300 hover:bg-green-600"
      >
        Add {title}
      </button>

      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder={`Search by ${fields[0].label}`}
        className="mb-4 p-2 border border-gray-300 rounded-lg w-full"
      />

      <table className="min-w-full bg-white border border-gray-300 shadow-lg">
        {/* Table Header */}
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
        {/* Table Body */}
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

      {/* Pagination */}
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
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {isEditing ? `Edit ${title}` : `Add New ${title}`}
            </h2>
            {fields.map((field) => (
              <input
                key={field.key}
                type="text"
                name={field.key}
                placeholder={field.label}
                value={currentItem[field.key] || ''}
                onChange={(e) =>
                  setCurrentItem((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                }
                required
                className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
              />
            ))}
            {/* Default Role (Disabled Input) */}
            <input
              type="text"
              value={isStudent ? 'Student' : 'Teacher'}
              disabled
              className="mb-2 p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddOrUpdateItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class Teacher Modal */}
      {showClassTeacherModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Assign Class Teacher</h2>
            <select
              value={classTeacherDetails.className}
              onChange={(e) =>
                setClassTeacherDetails((prev) => ({ ...prev, className: e.target.value }))
              }
              required
              className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
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
              value={classTeacherDetails.classSection}
              onChange={(e) =>
                setClassTeacherDetails((prev) => ({ ...prev, classSection: e.target.value }))
              }
              required
              className="mb-2 p-2 border border-gray-300 rounded-lg w-full"
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
                onClick={() => setShowClassTeacherModal(false)}
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

export default DataTable;
