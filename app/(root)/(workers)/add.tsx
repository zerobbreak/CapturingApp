"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import { useTheme } from "@/context/ThemeContext"
import { useAppwrite } from "@/context/AppwriteContext"

export default function AddWorkerScreen() {
  const router = useRouter()
  const { databases, databaseId, collections } = useAppwrite()
  const { theme } = useTheme()

  const [name, setName] = useState("")
  const [position, setPosition] = useState("")
  const [department, setDepartment] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [skills, setSkills] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Worker name is required")
      return false
    }
    if (!position.trim()) {
      Alert.alert("Error", "Position is required")
      return false
    }
    if (!department.trim()) {
      Alert.alert("Error", "Department is required")
      return false
    }
    if (!email.trim()) {
      Alert.alert("Error", "Email is required")
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }

    if (!phone.trim()) {
      Alert.alert("Error", "Phone number is required")
      return false
    }

    return true
  }

  const handleAddWorker = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      // Convert skills string to array
      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)

      // Create worker document
      await databases.createDocument(databaseId, collections.workers, "unique()", {
        name,
        position,
        department,
        contactInfo: {
          email,
          phone,
        },
        skills: skillsArray,
        status: isActive ? "active" : "inactive",
        createdAt: new Date().toISOString(),
      })

      Alert.alert("Success", "Worker added successfully", [
        { text: "OK", onPress: () => router.push("/(root)/(worker)/index") },
      ])
    } catch (error) {
      console.error("Error adding worker:", error)
      Alert.alert("Error", "Failed to add worker. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.primary,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "bold",
    },
    content: {
      padding: 16,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
    },
    textArea: {
      height: 80,
      textAlignVertical: "top",
    },
    switchContainer: {
      marginBottom: 24,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
    },
    statusText: {
      fontSize: 16,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginBottom: 24,
    },
    disabledButton: {
      opacity: 0.7,
    },
    addButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  })

  return (
    <ScrollView
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(root)/(workers)/index")}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Worker</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter worker name"
            placeholderTextColor={theme.gray}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Position</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter position"
            placeholderTextColor={theme.gray}
            value={position}
            onChangeText={setPosition}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Department</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter department"
            placeholderTextColor={theme.gray}
            value={department}
            onChangeText={setDepartment}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor={theme.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor={theme.gray}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Skills (comma separated)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter skills, separated by commas"
            placeholderTextColor={theme.gray}
            value={skills}
            onChangeText={setSkills}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>{isActive ? "Active" : "Inactive"}</Text>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={isActive ? theme.primary : theme.gray}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addButton, loading && styles.disabledButton]}
          onPress={handleAddWorker}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.addButtonText}>Add Worker</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      </ScrollView>
  )
}
  

