"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useRouter } from "expo-router"
import { ChevronRight, Plus, Search, User } from "lucide-react-native"
import { Query } from "react-native-appwrite"
import { useAppwrite } from "@/context/AppwriteContext"
import { useTheme } from "@/context/ThemeContext"

// Define worker type
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

export default function WorkersScreen() {
  const router = useRouter()
  const { databases, databaseId, collections } = useAppwrite()
  const { theme } = useTheme()

  const [workers, setWorkers] = useState<Worker[]>([])
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWorkers(workers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = workers.filter(
        (worker) =>
          worker.name.toLowerCase().includes(query) ||
          worker.position.toLowerCase().includes(query) ||
          worker.department.toLowerCase().includes(query),
      )
      setFilteredWorkers(filtered)
    }
  }, [searchQuery, workers])

  const loadWorkers = async () => {
    setLoading(true)
    try {
      const response = await databases.listDocuments(databaseId, collections.workers, [Query.orderDesc("$createdAt")])

      setWorkers(response.documents as any)
      setFilteredWorkers(response.documents as any)
    } catch (error) {
      console.error("Error loading workers:", error)
      Alert.alert("Error", "Failed to load workers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadWorkers()
    setRefreshing(false)
  }

  const handleAddWorker = () => {
    router.push("/(root)/(workers)/add")
  }

  const handleWorkerPress = (worker: Worker) => {
    router.push(`/(root)/(workers)/${worker.$id}`)
  }

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
    header: {
      padding: 16,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      borderRadius: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchInput: {
      flex: 1,
      height: 40,
      color: theme.text,
      marginLeft: 8,
    },
    addButton: {
      position: "absolute",
      right: 16,
      bottom: 16,
      backgroundColor: theme.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    workerCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    workerIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    workerInfo: {
      flex: 1,
    },
    workerName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
    },
    workerPosition: {
      fontSize: 14,
      color: theme.gray,
    },
    workerDepartment: {
      fontSize: 12,
      color: theme.gray,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 12,
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      color: theme.gray,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      marginTop: 50,
    },
    emptyText: {
      fontSize: 16,
      color: theme.gray,
      textAlign: "center",
      marginTop: 12,
    },
  })

  const renderWorkerItem = ({ item }: { item: Worker }) => {
    return (
      <TouchableOpacity style={styles.workerCard} onPress={() => handleWorkerPress(item)}>
        <View style={styles.workerIconContainer}>
          <User size={24} color={theme.primary} />
        </View>

        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{item.name}</Text>
          <Text style={styles.workerPosition}>{item.position}</Text>
          <Text style={styles.workerDepartment}>{item.department}</Text>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: item.status === "active" ? theme.success : theme.danger },
            ]}
          />
          <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
        </View>

        <ChevronRight size={20} color={theme.gray} />
      </TouchableOpacity>
    )
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading workers...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workers..."
            placeholderTextColor={theme.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredWorkers}
        renderItem={renderWorkerItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <User size={48} color={theme.gray} />
            <Text style={styles.emptyText}>No workers found</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddWorker}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}
