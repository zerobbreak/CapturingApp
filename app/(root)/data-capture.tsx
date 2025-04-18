"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { Camera, X, Upload, MapPin } from "lucide-react-native"

const DataCaptureScreen = () => {
  const [projectId, setProjectId] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([
    // Mock images for demonstration
    { id: "1", uri: "https://via.placeholder.com/150" },
    { id: "2", uri: "https://via.placeholder.com/150" },
  ])
  const [isUploading, setIsUploading] = useState(false)

  const handleAddImage = () => {
    // In a real app, this would open the camera or image picker
    Alert.alert("Add Image", "This would open the camera or image picker")

    // For demo purposes, add a mock image
    const newImage = { id: `${Date.now()}`, uri: "https://via.placeholder.com/150" }
    setImages([...images, newImage])
  }

  const handleRemoveImage = (id: any) => {
    setImages(images.filter((image) => image.id !== id))
  }

  const handleGetLocation = () => {
    // In a real app, this would get the current location
    setLocation("Current Location (40.7128° N, 74.0060° W)")
  }

  const handleSubmit = () => {
    if (!projectId || !location || !description || images.length === 0) {
      Alert.alert("Error", "Please fill in all fields and add at least one image")
      return
    }

    setIsUploading(true)

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      Alert.alert("Success", "Data captured successfully")

      // Reset form
      setProjectId("")
      setLocation("")
      setDescription("")
      setImages([])
    }, 2000)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Capture Data</Text>
      <Text style={styles.subtitle}>Fill in the details and upload images</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Project ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter project ID"
            value={projectId}
            onChangeText={setProjectId}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={styles.locationInput}
              placeholder="Enter or get current location"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
              <MapPin stroke="#ffffff" width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.imagesContainer}>
          <View style={styles.imagesHeader}>
            <Text style={styles.label}>Images</Text>
            <Text style={styles.imagesCount}>{images.length} images</Text>
          </View>

          <View style={styles.imageGrid}>
            {images.map((image) => (
              <View key={image.id} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(image.id)}>
                  <X stroke="#ffffff" width={16} height={16} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
              <Camera stroke="#64748b" width={24} height={24} />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isUploading}
        >
          <Upload stroke="#ffffff" width={20} height={20} />
          <Text style={styles.submitButtonText}>{isUploading ? "Uploading..." : "Submit Data"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 24,
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
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  locationButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 12,
    marginLeft: 8,
  },
  textArea: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    height: 100,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  imagesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  imagesCount: {
    fontSize: 14,
    color: "#64748b",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "30%",
    aspectRatio: 1,
    margin: "1.66%",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(239, 68, 68, 0.8)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
    width: "30%",
    aspectRatio: 1,
    margin: "1.66%",
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  addImageText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#93c5fd",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
})

export default DataCaptureScreen
