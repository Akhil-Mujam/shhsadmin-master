import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate()

  const goback = () => navigate(-1);

 

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Unauthorized Access</h1>
      <p className="mt-4 text-lg">You do not have permission to view this page.</p>
      <Link to="/login" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">
        Go Back to Login
      </Link>
      <button onClick={goback}>Go Back</button>
    </div>
  );
};

export default Unauthorized;
