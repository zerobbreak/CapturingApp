"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { Phone, Mail, MapPin, Calendar, Clock, Edit, Trash2, User, Building, Briefcase } from "lucide-react-native"
import { useRouter } from "expo-router";
// Mock customer data
const CUSTOMER_DATA = {
  id: "1",
  name: "Acme Corporation",
  contact: "John Doe",
  email: "john.doe@acme.com",
  phone: "(555) 123-4567",
  address: "123 Business Ave, Enterprise City, USA",
  industry: "Construction",
  status: "Active",
  joinDate: "2022-03-15",
  website: "www.acmecorp.com",
  notes: "Key client for commercial projects. Prefers communication via email.",
  interactions: [
    {
      id: "1",
      type: "Meeting",
      description: "Project kickoff meeting",
      date: "2023-04-10",
      time: "10:30 AM",
      staff: "Sarah Johnson",
    },
    {
      id: "2",
      type: "Call",
      description: "Follow-up on project timeline",
      date: "2023-04-15",
      time: "02:15 PM",
      staff: "Michael Brown",
    },
    {
      id: "3",
      type: "Email",
      description: "Sent proposal for new project",
      date: "2023-04-18",
      time: "09:45 AM",
      staff: "David Wilson",
    },
    {
      id: "4",
      type: "Site Visit",
      description: "Inspection of current project",
      date: "2023-04-20",
      time: "01:00 PM",
      staff: "Emily Davis",
    },
  ],
  projects: [
    { id: "1", name: "Office Renovation", status: "In Progress", value: "$125,000" },
    { id: "2", name: "Warehouse Construction", status: "Completed", value: "$450,000" },
    { id: "3", name: "Security System Upgrade", status: "Planning", value: "$75,000" },
  ],
}

const CustomerDetailScreen = () => {
    const router = useRouter();
  const [customer, setCustomer] = useState(CUSTOMER_DATA)

  const handleEdit = () => {
    // Navigate to edit screen
    Alert.alert("Edit Customer", "This would navigate to the edit customer screen")
  }

  const handleDelete = () => {
    Alert.alert("Delete Customer", "Are you sure you want to delete this customer? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          // Delete customer and navigate back
          Alert.alert("Customer Deleted", "Customer has been deleted successfully")
          router.back();
        },
        style: "destructive",
      },
    ])
  }

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

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "#2563eb"
      case "Completed":
        return "#10b981"
      case "Planning":
        return "#f59e0b"
      default:
        return "#94a3b8"
    }
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "Meeting":
        return <Briefcase stroke="#2563eb" width={24} height={24} />
      case "Call":
        return <Phone stroke="#10b981" width={24} height={24} />
      case "Email":
        return <Mail stroke="#f59e0b" width={24} height={24} />
      case "Site Visit":
        return <MapPin stroke="#8b5cf6" width={24} height={24} />
      default:
        return <Clock stroke="#64748b" width={24} height={24} />
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Building stroke="#64748b" width={40} height={40} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.position}>{customer.industry}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(customer.status) }]} />
            <Text style={styles.status}>{customer.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEdit}>
          <Edit stroke="#ffffff" width={20} height={20} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
          <Trash2 stroke="#ffffff" width={20} height={20} />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.card}>
          <View style={styles.infoItem}>
            <User stroke="#64748b" width={20} height={20} />
            <Text style={styles.infoText}>Contact: {customer.contact}</Text>
          </View>
          <View style={styles.infoItem}>
            <Phone stroke="#64748b" width={20} height={20} />
            <Text style={styles.infoText}>{customer.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Mail stroke="#64748b" width={20} height={20} />
            <Text style={styles.infoText}>{customer.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <MapPin stroke="#64748b" width={20} height={20} />
            <Text style={styles.infoText}>{customer.address}</Text>
          </View>
          <View style={styles.infoItem}>
            <Building stroke="#64748b" width={20} height={20} />
            <Text style={styles.infoText}>Website: {customer.website}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Industry</Text>
              <Text style={styles.infoValue}>{customer.industry}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Client Since</Text>
              <Text style={styles.infoValue}>{customer.joinDate}</Text>
            </View>
          </View>

          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>{customer.notes}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        <View style={styles.card}>
          {customer.projects.map((project, index) => (
            <View
              key={project.id}
              style={[styles.projectItem, index < customer.projects.length - 1 && styles.projectItemBorder]}
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectName}>{project.name}</Text>
                <View style={[styles.projectStatusBadge, { backgroundColor: getProjectStatusColor(project.status) }]}>
                  <Text style={styles.projectStatusText}>{project.status}</Text>
                </View>
              </View>
              <Text style={styles.projectValue}>Value: {project.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Interactions</Text>
        <View style={styles.card}>
          {customer.interactions.map((interaction, index) => (
            <View
              key={interaction.id}
              style={[styles.interactionItem, index < customer.interactions.length - 1 && styles.interactionItemBorder]}
            >
              <View style={styles.interactionIconContainer}>{getInteractionIcon(interaction.type)}</View>
              <View style={styles.interactionInfo}>
                <View style={styles.interactionHeader}>
                  <Text style={styles.interactionType}>{interaction.type}</Text>
                  <Text style={styles.interactionStaff}>By: {interaction.staff}</Text>
                </View>
                <Text style={styles.interactionDescription}>{interaction.description}</Text>
                <View style={styles.interactionDetails}>
                  <View style={styles.interactionDetail}>
                    <Calendar stroke="#64748b" width={16} height={16} />
                    <Text style={styles.interactionDetailText}>{interaction.date}</Text>
                  </View>
                  <View style={styles.interactionDetail}>
                    <Clock stroke="#64748b" width={16} height={16} />
                    <Text style={styles.interactionDetailText}>{interaction.time}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addInteractionButton}>
            <Text style={styles.addInteractionText}>+ Add New Interaction</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 14,
    color: "#64748b",
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: "#2563eb",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#1e293b",
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 22,
  },
  projectItem: {
    paddingVertical: 12,
  },
  projectItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  projectStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  projectStatusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  projectValue: {
    fontSize: 14,
    color: "#64748b",
  },
  interactionItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  interactionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  interactionIconContainer: {
    marginRight: 12,
  },
  interactionInfo: {
    flex: 1,
  },
  interactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  interactionType: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  interactionStaff: {
    fontSize: 14,
    color: "#64748b",
  },
  interactionDescription: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 8,
  },
  interactionDetails: {
    flexDirection: "row",
  },
  interactionDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  interactionDetailText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 4,
  },
  addInteractionButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    alignItems: "center",
  },
  addInteractionText: {
    color: "#2563eb",
    fontWeight: "500",
  },
})

export default CustomerDetailScreen
