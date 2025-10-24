import React, { useState } from "react";
import Header from "../components/Header";

export default function AccountsPanel() {
  // --- Dummy Data ---
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Asha Sen",
      roll: "24ME10135",
      amount: "₹20,000",
      bank: "HDFC Bank - 1234567890",
      sent: false,
      transactionId: "",
      proofFile: null,
    },
    {
      id: 2,
      name: "Rohan Kumar",
      roll: "24CS10217",
      amount: "₹15,000",
      bank: "ICICI Bank - 9876543210",
      sent: false,
      transactionId: "",
      proofFile: null,
    },
    {
      id: 3,
      name: "Priya Das",
      roll: "24EE10309",
      amount: "₹25,000",
      bank: "SBI - 1122334455",
      sent: false,
      transactionId: "",
      proofFile: null,
    },
  ]);

  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState("");
  const [file, setFile] = useState(null);

  // --- Handlers ---
  const openModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTransactionDetails("");
    setFile(null);
  };

  const handleConfirm = () => {
    if (!transactionDetails || !file) {
      alert("Please upload file and enter transaction details!");
      return;
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === selectedStudent.id
          ? {
              ...s,
              sent: true,
              transactionId: transactionDetails,
              proofFile: file,
            }
          : s
      )
    );

    closeModal();
  };

  const handleViewReceipt = (student) => {
    if (student.proofFile) {
      const fileURL = URL.createObjectURL(student.proofFile);
      window.open(fileURL, "_blank");
    } else {
      alert("No receipt uploaded!");
    }
  };

  // --- JSX ---
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F5F8FA] p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">Accounts Panel</h1>

          {/* Pending Scholarships */}
          <div className="mb-10">
            <h2 className="text-xl font-medium mb-4">Pending Scholarships</h2>
            {students.filter((s) => !s.sent).length === 0 ? (
              <div className="text-gray-600">No pending scholarships.</div>
            ) : (
              <div className="space-y-3">
                {students
                  .filter((s) => !s.sent)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-600">
                          Roll: {s.roll}
                        </div>
                        <div className="text-sm text-gray-600">
                          Amount: {s.amount}
                        </div>
                        <div className="text-sm text-gray-600">
                          Bank: {s.bank}
                        </div>
                      </div>

                      <button
                        onClick={() => openModal(s)}
                        className="px-4 py-2 rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                      >
                        Mark Sent
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Sent Scholarships */}
          <div>
            <h2 className="text-xl font-medium mb-4">Sent Scholarships</h2>
            {students.filter((s) => s.sent).length === 0 ? (
              <div className="text-gray-600">No scholarships sent yet.</div>
            ) : (
              <div className="space-y-3">
                {students
                  .filter((s) => s.sent)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="bg-gray-50 rounded-lg shadow-sm p-4 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-gray-600">
                          Roll: {s.roll}
                        </div>
                        <div className="text-sm text-gray-600">
                          Amount: {s.amount}
                        </div>
                        <div className="text-sm text-gray-600">
                          Bank: {s.bank}
                        </div>
                        <div className="text-sm text-gray-600">
                          Transaction ID:{" "}
                          <span className="font-medium text-blue-700">
                            {s.transactionId}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => handleViewReceipt(s)}
                          className="px-3 py-1 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                        >
                          View Receipt
                        </button>
                        <span className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700">
                          Sent
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Scholarship Transaction — {selectedStudent.name}
            </h2>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                Transaction Details <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter transaction ID or note"
                value={transactionDetails}
                onChange={(e) => setTransactionDetails(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Transaction Proof <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer px-4 py-2 bg-[hsl(199,89%,48%)] text-white text-sm rounded hover:bg-blue-500 transition"
                >
                  Choose File
                </label>
                <span className="text-gray-700 text-sm">
                  {file ? file.name : "No file chosen"}
                </span>
              </div>
              <input
                id="file-upload"
                type="file"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
              >
                Confirm & Mark Sent
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
