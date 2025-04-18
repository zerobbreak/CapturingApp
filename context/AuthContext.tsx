"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import type { Models } from "react-native-appwrite"
import { ID } from "react-native-appwrite"
import { useAppwrite } from "./AppwriteContext"

type AuthContextType = {
  user: Models.User<Models.Preferences> | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { account } = useAppwrite()
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      // Check if user is already logged in
      try {
        const currentUser = await account.get()
        setUser(currentUser)
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [account])

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password)
      const loggedInUser = await account.get()
      setUser(loggedInUser)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      await account.create(ID.unique(), email, password, name)
      await login(email, password)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await account.deleteSession("current")
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
