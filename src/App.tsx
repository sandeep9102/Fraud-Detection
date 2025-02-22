import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import type { FraudData } from './types';
import * as XLSX from 'xlsx';
import SBIlogo from './SBI-Logo.png';

function App() {
  const [formData, setFormData] = useState<FraudData>({} as FraudData);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", { // Adjust backend URL
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jsonString = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formData.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dropdownOptions = {
    nominee_relation: ['Brother', 'Daughter', 'Father', 'Mother', 'Son', 'Spouse'],
    occupation: ['Agriculturist', 'Business', 'Housewife', 'Student'],
    premium_payment_mode: ['Quarterly', 'Yearly', 'Monthly'],
    holder_marital_status: ['Single', 'Married', 'Widowed'],
    indiv_requirement_flag: ['Non Medical', 'Medical'],
    product_type: ['ULIP', 'Traditional', 'Pension'],
    channel: ['Retail Agency', 'Bancassurance'],
    status: ['Claim', 'Cancellation', 'Lapse'],
    sub_status: ['Death Claim Paid', 'Free Look Cancellation', 'Declined']
  };

  const inputFields = [
    "policy_holder_name", "assured_age", "nominee_relation", "occupation", "policy_sum_assured", "premium", "premium_payment_mode", 
    "annual_income", "holder_marital_status", "indiv_requirement_flag", "policy_term", "policy_payment_term", 
    "product_type", "channel", "bank_code", "policy_risk_commencement_date", "date_of_death", 
    "intimation_date", "status", "sub_status"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#45005A] to-[#96004C]">
      <header className="bg-[#650084] text-white py-6 px-8 shadow-lg flex items-center relative">
        <img src={SBIlogo} alt="SBI Logo" className="h-14" />
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold text-yellow-400">
          Fraud Detection System
        </h1>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#96004C] mb-8">Manual Data Entry</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {inputFields.map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    {dropdownOptions[key] ? (
                      <select
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5"
                      >
                        <option value="" disabled>Select {key.replace(/_/g, ' ')}</option>
                        {dropdownOptions[key].map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={key}
                        value={formData[key] || ''}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5"
                        placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                      />
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  className="bg-[#96004C] text-white py-3 px-6 rounded-lg hover:bg-[#7A003A] shadow-md"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#96004C] mb-6">Bulk Upload</h2>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select File Format:</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 mb-4"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <option value="" disabled>Select format</option>
                <option value="Excel">Excel (.xlsx, .xls)</option>
                <option value="PDF">PDF (.pdf)</option>
                <option value="Image">Image (.png, .jpg, .jpeg)</option>
              </select>
              <input type="file" accept=".xlsx,.xls,.pdf,.png,.jpg,.jpeg" onChange={handleFileChange} className="w-full mb-4" />
              <button
                onClick={handleFileUpload}
                className="w-full bg-[#96004C] text-white py-3 px-6 rounded-lg hover:bg-[#7A003A] shadow-md"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
