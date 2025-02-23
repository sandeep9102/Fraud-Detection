import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import SBIlogo from './SBI-Logo.png';

function App() {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState<File | null>(null);
  const [policyNo, setPolicyNo] = useState('');
  const [signature, setSignature] = useState<File | null>(null);

  const dropdownOptions = {
    nominee_relation: ['Brother', 'Daughter', 'Father', 'Grand Daughter', 'Grand Son', 'Husband', 'Mother', 'Nephew', 'Niece', 'Sister', 'Son', 'Spouse', 'Wife'],
    occupation: ['Agriculturist', 'Army', 'Business', 'Construction Labour', 'Defense Retired', 'Family Pension', 'Housewife', 'Other Arm Forces Except Police', 'Profession', 'Retired', 'Self-Employed', 'Service', 'Student'],
    premium_payment_mode: ['Quarterly', 'Yearly', 'Half yearly', 'Monthly', 'Single'],
    holder_marital_status: ['Single', 'Married', 'Widowed', 'Divorced'],
    indiv_requirement_flag: ['Non Medical', 'Medical'],
    product_type: ['ULIP', 'Traditional', 'Pension', 'Health', 'Non Par', 'Variable'],
    channel: ['Retail Agency', 'Bancassurance', 'Institutional Alliance', 'Mail and Others'],
    status: ['Claim', 'Cancellation', 'Lapse', 'Technical Lapse', 'Inforce', 'Withdrawal', 'Rejection', 'Maturity', 'Terminated'],
    sub_status: ['Death Claim Repudiated', 'Other Reason', 'Death Claim Paid', 'Intimated Death Claim', 'Surrendered Reinvested Auto', 'Free Look Cancellation', 'Declined', 'Dishonour', 'Disinvested Paid', 'Surrendered', 'Refunded', 'Paid Up', 'Intimated Death Claim-Annuity', 'Unpaid', 'Disinvested Unpaid']
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleAuthenticate = () => {
    const authData = { policyNo, signature: signature?.name };
    const jsonString = JSON.stringify(authData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'authData.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#760498] to-[#96004C] flex flex-col items-center">
      <header className="bg-[#fefcff] text-purple-950 py-6 px-8 shadow-lg flex flex-col items-center w-full">
        <img src={SBIlogo} alt="SBI Logo" className="h-14 mb-2" />
        <h1 className="text-4xl font-bold text-center">Fraud Detection System</h1>
      </header>

      <main className="container mx-auto py-8 px-4 w-full flex flex-col lg:flex-row gap-8">
        {/* Left Side - Manual Data Entry */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#96004C] mb-8 text-center">Manual Data Entry</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policy Holder Name</label>
                <input type="text" name="policy_holder_name" onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2.5" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assured Age</label>
                <input type="number" name="assured_age" onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2.5" required />
              </div>
              {Object.keys(dropdownOptions).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key.replace(/_/g, ' ')}</label>
                  <select name={key} value={formData[key] || ''} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-2.5">
                    <option value="" disabled>Select {key.replace(/_/g, ' ')}</option>
                    {dropdownOptions[key].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
              <button type="submit" className="bg-[#96004C] text-white py-3 px-6 rounded-lg hover:bg-[#7A003A] shadow-md w-full">Submit</button>
            </form>
          </div>
        </div>

        {/* Right Side - Bulk Upload & E-Sign Auth */}
        <div className="lg:w-1/2 w-full flex flex-col gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#96004C] mb-6 text-center">Bulk Upload</h2>
            <input type="file" accept=".xlsx, .xls" className="w-full mb-4" onChange={handleFileUpload} />
            <button className="w-full bg-[#96004C] text-white py-3 px-6 rounded-lg hover:bg-[#7A003A] shadow-md">Upload File</button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#96004C] mb-6 text-center">E-Sign Auth</h2>
            <input type="text" placeholder="Enter Policy Number" className="w-full mb-4 border border-gray-300 rounded-md px-4 py-2.5" value={policyNo} onChange={(e) => setPolicyNo(e.target.value)} />
            <input type="file" className="w-full mb-4" onChange={(e) => setSignature(e.target.files?.[0] || null)} />
            <button className="w-full bg-[#96004C] text-white py-3 px-6 rounded-lg hover:bg-[#7A003A] shadow-md" onClick={handleAuthenticate}>Authenticate</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
