import React from 'react';

const MarksTable = ({ marksData }) => {
  return (
    <div className="overflow-x-auto sm:overflow-x-visible p-4">
      <table className="w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs sm:text-sm md:text-base lg:text-lg">
            <th className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3">Exam Name</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3">Total</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3">Subject</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3">Marks</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3">Grade</th>
          </tr>
        </thead>
        <tbody>
          {marksData.map((exam, examIndex) => (
            exam.subjectMarksList.map((subject, subIndex) => (
              <tr
                key={`${examIndex}-${subIndex}`}
                className="border-b last:border-b-0 hover:bg-blue-50 transition-colors text-xs sm:text-sm md:text-base lg:text-lg"
              >
                {subIndex === 0 && (
                  <>
                    <td
                      rowSpan={exam.subjectMarksList.length}
                      className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 font-semibold text-center bg-blue-100 text-blue-900 border-r"
                    >
                      {exam.examName}
                    </td>
                    <td
                      rowSpan={exam.subjectMarksList.length}
                      className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 text-center font-semibold bg-blue-100 text-blue-900 border-r"
                    >
                      {exam.total}
                    </td>
                  </>
                )}
                <td className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 text-center text-gray-700">
                  {subject.subjectName}
                </td>
                <td className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 text-center font-medium text-gray-900">
                  {subject.marks}
                </td>
                <td className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 text-center font-medium text-gray-900">
                  {subject.grade}
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarksTable;
