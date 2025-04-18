"use client"

import { useRouter } from "expo-router"
import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from "react-native"
import { Search, Plus, Filter, User } from "lucide-react-native"

type Customer = {
    id: string
    name: string
    contact: string
    phone: string
    email: string
    status: string
    industry: string
}
// Mock data for customers
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Acme Corporation",
    contact: "John Doe",
    phone: "(555) 123-4567",
    email: "john@acme.com",
    status: "Active",
    industry: "Construction",
  },
  {
    id: "2",
    name: "TechSolutions Inc",
    contact: "Jane Smith",
    phone: "(555) 234-5678",
    email: "jane@techsolutions.com",
    status: "Active",
    industry: "Technology",
  },
  {
    id: "3",
    name: "Global Builders",
    contact: "Robert Johnson",
    phone: "(555) 345-6789",
    email: "robert@globalbuilders.com",
    status: "Inactive",
    industry: "Construction",
  },
  {
    id: "4",
    name: "Innovative Systems",
    contact: "Sarah Williams",
    phone: "(555) 456-7890",
    email: "sarah@innovative.com",
    status: "Active",
    industry: "Technology",
  },
  {
    id: "5",
    name: "Metro Development",
    contact: "Michael Brown",
    phone: "(555) 567-8901",
    email: "michael@metro.com",
    status: "Lead",
    industry: "Real Estate",
  },
  {
    id: "6",
    name: "Secure Solutions",
    contact: "Emily Davis",
    phone: "(555) 678-9012",
    email: "emily@secure.com",
    status: "Active",
    industry: "Security",
  },
  {
    id: "7",
    name: "Event Masters",
    contact: "David Wilson",
    phone: "(555) 789-0123",
    email: "david@eventmasters.com",
    status: "Active",
    industry: "Event Management",
  },
  {
    id: "8",
    name: "Field Services Co",
    contact: "Jessica Martinez",
    phone: "(555) 890-1234",
    email: "jessica@fieldservices.com",
    status: "Lead",
    industry: "Field Services",
  },
]

const CustomersScreen = () => {
    const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.industry.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#10b981"
      case "Inactive":
        return "#94a3b8"
      case "Lead":
        return "#f59e0b"
      default:
        return "#94a3b8"
    }
  }

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() => router.push(`/customers/${item.id}`)}
    >
      <View style={styles.customerHeader}>
        <View style={styles.customerAvatarContainer}>
          <User stroke="#64748b" width={24} height={24} />
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerContact}>{item.contact}</Text>
          <View style={styles.customerStatusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={styles.customerStatus}>{item.status}</Text>
            <Text style={styles.customerIndustry}>• {item.industry}</Text>
          </View>
        </View>
      </View>

      <View style={styles.customerDetails}>
        <Text style={styles.detailText}>{item.phone}</Text>
        <Text style={styles.detailText}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search stroke="#64748b" width={20} height={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter stroke="#64748b" width={20} height={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Customers ({filteredCustomers.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(root)/(customers)/new")}>
          <Plus stroke="#ffffff" width={20} height={20} />
          <Text style={styles.addButtonText}>Add Customer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.customersList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No customers found</Text>
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
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 44,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 4,
  },
  customersList: {
    paddingBottom: 16,
  },
  customerCard: {
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
  customerHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  customerAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  customerContact: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  customerStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  customerStatus: {
    fontSize: 12,
    color: "#64748b",
  },
  customerIndustry: {
    fontSize: 12,
    color: "#94a3b8",
    marginLeft: 6,
  },
  customerDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
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

export default CustomersScreen
