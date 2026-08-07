import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("mp_user");
    const token = localStorage.getItem("mp_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    const { data } = await api.post("/auth/login", { email, password, role });
    localStorage.setItem("mp_token", data.token);
    localStorage.setItem("mp_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("mp_token", data.token);
    localStorage.setItem("mp_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async (googleToken) => {
    const { data } = await api.post("/auth/google", { token: googleToken });
    localStorage.setItem("mp_token", data.token);
    localStorage.setItem("mp_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("mp_token");
    localStorage.removeItem("mp_user");
    setUser(null);
  };

  const updateUser = (updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem("mp_user", JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
