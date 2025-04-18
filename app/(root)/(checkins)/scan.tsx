"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { Camera, Check, X } from "lucide-react-native"
import { usePathname, useRouter } from "expo-router"

const ScanQRScreen = () => {
    const router = useRouter()
    const pathname = usePathname();
  const [hasPermission, setHasPermission] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [scanType, setScanType] = useState("checkin") // or "survey"

  useEffect(() => {
    // In a real app, this would request camera permissions
    // For this mock, we'll simulate permission granted
    setHasPermission(true)

    // Check if we're scanning for a survey
    if (pathname === "survey") {
      setScanType("survey")
    }
  }, [pathname])

  const handleBarCodeScanned = ({ type, data }: {type: any, data: any}) => {
    setScanned(true)

    if (scanType === "checkin") {
      // Mock successful check-in
      Alert.alert("Check-in Successful", "Worker ID: WRK-12345\nName: John Smith\nLocation: Main Site", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ])
    } else {
      // Mock successful survey scan
      Alert.alert("Survey Found", "Would you like to open the Customer Satisfaction Survey?", [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setScanned(false),
        },
        {
          text: "Open Survey",
          onPress: () => {
            // In a real app, this would open the survey in a webview or native form
            Alert.alert("Opening Survey", "This would open the survey in a real app")
            router.back()
          },
        },
      ])
    }
  }

  // Simulate a scan after 2 seconds for demo purposes
  useEffect(() => {
    if (hasPermission && !scanned) {
      const timer = setTimeout(() => {
        handleBarCodeScanned({ type: "QR_CODE", data: "mock-data" })
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [hasPermission, scanned])

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {/* This would be a real camera component in a production app */}
        <View style={styles.cameraPlaceholder}>
          <Camera stroke="#ffffff" width={40} height={40} />
          <Text style={styles.scanningText}>{scanned ? "Code detected!" : "Scanning..."}</Text>
        </View>
        <View style={styles.scanFrame} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>{scanType === "checkin" ? "Scan Worker ID" : "Scan Survey QR Code"}</Text>
        <Text style={styles.infoText}>
          {scanType === "checkin"
            ? "Position the QR code within the frame to check-in or check-out a worker."
            : "Position the QR code within the frame to open the survey."}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {scanned ? (
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
            <Check stroke="#ffffff" width={20} height={20} />
            <Text style={styles.scanAgainButtonText}>Scan Again</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <X stroke="#ffffff" width={20} height={20} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cameraPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e293b",
  },
  scanningText: {
    color: "#ffffff",
    marginTop: 16,
    fontSize: 16,
  },
  scanFrame: {
    position: "absolute",
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#2563eb",
    borderRadius: 12,
  },
  infoContainer: {
    backgroundColor: "#1e293b",
    padding: 20,
  },
  infoTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  infoText: {
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#1e293b",
  },
  scanAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 10,
  },
  scanAgainButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ScanQRScreen
