"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Switch } from "react-native"
import { Calendar, Clock, Filter, User, QrCode } from "lucide-react-native"
import { useRouter } from "expo-router"

type CheckIn = {
    id: string
    workerId: string
    workerName: string
    type: string
    time: string
    date: string
    location: string
}
// Mock data for check-ins
const MOCK_CHECKINS: CheckIn[] = [
  {
    id: "1",
    workerId: "1",
    workerName: "John Smith",
    type: "Check-in",
    time: "08:30 AM",
    date: "2023-04-18",
    location: "Main Site",
  },
  {
    id: "2",
    workerId: "4",
    workerName: "Emily Davis",
    type: "Check-in",
    time: "08:45 AM",
    date: "2023-04-18",
    location: "Main Site",
  },
  {
    id: "3",
    workerId: "2",
    workerName: "Sarah Johnson",
    type: "Check-in",
    time: "09:00 AM",
    date: "2023-04-18",
    location: "Main Site",
  },
  {
    id: "4",
    workerId: "5",
    workerName: "David Wilson",
    type: "Check-in",
    time: "09:15 AM",
    date: "2023-04-18",
    location: "Main Site",
  },
  {
    id: "5",
    workerId: "1",
    workerName: "John Smith",
    type: "Check-out",
    time: "05:30 PM",
    date: "2023-04-18",
    location: "Main Site",
  },
  {
    id: "6",
    workerId: "4",
    workerName: "Emily Davis",
    type: "Check-out",
    time: "05:45 PM",
    date: "2023-04-18",
    location: "Main Site",
  },
  {
    id: "7",
    workerId: "7",
    workerName: "Robert Taylor",
    type: "Check-in",
    time: "08:15 AM",
    date: "2023-04-18",
    location: "Secondary Site",
  },
  {
    id: "8",
    workerId: "8",
    workerName: "Jennifer Anderson",
    type: "Check-in",
    time: "08:20 AM",
    date: "2023-04-18",
    location: "Secondary Site",
  },
]

const CheckInsScreen = () => {
    const router = useRouter();
  const [refreshing, setRefreshing] = useState(false)
  const [showCheckInsOnly, setShowCheckInsOnly] = useState(false)
  const [checkins, setCheckins] = useState<CheckIn[]>(MOCK_CHECKINS)

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const filteredCheckins = showCheckInsOnly ? checkins.filter((checkin) => checkin.type === "Check-in") : checkins

  const renderCheckinItem = ({ item }: {item: CheckIn}) => (
    <View style={styles.checkinCard}>
      <View style={styles.checkinHeader}>
        <View style={styles.workerAvatarContainer}>
          <User stroke="#64748b" width={20} height={20} />
        </View>
        <View style={styles.checkinInfo}>
          <Text style={styles.workerName}>{item.workerName}</Text>
          <View style={styles.checkinTypeContainer}>
            <View style={[styles.typeDot, { backgroundColor: item.type === "Check-in" ? "#10b981" : "#f59e0b" }]} />
            <Text style={styles.checkinType}>{item.type}</Text>
          </View>
        </View>
      </View>

      <View style={styles.checkinDetails}>
        <View style={styles.detailItem}>
          <Clock stroke="#64748b" width={16} height={16} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailItem}>
          <Calendar stroke="#64748b" width={16} height={16} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <Text style={styles.locationText}>{item.location}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Check-ins & Check-outs</Text>
        <TouchableOpacity style={styles.scanButton} onPress={() => router.push("/(root)/(checkins)/scan")}>
          <QrCode stroke="#ffffff" width={20} height={20} />
          <Text style={styles.scanButtonText}>Scan QR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterOption}>
          <Text style={styles.filterLabel}>Show Check-ins Only</Text>
          <Switch
            value={showCheckInsOnly}
            onValueChange={setShowCheckInsOnly}
            trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
            thumbColor={showCheckInsOnly ? "#2563eb" : "#f1f5f9"}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter stroke="#64748b" width={20} height={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCheckins}
        renderItem={renderCheckinItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.checkinsList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No check-ins found</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scanButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 14,
    color: "#1e293b",
    marginRight: 8,
  },
  filterButton: {
    width: 36,
    height: 36,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkinsList: {
    paddingBottom: 16,
  },
  checkinCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkinHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  workerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkinInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  checkinTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  checkinType: {
    fontSize: 14,
    color: "#64748b",
  },
  checkinDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
  },
})

export default CheckInsScreen
