import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "../../../api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Validation Schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        `${url}/auth/forgot-password`,
        { email: values.email }
      );

      if (response.data.success) {
        // Show success notification
        toast.success("OTP sent! Please check your email.");

        // Navigate to the ChangePassword page after success
        navigate("/ChangePassword");
      } else {
        // Show error notification
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      // Handle errors and show error notification
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false); // Reset the submit button state
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-[90%] max-w-[400px]">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-gray-500 mb-6">
          Enter your email to reset your password
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-full bg-[#7953ff] text-white font-bold hover:bg-[#8765fc] transition duration-200 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Reset Password"}
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

export default ForgotPassword;
