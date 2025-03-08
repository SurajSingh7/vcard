import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setToken, setUser } from "../store/authSlice"; // Adjust path as needed

const logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setToken(null)); // Clear token from Redux state
    dispatch(setUser(null));  // Clear user info from Redux state
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("user");  // Remove user info from localStorage

    // Remove authToken cookie by setting it to expire
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    toast.success("Logged Out");      // Show success message
    navigate("/");                    // Redirect to the home page
  };

  return handleLogout;
};

export default logout;







// // LogoutFunction.js
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { setToken, setUser } from "../store/authSlice"; // Adjust path as needed

// const logout = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(setToken(null)); // Clear token from Redux state
//     dispatch(setUser(null));  // Clear user info from Redux state
//     localStorage.removeItem("token"); // Remove token from localStorage
//     localStorage.removeItem("user");  // Remove user info from localStorage
//     toast.success("Logged Out");      // Show success message
//     navigate("/");                    // Redirect to the home page
//   };

//   return logout;
// };

// export default logout;
