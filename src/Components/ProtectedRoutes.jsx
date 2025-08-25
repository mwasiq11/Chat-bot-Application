import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe;
  }, []);

  if (!user) {
    navigate("/");
  }
      return children;
  
}
