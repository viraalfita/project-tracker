"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, Role } from "@/lib/types";
import { USERS } from "@/lib/mock";

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function login(user: User) {
    setCurrentUser(user);
  }

  function logout() {
    setCurrentUser(null);
  }

  function switchRole(role: Role) {
    // Switch to the mock user that has the selected role
    const match = USERS.find((u) => u.role === role);
    if (match) setCurrentUser(match);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
