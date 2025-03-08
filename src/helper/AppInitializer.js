'use client'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../store/authSlice";

export default function AppInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }

    if (storedToken) {
      dispatch(setToken(storedToken));
    }
  }, [dispatch]);

  return null; // This component is only for initializing state
}
