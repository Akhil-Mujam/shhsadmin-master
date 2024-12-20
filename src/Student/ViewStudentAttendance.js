import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../axios";

const ViewStudentAttendance = () => {
  const [regNo, setRegNo] = useState("");
  const [month, setMonth] = useState(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
  });
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRegNo = async () => {
    try {
      const response = await axiosInstance.get("/userauthdata/getUsername");
      setRegNo(response.data);
    } catch (error) {
      console.error("Error fetching regNo:", error);
    }
  };

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getMonthDates(month);
      const response = await axiosInstance.get(`/student/attendance/byStudent/${regNo}/from/${startDate}/to/${endDate}`);
      setAttendanceData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setLoading(false);
    }
  }, [month, regNo]); // Only re-run when regNo or month change

  useEffect(() => {
    fetchRegNo();
  }, []);

  useEffect(() => {
    if (regNo && month) {
      fetchAttendance();
    }
  }, [regNo, month, fetchAttendance]); // Dependencies are regNo, month, and fetchAttendance

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const getMonthDates = (month) => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, parseInt(month) - 1, 2);
    const endDate = new Date(year, parseInt(month), 1);
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Attendance Details</h2>
      <label className="block mb-2">Select Month:</label>
      <select
        value={month}
        onChange={handleMonthChange}
        className="mb-4 p-2 border rounded w-full"
      >
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : attendanceData ? (
        <>
          <div className="mb-4">
            <p><strong>Student Name:</strong> {attendanceData.student}</p>
            <p><strong>Class:</strong> {attendanceData.className}</p>
            <p><strong>Section:</strong> {attendanceData.classSection}</p>
          </div>

          {attendanceData.attendanceDetails.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 shadow-lg">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.attendanceDetails.map((record, index) => (
                    <tr key={index} className="border-b hover:bg-blue-50">
                      <td className="px-4 py-2 text-center">{record.attendanceDate}</td>
                      <td className="px-4 py-2 text-center">
                        {record.status ? "Present" : "Absent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No attendance data available for the selected month.
            </p>
          )}
        </>
      ) : (
        <p className="text-center text-red-500">Error fetching data.</p>
      )}
    </div>
  );
};

export default ViewStudentAttendance;
