import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "./axios";
import { UserContext } from "./UserContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setRole } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to saved route or default route after login
  const from = location.state?.from?.pathname || "/";

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axiosInstance.put("/userauthdata/version/authenticate", {
  //       username,
  //       password,
  //     });

  //     if (response.status === 200) {
  //       const roles = response.data; // Assuming roles is an array from the API response
  //       console.log("Roles received from API:", roles);

  //       // Define role priority for determining which role to use
  //       const rolePriority = ["Admin", "ClassTeacher", "Teacher", "Student"];
  //       const role = roles.find((r) => rolePriority.includes(r));

  //       if (role) {
  //         setRole(role); // Set the role in context
  //         console.log("Determined Role:", role);

  //         // Define default paths for each role
  //         const roleRedirects = {
  //           Admin: "/student-details",
  //           ClassTeacher: "/view-attendance",
  //           Teacher: "/view-attendance",
  //           Student: "/view-attendance",
  //         };

  //         // Redirect based on saved path (`from`) or role-specific default
  //         navigate(from === "/" ? roleRedirects[role] : from, { replace: true });
  //       } else {
  //         console.error("No valid role found in API response.");
  //         alert("Login failed. No valid role assigned to your account.");
  //       }
  //     } else {
  //       console.error("Unexpected API response status:", response.status);
  //       alert("Login failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     alert("Login failed. Please check your username and password.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axiosInstance.put("/userauthdata/version/authenticate", {
        username,
        password,
      });
  
      if (response.status === 200) {
        const roles = response.data; // Assuming roles is an array
        const rolePriority = ["Admin", "ClassTeacher", "Teacher", "Student"];
        const role = roles.find((r) => rolePriority.includes(r));
  
        if (role) {
          setRole(role); // Update role in UserContext
          console.log("Role set:", role);
  
          // Define default redirections for roles
          const roleRedirects = {
            Admin: "/student-details",
            ClassTeacher: "/view-attendance",
            Teacher: "/view-attendance",
            Student: "/Student-Marks",
          };
  
          // Redirect to `state.from` or role's default route
          navigate(location.state?.from?.pathname || roleRedirects[role], { replace: true });
        } else {
          alert("No valid role assigned.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };
  
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side - Image Section */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-100">
        <img
          src="https://via.placeholder.com/800x600" // Replace with actual image URL
          alt="Login Illustration"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Side - Form Section */}
      <div className="flex flex-col justify-center items-center lg:w-1/2 w-full bg-gray-50 px-8 py-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Welcome Back!</h2>
        <p className="text-gray-500 mb-6">Login to your account.</p>

        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
