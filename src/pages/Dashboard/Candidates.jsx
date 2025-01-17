import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  fetchCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} from "../../Redux/candidates/candidateSlice";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";

const Candidates = () => {
  const dispatch = useDispatch();
  const { candidates, isLoading } = useSelector((state) => state.candidates);

  // States for filters, sorting, and search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);
  function logout() {
    Cookies.remove("accessToken");
    localStorage.removeItem("accessToken");

    // Redirect to login page
    window.location.href = "/"; // Using window.location for simplicity
  }
  // Compute stats
  const totalCandidates = candidates.length;
  const pendingCandidates = candidates.filter(
    (candidate) => candidate.state === "pending"
  ).length;
  const reviewedCandidates = candidates.filter(
    (candidate) => candidate.state === "reviewed"
  ).length;
  const hiredCandidates = candidates.filter(
    (candidate) => candidate.state === "hired"
  ).length;

  const handleCreateOrUpdate = (candidateData) => {
    if (currentCandidate) {
      dispatch(updateCandidate({ id: currentCandidate._id, candidateData }));
    } else {
      dispatch(createCandidate(candidateData));
    }
    setModalIsOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteCandidate(id));
    toast.success("Candidate deleted successfully!");
  };

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter((candidate) => {
      // Filter by job title
      if (
        selectedJobTitle !== "all" &&
        candidate.jobTitle !== selectedJobTitle
      ) {
        return false;
      }
      // Filter by status
      if (selectedStatus !== "all" && candidate.state !== selectedStatus) {
        return false;
      }
      // Search by name
      if (
        searchTerm &&
        !candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name); // Sort by name ascending
      } else {
        return b.name.localeCompare(a.name); // Sort by name descending
      }
    });

  return (
    <div className="p-8">
      <ToastContainer />

      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Referral Management System
        </h1>
        <div className="flex gap-4">
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-center">
            <h2 className="text-xl font-bold">{totalCandidates}</h2>
            <p className="text-sm">Total Candidates</p>
          </div>
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md text-center">
            <h2 className="text-xl font-bold">{pendingCandidates}</h2>
            <p className="text-sm">Pending</p>
          </div>
          <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-center">
            <h2 className="text-xl font-bold">{reviewedCandidates}</h2>
            <p className="text-sm">Reviewed</p>
          </div>
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-center">
            <h2 className="text-xl font-bold">{hiredCandidates}</h2>
            <p className="text-sm">Hired</p>
          </div>
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-500 rounded-md text-center" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Filters, Sorting, and Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center mt-6 gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Name"
          className="w-full lg:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Job Title Filter */}
        <select
          className="w-full lg:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={selectedJobTitle}
          onChange={(e) => setSelectedJobTitle(e.target.value)}
        >
          <option value="all">All Job Titles</option>
          {Array.from(
            new Set(candidates.map((candidate) => candidate.jobTitle))
          ).map((jobTitle) => (
            <option key={jobTitle} value={jobTitle}>
              {jobTitle}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="w-full lg:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="hired">Hired</option>
        </select>

        {/* Sorting */}
        <select
          className="w-full lg:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Sort by Name (A-Z)</option>
          <option value="desc">Sort by Name (Z-A)</option>
        </select>
      </div>

      {/* Candidate Table */}
      {isLoading ? (
        <p className="text-center mt-6 text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full border-collapse border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-2 border border-gray-200">Full Name</th>
                <th className="px-4 py-2 border border-gray-200">ID</th>
                <th className="px-4 py-2 border border-gray-200">Email ID</th>
                <th className="px-4 py-2 border border-gray-200">Job Title</th>
                <th className="px-4 py-2 border border-gray-200">
                  Date of Birth
                </th>
                <th className="px-4 py-2 border border-gray-200">
                  Phone Number
                </th>
                <th className="px-4 py-2 border border-gray-200">Resume</th>
                <th className="px-4 py-2 border border-gray-200">Status</th>
                <th className="px-4 py-2 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate, index) => (
                <tr key={candidate._id} className="text-gray-600">
                  <td className="px-4 py-2 border border-gray-200">
                    {candidate.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">{`0${
                    index + 1
                  }`}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    {candidate.email}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {candidate.jobTitle}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {new Date(candidate.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {candidate.phoneNumber}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {candidate.resumeUrl ? (
                      <a
                        href={candidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      "No Resume"
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <span
                      className={`px-4 py-1 rounded-full text-sm ${
                        candidate.state === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : candidate.state === "reviewed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {candidate.state}
                    </span>
                  </td>
                  <td className="px-4 py-2 border border-gray-200 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600 transition"
                      onClick={() => {
                        setCurrentCandidate(candidate);
                        setModalIsOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                      onClick={() => handleDelete(candidate._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="p-8 bg-white rounded-lg max-w-md mx-auto shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const candidateData = Object.fromEntries(formData.entries());
            candidateData.resume = formData.get("resume"); // Append the file
            handleCreateOrUpdate(candidateData);
          }}
        >
          <h2 className="text-xl font-bold text-gray-800">
            {currentCandidate ? "Edit Candidate" : "Add Candidate"}
          </h2>
          <input
            name="name"
            defaultValue={currentCandidate?.name || ""}
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="jobTitle"
            defaultValue={currentCandidate?.jobTitle || ""}
            placeholder="Job Title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            defaultValue={currentCandidate?.email || ""}
            placeholder="Email ID"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="phoneNumber"
            defaultValue={currentCandidate?.phoneNumber || ""}
            placeholder="Phone Number"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <select
            name="state"
            defaultValue={currentCandidate?.state || "pending"}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="hired">Hired</option>
          </select>
          {currentCandidate?.resumeUrl && (
            <p>
              Existing Resume:{" "}
              <a
                href={currentCandidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Resume
              </a>
            </p>
          )}
          <input
            name="resume"
            type="file"
            accept=".pdf"
            required={!currentCandidate}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {currentCandidate ? "Update" : "Create"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Candidates;
