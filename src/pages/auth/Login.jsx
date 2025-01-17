import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validation Schema with Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const initialValues = {
    username: "",
    email: "",
    password: "",
  };
const navigate=useNavigate()
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", values);

      if (response.data.success) {
        // Store tokens in cookies
        Cookies.set("accessToken", response.data.accessToken, { expires: 7 }); // Token expires in 7 days
        Cookies.set("refreshToken", response.data.refreshToken, { expires: 7 });
      navigate("/candidates")
        // Show success notification
        toast.success("Login successful!");
        console.log("Login successful!");
        // Redirect or perform further actions after login success
      } else {
        // Show failure notification
        toast.error("Login failed: " + response.data.message);
        console.log("Login failed:", response.data.message);
      }
    } catch (error) {
      // Show error notification
      toast.error("Error during login: " + error.message);
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-[90%] max-w-[400px]">
        <h1 className="text-2xl font-bold mb-2">Welcome to RMS!</h1>
        <p className="text-gray-500 mb-6">Keep your data safe</p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Username Input */}
              <div className="relative mb-6">
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full py-3 px-4 pl-6 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-[#8765fc] focus:outline-none text-gray-700"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-sm text-red-500 text-left mt-1"
                />
              </div>

              {/* Email Input */}
              <div className="relative mb-6">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full py-3 px-4 pl-6 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-[#8765fc] focus:outline-none text-gray-700"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 text-left mt-1"
                />
              </div>

              {/* Password Input */}
              <div className="relative mb-6">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full py-3 px-4 pl-6 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-[#8765fc] focus:outline-none text-gray-700"
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 text-left mt-1"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-full bg-[#7953ff] text-white font-bold hover:bg-[#8765fc] transition duration-200 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Logging in..." : "LOGIN"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Forgot Password */}
        <p className="mt-4 text-sm text-[#8765fc] cursor-pointer hover:underline" onClick={()=>navigate("/forgotPassword")}>
          Forgot password?
        </p>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Login;
