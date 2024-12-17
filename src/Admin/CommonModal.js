import React, { useState, useEffect } from 'react';

const CommonModal = ({ isVisible, onClose, onSubmit, fields, title, initialData, defaultRole }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Populate form data if editing
    if (initialData) {
      setFormData({ ...initialData, role: initialData.role || defaultRole }); // Ensure role is set
    } else {
      setFormData({ role: defaultRole }); // Default to provided role
    }
  }, [initialData, defaultRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData); // Pass form data to parent component
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
        {fields.map((field) => (
          <div key={field.key} className="mb-2">
            <input
              type="text"
              name={field.key}
              value={formData[field.key] || ''}
              onChange={handleChange}
              placeholder={field.label}
              className="p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
        ))}
        {/* Role Field (Non-editable) */}
        <div className="mb-2">
          <label className="block text-sm font-semibold mb-1">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role || defaultRole}
            disabled
            className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            {title.includes('Edit') ? 'Update' : 'Add'}
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
