import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { url } from "../../../api";

const ChangePassword = () => {
  // Validation Schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    otp: Yup.string()
      .length(6, "OTP must be exactly 6 digits")
      .required("OTP is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        `${url}/auth/reset-password`,
        {
          email: values.email,
          otp: values.otp,
          newPassword: values.newPassword,
        }
      );

      if (response.data.success) {
        // Show success notification
        toast.success("Password changed successfully! Log in with your new credentials.");

        // Navigate to the login page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 3000); // 3 seconds delay to allow the user to see the notification
      } else {
        toast.error(response.data.message || "Failed to reset password!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false); // Reset the submit button state
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-[90%] max-w-[400px]">
        <h1 className="text-2xl font-bold mb-2">Change Password</h1>
        <p className="text-gray-500 mb-6">
          Enter the email, OTP sent to your email, and set your new password
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
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

              {/* OTP Input */}
              <div className="relative mb-6">
                <Field
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  className="w-full py-3 px-4 pl-6 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-[#8765fc] focus:outline-none text-gray-700"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-sm text-red-500 text-left mt-1"
                />
              </div>

              {/* New Password Input */}
              <div className="relative mb-6">
                <Field
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="w-full py-3 px-4 pl-6 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-[#8765fc] focus:outline-none text-gray-700"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-sm text-red-500 text-left mt-1"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="relative mb-6">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full py-3 px-4 pl-6 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-[#8765fc] focus:outline-none text-gray-700"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-sm text-red-500 text-left mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-full bg-[#7953ff] text-white font-bold hover:bg-[#8765fc]  transition duration-200 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Change Password"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ChangePassword;
