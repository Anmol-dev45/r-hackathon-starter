"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    // Contact Information
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    // Complaint Details
    complaintCategory: '',
    complaintDate: '',
    complaintLocation: '',
    complaintDescription: '',
    // Additional Information
    previousComplaint: '',
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files || [])])
    }
  }

  const removeFile = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Complaint Form submitted:', formData)
    console.log('Attachments:', attachments)
    setSubmitted(true)
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      complaintCategory: '',
      complaintDate: '',
      complaintLocation: '',
      complaintDescription: '',
      previousComplaint: '',
    })
    setAttachments([])
    setTimeout(() => setSubmitted(false), 4000)
    console.log(JSON.stringify(formData, null, 2))
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-6 bg-blue-50 border-2 border-blue-300">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-blue-400 bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded">
        <h1 className="text-2xl font-bold text-blue-900">COMPLAINT FORM</h1>
        <p className="text-sm text-blue-700 mt-2">Government Complaint Registration System</p>
      </div>

      {/* Personal Information Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 bg-blue-200 p-2 text-blue-900 rounded">SECTION 1: PERSONAL INFORMATION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">First Name <span className="text-blue-600">*</span></label>
            <Input
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
              className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">Last Name <span className="text-blue-600">*</span></label>
            <Input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
              className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">Date of Birth <span className="text-blue-600">*</span></label>
            <Input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">Gender <span className="text-blue-600">*</span></label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full h-9 px-3 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 bg-blue-200 p-2 text-blue-900 rounded">SECTION 2: CONTACT INFORMATION</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">Email Address <span className="text-blue-600">*</span></label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">Phone Number <span className="text-blue-600">*</span></label>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              required
              className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-900">Street Address <span className="text-blue-600">*</span></label>
          <Input
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter street address"
            required
            className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500 mb-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">City <span className="text-blue-600">*</span></label>
            <Input
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
              className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">State/Province <span className="text-blue-600">*</span></label>
            <Input
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              required
              className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">Postal Code</label>
            <Input
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code (Optional)"
              className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Complaint Details Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 bg-blue-200 p-2 text-blue-900 rounded">SECTION 3: COMPLAINT DETAILS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">Category of Complaint <span className="text-blue-600">*</span></label>
            <select
              name="complaintCategory"
              value={formData.complaintCategory}
              onChange={handleChange}
              required
              className="w-full h-9 px-3 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
            >
              <option value="">Select Category</option>
              <option value="corruption">Corruption</option>
              <option value="abuse">Abuse of Power</option>
              <option value="misconduct">Misconduct</option>
              <option value="services">Poor Service</option>
              <option value="harassment">Harassment</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-900">Date of Incident <span className="text-blue-600">*</span></label>
            <Input
              name="complaintDate"
              type="date"
              value={formData.complaintDate}
              onChange={handleChange}
              required
              className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-900">Location of Incident <span className="text-blue-600">*</span></label>
          <Input
            name="complaintLocation"
            type="text"
            value={formData.complaintLocation}
            onChange={handleChange}
            placeholder="Enter location details"
            required
            className="h-9 border-2 border-blue-300 bg-white focus:border-blue-500 mb-4"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-900">Detailed Description of Complaint <span className="text-blue-600">*</span></label>
          <textarea
            name="complaintDescription"
            value={formData.complaintDescription}
            onChange={handleChange}
            placeholder="Please provide a detailed description of your complaint. Include all relevant facts and circumstances."
            rows={6}
            className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
            required
          />
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 bg-blue-200 p-2 text-blue-900 rounded">SECTION 4: ADDITIONAL INFORMATION</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-blue-900">Have you filed a complaint previously?</label>
          <select
            name="previousComplaint"
            value={formData.previousComplaint}
            onChange={handleChange}
            className="w-full h-9 px-3 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900"
          >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-900">Supporting Documents/Attachments (Photos, Videos, Documents)</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mov,.mp4,.avi"
            onChange={handleFileChange}
            className="block w-full text-sm text-blue-900 border-2 border-blue-300 rounded-md cursor-pointer bg-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-blue-600 mt-1">You can select multiple files at once, or click again to add more files</p>
          {attachments.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-blue-900">Selected Files ({attachments.length}):</p>
                <button
                  type="button"
                  onClick={() => setAttachments([])}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Clear All
                </button>
              </div>
              <ul className="text-xs text-blue-800 space-y-2">
                {attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-white p-2 rounded border border-blue-100">
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="mr-2">📎</span>
                      <span className="truncate">{file.name}</span>
                      <span className="ml-2 text-blue-600 whitespace-nowrap">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Declaration */}
      <div className="mb-8 p-4 bg-blue-100 border-2 border-blue-400 rounded">
        <p className="text-sm font-semibold mb-2 text-blue-900">DECLARATION:</p>
        <p className="text-xs text-blue-800">
          I hereby declare that the information provided in this form is true and correct to the best of my knowledge. 
          I understand that providing false information may result in legal action.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 font-semibold rounded-md shadow-md"
        >
          SUBMIT COMPLAINT
        </Button>
        <Button 
          type="reset" 
          className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 font-semibold rounded-md shadow-md"
          onClick={() => setFormData({
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            complaintCategory: '',
            complaintDate: '',
            complaintLocation: '',
            complaintDescription: '',
            previousComplaint: '',
          })}
        >
          CLEAR FORM
        </Button>
      </div>

      {submitted && (
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-500 rounded">
          <p className="text-center text-sm font-semibold text-blue-700">
            ✓ COMPLAINT SUCCESSFULLY SUBMITTED
          </p>
          <p className="text-center text-xs text-blue-600 mt-1">
            Your complaint has been registered. Reference number will be sent to your email.
          </p>
        </div>
      )}
    </form>
  )
}

export default ComplaintForm