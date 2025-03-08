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
    userName: "",
    password: "",
    mobile: ""
  })

  // State to hold immediate validation error for mobile field.
  const [mobileError, setMobileError] = useState("")

  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // New state: determine if the current user is admin
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Retrieve user from localStorage and check if userName is "admin"
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setIsAdmin(parsedUser.userName === "admin")
    }
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/auth/signup")
      setUsers(response.data.users)
    } catch (error) {
      toast.error("Failed to fetch users")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "mobile") {
      // Validate that only digits are allowed.
      if (value && !/^\d*$/.test(value)) {
        setMobileError("Only allow digit numbers")
      } else if (value.length > 10) {
        setMobileError("Please enter a 10-digit mobile number")
      } else {
        setMobileError("")
      }
    }
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a trimmed version of formData
    const trimmedFormData = {
      name: formData.name.trim(),
      userName: formData.userName.trim(),
      password: formData.password.trim(),
      mobile: formData.mobile.trim(),
    };

    // If mobile field is not empty, ensure it is exactly 10 digits and no error exists.
    if (trimmedFormData.mobile) {
      if (mobileError) {
        toast.error(mobileError);
        return;
      }
      if (trimmedFormData.mobile.length !== 10) {
        toast.error("Please enter a 10-digit mobile number");
        return;
      }
    }

    dispatch(setLoading(true));
    try {
      if (editingUser) {
        const response = await axios.put("/api/auth/signup", { id: editingUser._id, ...trimmedFormData });
        toast.success(response.data.message);
        setEditingUser(null);
      } else {
        const response = await axios.post("/api/auth/signup", trimmedFormData);
        toast.success(response.data.message);
      }
      setFormData({ name: "", userName: "", password: "", mobile: "" });
      setMobileError("");
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  }
  
  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({ 
      name: user.name, 
      userName: user.userName, 
      password: "", 
      mobile: user.mobile || "" 
    })
    setMobileError("")
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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="">

       <div className="h-3 bg-"></div>
      <div className="flex justify-center  ">
         <div className="  font-semibold m-2 ">Staff Lists</div>
      </div>
      

      <div className="">
        <div className="bg-white rounded-lg shadow-sm border border-orange-100">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full py-1.5 px-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors shadow-sm text-sm"
                />
              </div>

              {/* Render Add Staff button only if user is admin */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingUser(null)
                    setFormData({ name: "", userName: "", password: "", mobile: "" })
                    setMobileError("")
                    setShowModal(true)
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-1 rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Staff</span>
                </button>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-hidden rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-2 py-1 text-left font-semibold text-orange-700 uppercase">Name</th>
                    <th className="px-2 py-1 text-left font-semibold text-orange-700 uppercase">Username</th>
                    <th className="px-2 py-1 text-right font-semibold text-orange-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-2 py-2">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-2">
                            <div className="font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center text-gray-600">
                          <CheckCircle className="h-3 w-3 text-orange-500 mr-1" />
                          {user.userName}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-right">
                        {/* Render Edit button only if user is admin */}
                        {isAdmin && (
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-orange-600 hover:text-orange-800 p-1 rounded hover:bg-orange-50 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-2">
              {filteredUsers.map((user) => (
                <div key={user._id} className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                        <div className="mt-1 flex items-center text-gray-600 text-xs">
                          <CheckCircle className="h-3 w-3 text-orange-500 mr-1" />
                          {user.userName}
                        </div>
                      </div>
                    </div>
                    {/* Render Edit button only if user is admin */}
                    {isAdmin && (
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1 hover:bg-orange-50 rounded-full text-orange-600 hover:text-orange-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center p-4 bg-orange-50 rounded-md border border-dashed border-orange-200 mt-3">
                <Search className="h-10 w-10 text-orange-300 mx-auto mb-2" />
                <p className="font-medium text-gray-700 text-sm">No staff members found</p>
                <p className="text-xs text-gray-500 mt-1">
                  Try adjusting your search or add a new staff member
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-xs text-gray-600">
                <div className="mb-2 sm:mb-0">
                  Showing {filteredUsers.length} staff members
                </div>
                <div className="flex space-x-1">
                  <button className="px-2 py-1 rounded bg-white border border-gray-200 hover:bg-orange-50">
                    Prev
                  </button>
                  <button className="px-2 py-1 rounded bg-orange-500 text-white hover:bg-orange-600">
                    1
                  </button>
                  <button className="px-2 py-1 rounded bg-white border border-gray-200 hover:bg-orange-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2 border border-orange-100">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-4 py-2 flex justify-between items-center rounded-t-lg">
              <h2 className="text-sm font-bold text-white">
                {editingUser ? "Edit Staff" : "Add Staff"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-orange-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 text-xs"
                    placeholder={editingUser ? "Leave blank to keep" : ""}
                    required={!editingUser}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 text-xs"
                    placeholder="Enter 10-digit mobile number"
                  />
                  {mobileError && <p className="text-red-500 text-xs mt-1">{mobileError}</p>}
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium transition-all text-xs ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:from-orange-600 hover:to-orange-700"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                        {/* ... spinner SVG ... */}
                      </svg>
                      {editingUser ? "Saving..." : "Creating..."}
                    </div>
                  ) : editingUser ? (
                    "Save Changes"
                  ) : (
                    "Create Staff"
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





