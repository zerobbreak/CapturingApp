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

function AuthGuard({children}: {children: React.ReactNode}) {
  const {isAuthenticated, isLoading} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if(isLoading) return

    //check if user is authenticated
    const inAuthGroup = (segments[0] as string) === "(auth)";
    const inProtectedGroup = (segments[0] as string) === "(root)";

    if(!isAuthenticated && inProtectedGroup) {
      router.replace("/auth/login");
    }
  })
}