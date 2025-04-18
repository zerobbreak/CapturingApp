"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Save, X } from "lucide-react-native"
import { useRouter } from "expo-router"

const AddCustomerScreen = () => {
    const router = useRouter();
  const [name, setName] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [industry, setIndustry] = useState("")
  const [website, setWebsite] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("Active")

  const handleSave = () => {
    // Validate required fields
    if (!name || !contactName || !email || !phone) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    // In a real app, this would save the customer to the database
    Alert.alert("Success", "Customer added successfully", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ])
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Add New Customer</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Company Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput style={styles.input} placeholder="Enter company name" value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Contact Person <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter contact person's name"
              value={contactName}
              onChangeText={setContactName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Phone <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} placeholder="Enter address" value={address} onChangeText={setAddress} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Industry</Text>
            <TextInput style={styles.input} placeholder="Enter industry" value={industry} onChangeText={setIndustry} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter website"
              value={website}
              onChangeText={setWebsite}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              {["Active", "Inactive", "Lead"].map((statusOption) => (
                <TouchableOpacity
                  key={statusOption}
                  style={[styles.statusOption, status === statusOption && styles.statusOptionSelected]}
                  onPress={() => setStatus(statusOption)}
                >
                  <Text style={[styles.statusOptionText, status === statusOption && styles.statusOptionTextSelected]}>
                    {statusOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter notes about this customer"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Save stroke="#ffffff" width={20} height={20} />
              <Text style={styles.saveButtonText}>Save Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <X stroke="#64748b" width={20} height={20} />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    height: 100,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statusOptionSelected: {
    backgroundColor: "#2563eb",
  },
  statusOptionText: {
    color: "#64748b",
    fontWeight: "500",
  },
  statusOptionTextSelected: {
    color: "white",
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#2563eb",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
  },
  cancelButtonText: {
    color: "#64748b",
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 8,
  },
})

export default AddCustomerScreen
