import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./UserContext";
import LoginPage from "./LoginPage";
import MarksUpload from "./Teacher/MarksUpload";
import ViewMarks from "./Teacher/ViewMarks";
import ViewAttendance from "./Teacher/ViewAttendance";
import Notifications from "./Admin/Notifications";
import StudentDetails from "./Admin/StudentDetails";
import TeacherDetails from "./Admin/TeacherDetails";
import ViewStudentAttendance from "./Student/ViewStudentAttendance";
import AttendanceUpload from "./Teacher/AttendanceUpload";
import DashboardLayout from "./DashboardLayout";
import Unauthorized from "./Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "./Logout";
import StudentMarks from "./Student/StudentMarks";
import ViewStudentAttedanceByCTeacher from "./Teacher/ViewStudentAttedanceByCTeacher";
import Circular from "./Admin/Circular";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/logout" element={<Logout />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Admin Routes */}
              <Route
                path="notifications"
                element={
                  <ProtectedRoute requiredRole={["Admin"]}>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="student-details"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <StudentDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="teacher-details"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <TeacherDetails />
                  </ProtectedRoute>
                }
              />
             <Route
              path="circular"
              element={
                <ProtectedRoute requiredRole={["Admin", "ClassTeacher"]}>
                  <Circular />
                </ProtectedRoute>
              }
            />

              {/* Teacher Routes */}
              <Route
                path="attendance-upload"
                element={
                  <ProtectedRoute requiredRole="ClassTeacher">
                    <AttendanceUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="marks-upload"
                element={
                  <ProtectedRoute requiredRole="ClassTeacher">
                    <MarksUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="view-marks"
                element={
                  <ProtectedRoute requiredRole="ClassTeacher">
                    <ViewMarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="view-attendance"
                element={
                  <ProtectedRoute requiredRole="ClassTeacher">
                    <ViewAttendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="view-CT-attendance"
                element={
                  <ProtectedRoute requiredRole="ClassTeacher">
                    <ViewStudentAttedanceByCTeacher />
                  </ProtectedRoute>
                }
              />

              {/* <Route
                path="*"
                element={
                  <ProtectedRoute requiredRole="ClassTeacher">
                    <Routes>
                      <Route path="attendance-upload" element={<AttendanceUpload />} />
                      <Route path="marks-upload" element={<MarksUpload />} />
                      <Route path="view-marks" element={<ViewMarks />} />
                      <Route path="view-attendance" element={<ViewAttendance />} />
                      <Route path="view-CT-attendance" element={<ViewStudentAttedanceByCTeacher />} />
                    </Routes>
                  </ProtectedRoute>
                }
              /> */}

              {/* Student Routes */}
              <Route
                path="view-student-attendance"
                element={
                  <ProtectedRoute requiredRole="Student">
                    <ViewStudentAttendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="Student-Marks"
                element={
                  <ProtectedRoute requiredRole="Student">
                    <StudentMarks />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Unauthorized />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
