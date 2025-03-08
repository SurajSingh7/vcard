"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLoading } from "@/store/authSlice"
import axios from "axios"
import toast from "react-hot-toast"
import { Search, UserPlus, Edit, X, CheckCircle } from "lucide-react"

export default function SignupPage() {
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.auth.loading)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  // Fetch all staff users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/auth/signup")
      setUsers(response.data.users)
    } catch (error) {
      toast.error("Failed to fetch users")
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle both signup and update
  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setLoading(true))
    try {
      if (editingUser) {
        // Update staff member
        const response = await axios.put("/api/auth/signup", { id: editingUser._id, ...formData })
        toast.success(response.data.message)
        setEditingUser(null)
      } else {
        // Signup new staff member
        const response = await axios.post("/api/auth/signup", formData)
        toast.success(response.data.message)
      }
      setFormData({ name: "", email: "", password: "" })
      setShowModal(false)
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong")
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, password: "" })
    setShowModal(true)
  }

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return
    dispatch(setLoading(true))
    try {
      const response = await axios.delete("/api/auth/signup", { data: { id: userId } })
      toast.success(response.data.message)
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong")
    } finally {
      dispatch(setLoading(false))
    }
  }

  // Filter users based on search query (by name or email)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6">
            <h1 className="text-2xl font-bold text-white">Staff Management</h1>
            <p className="text-green-50 mt-1 opacity-90">Add, edit and manage your staff members</p>
          </div>

          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full py-2.5 px-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors shadow-sm"
                />
              </div>

              <button
                onClick={() => {
                  setEditingUser(null)
                  setFormData({ name: "", email: "", password: "" })
                  setShowModal(true)
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <UserPlus className="h-5 w-5" />
                <span>Add New Staff</span>
              </button>
            </div>

            {/* Staff List Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-teal-50">
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-semibold text-green-700 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-green-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-green-50/30"}`}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-500 mr-2">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </span>
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(user)}
                          className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-800 px-4 py-1.5 rounded-full hover:bg-green-50 transition-colors border border-green-200 hover:border-green-300 shadow-sm"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="h-12 w-12 text-green-200 mb-3" />
                          <p className="text-lg font-medium text-gray-600">No staff members found</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Try adjusting your search or add a new staff member
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Example (not functional) */}
            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
                <div>
                  Showing <span className="font-medium text-gray-700">{filteredUsers.length}</span> staff members
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-green-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors">
                    1
                  </button>
                  <button className="px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-green-50 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Signup / Edit Form */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-green-100 animate-fadeIn">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? "Edit Staff Member" : "Add New Staff Member"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-100 rounded-full p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder={editingUser ? "Leave blank to keep current password" : ""}
                    {...(!editingUser && { required: true })}
                  />
                  {editingUser && (
                    <p className="mt-1 text-xs text-gray-500">Leave blank to keep the current password</p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                      {editingUser ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{editingUser ? "Update Staff Member" : "Create Staff Member"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

