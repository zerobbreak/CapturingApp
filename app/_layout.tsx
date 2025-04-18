import type React from "react";

import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppwriteProvider } from "@/context/AppwriteContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  return (
    <AppwriteProvider>
      <AuthProvider>
        <ThemeProvider>
          <StatusBar style="dark" />
          <AuthGuard>
          <Slot />
          </AuthGuard>
        </ThemeProvider>
      </AuthProvider>
    </AppwriteProvider>
  )
}

// Auth guard component to handle protected routes
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // Check if the user is authenticated
    const inAuthGroup = segments[0] === "(auth)"
    const inProtectedGroup = segments[0] === "(root)"

    if (!isAuthenticated && inProtectedGroup) {
      // Redirect to login if trying to access protected routes without auth
      router.replace("/(auth)/login")
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if already authenticated but on auth routes
      router.replace("/(root)")
    }
  }, [isAuthenticated, isLoading, segments, router])

  if (isLoading) {
    // You could return a loading screen here
    return null
  }

  return <>{children}</>
}