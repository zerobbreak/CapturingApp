"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Switch } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ChevronLeft, Edit, Trash, User, Mail, Phone, Briefcase, Tag } from "lucide-react-native"
import { Query } from "react-native-appwrite"
import { useAppwrite } from "@/context/AppwriteContext"
import { useTheme } from "@/context/ThemeContext"

interface Worker {
  $id: string
  name: string
  position: string
  status: "active" | "inactive"
  department: string
  contactInfo: {
    email: string
    phone: string
  }
  skills: string[]
  lastActive?: string
  createdAt: string
}

interface CheckIn {
  $id: string
  workerId: string
  workerName: string
  type: "check-in" | "check-out"
  timestamp: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
}

export default function WorkerDetailsScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { databases, databaseId, collections } = useAppwrite()
  const { theme } = useTheme()

  const [worker, setWorker] = useState<Worker | null>(null)
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadWorkerDetails()
    }
  }, [id])

  const loadWorkerDetails = async () => {
    setLoading(true)
    try {
      // Fetch worker details
      const workerData = await databases.getDocument(databaseId, collections.workers, id as string)

      // Fetch worker check-ins
      const checkInsData = await databases.listDocuments(databaseId, collections.checkins, [
        Query.equal("workerId", id as string),
        Query.orderDesc("timestamp"),
        Query.limit(10),
      ])

      setWorker(workerData as any)
      setCheckIns(checkInsData.documents as any)
    } catch (error) {
      console.error("Error loading worker details:", error)
      Alert.alert("Error", "Failed to load worker details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleWorkerStatus = async () => {
    if (!worker) return

    setStatusLoading(true)
    try {
      const newStatus = worker.status === "active" ? "inactive" : "active"

      // Update worker status
      const updated = await databases.updateDocument(databaseId, collections.workers, worker.$id, {
        status: newStatus,
      })

      setWorker({ ...worker, status: newStatus })
      Alert.alert("Success", `Worker status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating worker status:", error)
      Alert.alert("Error", "Failed to update worker status. Please try again.")
    } finally {
      setStatusLoading(false)
    }
  }

  const handleDeleteWorker = () => {
    Alert.alert("Delete Worker", "Are you sure you want to delete this worker? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: deleteWorker },
    ])
  }

  const deleteWorker = async () => {
    if (!worker) return

    setDeleteLoading(true)
    try {
      // Delete worker
      await databases.deleteDocument(databaseId, collections.workers, worker.$id)

      Alert.alert("Success", "Worker deleted successfully", [{ text: "OK", onPress: () => router.push("/(root)/(workers)/index") }])
    } catch (error) {
      console.error("Error deleting worker:", error)
      Alert.alert("Error", "Failed to delete worker. Please try again.")
      setDeleteLoading(false)
    }
  }

  // const handleEditWorker = () => {
  //   if (!worker) return

  //   router.push({
  //     pathname: "/(root)/(workers)/edit",
  //     params: { id: worker.$id },
  //   })
  // }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: theme.gray,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.background,
    },
    errorText: {
      fontSize: 18,
      color: theme.danger,
      marginBottom: 20,
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
      flex: 1,
    },
    headerActions: {
      flexDirection: "row",
    },
    headerButton: {
      marginLeft: 16,
    },
    content: {
      flex: 1,
    },
    profileHeader: {
      flexDirection: "row",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    avatarContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    profileInfo: {
      flex: 1,
      justifyContent: "center",
    },
    profileName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    profilePosition: {
      fontSize: 16,
      color: theme.gray,
      marginBottom: 8,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      fontSize: 14,
      color: theme.gray,
    },
    section: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
    },
    infoItem: {
      flexDirection: "row",
      marginBottom: 16,
    },
    infoIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.gray,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 16,
      color: theme.text,
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 4,
    },
    skillBadge: {
      backgroundColor: theme.primary + "20",
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 8,
    },
    skillText: {
      color: theme.primary,
      fontSize: 14,
    },
    noSkillsText: {
      color: theme.gray,
      fontStyle: "italic",
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 12,
    },
    statusLabel: {
      fontSize: 16,
      color: theme.text,
    },
    statusLoader: {
      marginTop: 8,
      alignSelf: "center",
    },
    checkInItem: {
      flexDirection: "row",
      marginBottom: 12,
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 12,
    },
    checkInDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 12,
      marginTop: 6,
    },
    checkInContent: {
      flex: 1,
    },
    checkInType: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text,
    },
    checkInTime: {
      fontSize: 14,
      color: theme.gray,
      marginTop: 4,
    },
    checkInLocation: {
      fontSize: 14,
      color: theme.gray,
      marginTop: 4,
    },
    noCheckInsText: {
      color: theme.gray,
      fontStyle: "italic",
      textAlign: "center",
      padding: 12,
    },
    backButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "500",
    },
  })

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading worker details...</Text>
      </View>
    )
  }

  if (!worker) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Worker not found</Text>
        <TouchableOpacity onPress={() => router.push("/(root)/index")}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(root)/(workers)/index")}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Worker Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
            <Edit size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleDeleteWorker} disabled={deleteLoading}>
            {deleteLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Trash size={20} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color={theme.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{worker.name}</Text>
            <Text style={styles.profilePosition}>{worker.position}</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: worker.status === "active" ? theme.success : theme.danger },
                ]}
              />
              <Text style={styles.statusText}>{worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.infoItem}>
            <Briefcase size={20} color={theme.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{worker.department}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Mail size={20} color={theme.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{worker.contactInfo.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Phone size={20} color={theme.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{worker.contactInfo.phone}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Tag size={20} color={theme.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Skills</Text>
              <View style={styles.skillsContainer}>
                {worker.skills && worker.skills.length > 0 ? (
                  worker.skills.map((skill, index) => (
                    <View key={index} style={styles.skillBadge}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noSkillsText}>No skills listed</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>{worker.status === "active" ? "Active" : "Inactive"}</Text>
            <Switch
              value={worker.status === "active"}
              onValueChange={toggleWorkerStatus}
              disabled={statusLoading}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={worker.status === "active" ? theme.primary : theme.gray}
            />
          </View>
          {statusLoading && <ActivityIndicator size="small" color={theme.primary} style={styles.statusLoader} />}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Check-ins</Text>
          {checkIns.length > 0 ? (
            checkIns.map((checkIn, index) => (
              <View key={index} style={styles.checkInItem}>
                <View
                  style={[
                    styles.checkInDot,
                    { backgroundColor: checkIn.type === "check-in" ? theme.success : theme.danger },
                  ]}
                />
                <View style={styles.checkInContent}>
                  <Text style={styles.checkInType}>{checkIn.type === "check-in" ? "Checked In" : "Checked Out"}</Text>
                  <Text style={styles.checkInTime}>{new Date(checkIn.timestamp).toLocaleString()}</Text>
                  {checkIn.location.address && <Text style={styles.checkInLocation}>{checkIn.location.address}</Text>}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noCheckInsText}>No recent check-ins</Text>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
