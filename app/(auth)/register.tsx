"use client"

import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from "react-native"
import { Link } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@react-navigation/native"

export default function RegisterScreen (){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const { colors } = useTheme();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            await register(email, password, name);
        } catch (error) {
            Alert.alert("Registration Failed", "An error occurred during registration.");
            console.error("Registration error: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.logo} resizeMode="contain" />
            
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          </View>
    
          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
              />
            </View>
    
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
    
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
    
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
    
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Register</Text>}
            </TouchableOpacity>
    
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.loginLink}>
                <Text style={[styles.loginText, { color: colors.text }]}>
                  Already have an account? <Text style={{ color: colors.primary }}>Login</Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      )
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 20,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 30,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
    },
    formContainer: {
      width: "100%",
    },
    inputContainer: {
      marginBottom: 16,
      borderRadius: 8,
      borderWidth: 1,
      padding: 12,
    },
    label: {
      fontSize: 14,
      marginBottom: 8,
      fontWeight: "500",
    },
    input: {
      fontSize: 16,
      paddingVertical: 8,
    },
    button: {
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    loginLink: {
      marginTop: 20,
      alignItems: "center",
    },
    loginText: {
      fontSize: 14,
    },
  })