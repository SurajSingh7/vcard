"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Footer  from "./common/Footerconvergence"
import WibroLogo from "../../public/wibroLogo.svg"

const Navbar = () => {
  return (
    <nav className="bg-[#050e2c] py-4 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <div className="mr-2">
          <Image src={WibroLogo} alt="Cube Logo" width={150}  />
        </div>
      </div>
        
      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <a href="https://wibro.in" className="text-white hover:text-blue-300 transition-colors">
          Home
        </a>
        <a href="https://wibro.in/about" className="text-white hover:text-blue-300 transition-colors">
          About
        </a>
        <a href="https://wibro.in/#plans" className="text-white hover:text-blue-300 transition-colors">
          Our Plans
        </a>
        <a href="https://wibro.in/contact" className="text-white hover:text-blue-300 transition-colors">
          Contact Us
        </a>
      </div>
      <div></div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

const ConvergenceForm = () => {
  const searchParams = useSearchParams()
  const qrId = searchParams.get("qrId");

  try {  
    // Any potential code here
  }
  catch(error){
    console.log(error)
  }

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // success or error

  // State to manage mobile number validation error
  const [mobileError, setMobileError] = useState("")

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    // Check mobile number field for non-digit characters
    if (name === "mobileNumber") {
      // Allow empty string and digits only
      if (value && !/^\d*$/.test(value)) {
        setMobileError("Please enter only digits.")
      } else {
        setMobileError("")
      }
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // Validate mobile number contains only digits
    if (mobileError) {
      setMessageType("error")
      setMessage("Mobile number should contain only digits.")
      setLoading(false)
      return
    }

    // Validate that the mobile number is exactly 10 digits
    if (formData.mobileNumber.length !== 10) {
      setMessageType("error")
      setMessage("Please enter a valid 10-digit mobile number.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/convergence-qr/submitForm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, qrId }),
      })

      const data = await response.json()
      if (data.success) {
        setMessageType("success")
        setMessage("Form submitted successfully!")
        // Reset form fields
        setFormData({ name: "", mobileNumber: "" })
      } else {
        setMessageType("error")
        setMessage("Error: " + data.message)
      }
    } catch (error) {
      setMessageType("error")
      setMessage("Server error. Please try again later.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="p-4 sm:p-6">
        <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-md mx-auto border border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-normal text-black mb-2">Get in touch with us!</h2>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-medium text-gray-700 text-sm">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 text-black pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700 text-sm">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  maxLength={10}
                  className={`w-full text-black pl-10 pr-4 py-3 border ${mobileError ? "border-red-500" : "border-gray-200"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  pattern="[6-9]\d{9}"
                  placeholder="Enter 10-digit mobile number"
                  required
                />
              </div>
              {mobileError && (
                <p className="text-red-500 text-sm mt-1">{mobileError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ConvergenceForm
