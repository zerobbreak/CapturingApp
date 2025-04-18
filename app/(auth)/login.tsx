import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@react-navigation/native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if(!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
        await login(email, password);
    } catch (error) {
        Alert.alert("Login Failed", "Invalid email or password.");
        console.error("Login error: ", error);
    }finally {
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
        <Text style={[styles.title, { color: colors.text }]}>Workforce Manager</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter your email"
            placeholderTextColor={colors.primary}
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
            placeholderTextColor={colors.primary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.registerLink}>
            <Text style={[styles.registerText, { color: colors.text }]}>
              Don't have an account? <Text style={{ color: colors.primary }}>Register</Text>
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
      marginBottom: 40,
    },
    logo: {
      width: 120,
      height: 120,
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
      marginBottom: 20,
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
    registerLink: {
      marginTop: 20,
      alignItems: "center",
    },
    registerText: {
      fontSize: 14,
    },
  })
  
