"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { useAppwrite } from "@/context/AppwriteContext"
import { useTheme } from "@/context/ThemeContext"
import { BarChart2, Camera, CheckCircle, ClipboardList, FileText, Users } from "lucide-react-native"
import { Query } from "react-native-appwrite"

export default function DashboardScreen() {
  const router = useRouter()
  const { databases, databaseId, collections } = useAppwrite()
  const { theme } = useTheme()

  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeWorkers: 0,
    totalWorkers: 0,
    customers: 0,
    activeSurveys: 0,
    recentCheckIns: [],
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch workers count
      const workersResponse = await databases.listDocuments(databaseId, collections.workers, [Query.limit(1)])

      // Fetch active check-ins
      const checkInsResponse = await databases.listDocuments(databaseId, collections.checkins, [
        Query.equal("type", "check-in"),
        Query.orderDesc("$createdAt"),
        Query.limit(10),
      ])

      // Fetch customers count
      const customersResponse = await databases.listDocuments(databaseId, collections.customers, [Query.limit(1)])

      // Fetch active surveys
      const surveysResponse = await databases.listDocuments(databaseId, collections.surveys, [
        Query.equal("status", "active"),
        Query.limit(1),
      ])

      // Calculate active workers (those who checked in but didn't check out)
      const activeWorkersCount = checkInsResponse.documents.filter(
        (checkIn) =>
          !checkInsResponse.documents.some(
            (c) =>
              c.workerId === checkIn.workerId &&
              c.type === "check-out" &&
              new Date(c.timestamp) > new Date(checkIn.timestamp),
          ),
      ).length

      setStats({
        activeWorkers: activeWorkersCount,
        totalWorkers: workersResponse.total,
        customers: customersResponse.total,
        activeSurveys: surveysResponse.total,
        recentCheckIns: checkInsResponse.documents,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
  }

  const navigateTo = (screen: any) => {
    router.push(`/(root)/${screen}`)
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
      backgroundColor: theme.primary,
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    content: {
      padding: 16,
    },
    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    statCard: {
      width: "48%",
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statTitle: {
      fontSize: 14,
      color: theme.gray,
      marginBottom: 8,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.primary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 12,
      marginTop: 8,
    },
    quickActionsContainer: {
      marginBottom: 20,
    },
    actionButtonsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    actionButton: {
      width: "31%",
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    actionIcon: {
      marginBottom: 8,
    },
    actionText: {
      fontSize: 12,
      color: theme.text,
      textAlign: "center",
    },
    activityItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    activityDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 12,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.text,
    },
    activityTime: {
      fontSize: 12,
      color: theme.gray,
      marginTop: 4,
    },
    emptyText: {
      textAlign: "center",
      color: theme.gray,
      fontStyle: "italic",
      padding: 20,
    },
  })

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Active Workers</Text>
            <Text style={styles.statValue}>{stats.activeWorkers}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Workers</Text>
            <Text style={styles.statValue}>{stats.totalWorkers}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Customers</Text>
            <Text style={styles.statValue}>{stats.customers}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Active Surveys</Text>
            <Text style={styles.statValue}>{stats.activeSurveys}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo("data-capture")}>
              <Camera size={24} color={theme.primary} style={styles.actionIcon} />
              <Text style={styles.actionText}>Capture Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo("(checkins)")}>
              <CheckCircle size={24} color={theme.primary} style={styles.actionIcon} />
              <Text style={styles.actionText}>Check In/Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo("(workers)")}>
              <Users size={24} color={theme.primary} style={styles.actionIcon} />
              <Text style={styles.actionText}>Workers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo("(customers)")}>
              <ClipboardList size={24} color={theme.primary} style={styles.actionIcon} />
              <Text style={styles.actionText}>Customers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo("(surveys)")}>
              <FileText size={24} color={theme.primary} style={styles.actionIcon} />
              <Text style={styles.actionText}>Surveys</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigateTo("(reports)")}>
              <BarChart2 size={24} color={theme.primary} style={styles.actionIcon} />
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {stats.recentCheckIns.length > 0 ? (
          stats.recentCheckIns.slice(0, 5).map((checkIn, index) => (
            <View key={index} style={styles.activityItem}>
              <View
                style={[
                  styles.activityDot,
                  { backgroundColor: checkIn.type === "check-in" ? theme.success : theme.danger },
                ]}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {checkIn.workerName} {checkIn.type === "check-in" ? "checked in" : "checked out"}
                </Text>
                <Text style={styles.activityTime}>{new Date(checkIn.timestamp).toLocaleString()}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No recent activity</Text>
        )}
      </ScrollView>
    </View>
  )
}
