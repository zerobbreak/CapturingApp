"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  FileText,
  Download,
  Plus,
  Calendar,
  Clock,
  User,
  Users,
  Briefcase,
  Shield,
} from "lucide-react-native";
import { useRouter } from "expo-router";

type Report = {
  id: string;
  title: string;
  type: string;
  format: string;
  generated: string;
  size: string;
};
// Mock data for reports
const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    title: "Monthly Worker Activity Report",
    type: "Worker",
    format: "PDF",
    generated: "2023-04-15",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Customer Interaction Summary",
    type: "Customer",
    format: "Excel",
    generated: "2023-04-10",
    size: "1.8 MB",
  },
  {
    id: "3",
    title: "Survey Results Analysis",
    type: "Survey",
    format: "PDF",
    generated: "2023-04-05",
    size: "3.2 MB",
  },
  {
    id: "4",
    title: "Weekly Check-in/Check-out Report",
    type: "Check-in",
    format: "PDF",
    generated: "2023-04-01",
    size: "1.5 MB",
  },
  {
    id: "5",
    title: "Project Completion Statistics",
    type: "Project",
    format: "Excel",
    generated: "2023-03-25",
    size: "2.1 MB",
  },
  {
    id: "6",
    title: "Safety Compliance Audit",
    type: "Safety",
    format: "PDF",
    generated: "2023-03-20",
    size: "4.3 MB",
  },
];

const ReportsScreen = () => {
  const router = useRouter();
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Worker":
        return <User stroke="#2563eb" width={20} height={20} />;
      case "Customer":
        return <Users stroke="#10b981" width={20} height={20} />;
      case "Survey":
        return <FileText stroke="#f59e0b" width={20} height={20} />;
      case "Check-in":
        return <Clock stroke="#6366f1" width={20} height={20} />;
      case "Project":
        return <Briefcase stroke="#ef4444" width={20} height={20} />;
      case "Safety":
        return <Shield stroke="#8b5cf6" width={20} height={20} />;
      default:
        return <FileText stroke="#64748b" width={20} height={20} />;
    }
  };

  const renderReportItem = ({ item }: { item: Report }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => {
        router.push("/(root)/(reports)/[id]");
      }}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportTypeContainer}>
          {getTypeIcon(item.type)}
          <Text style={styles.reportType}>{item.type}</Text>
        </View>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => {
            // In a real app, this would download the report
            alert(`Downloading ${item.title}`);
          }}
        >
          <Download stroke="#2563eb" width={20} height={20} />
        </TouchableOpacity>
      </View>

      <Text style={styles.reportTitle}>{item.title}</Text>

      <View style={styles.reportDetails}>
        <View style={styles.detailItem}>
          <Calendar stroke="#64748b" width={16} height={16} />
          <Text style={styles.detailText}>Generated: {item.generated}</Text>
        </View>
        <View style={styles.detailItem}>
          <FileText stroke="#64748b" width={16} height={16} />
          <Text style={styles.detailText}>
            {item.format} • {item.size}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => router.push("/(root)/(reports)/new")}
        >
          <Plus stroke="#ffffff" width={20} height={20} />
          <Text style={styles.generateButtonText}>Generate Report</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.reportsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reports found</Text>
          </View>
        }
      />
    </View>
  );
};

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
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  generateButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 4,
  },
  reportsList: {
    paddingBottom: 16,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reportTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportType: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  downloadButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  reportDetails: {
    flexDirection: "row",
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
  },
});

export default ReportsScreen;
