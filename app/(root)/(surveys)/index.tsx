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
import { FileText, Plus, BarChart2, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";

type Survey = {
  id: string;
  title: string;
  status: string;
  responses: number;
  created: string;
  expires: string | null;
};
// Mock data for surveys
const MOCK_SURVEYS: Survey[] = [
  {
    id: "1",
    title: "Customer Satisfaction Survey",
    status: "Active",
    responses: 24,
    created: "2023-04-10",
    expires: "2023-05-10",
  },
  {
    id: "2",
    title: "Worker Safety Feedback",
    status: "Active",
    responses: 18,
    created: "2023-04-05",
    expires: "2023-05-05",
  },
  {
    id: "3",
    title: "Project Completion Feedback",
    status: "Completed",
    responses: 32,
    created: "2023-03-15",
    expires: "2023-04-15",
  },
  {
    id: "4",
    title: "Site Conditions Assessment",
    status: "Draft",
    responses: 0,
    created: "2023-04-15",
    expires: null,
  },
  {
    id: "5",
    title: "Equipment Maintenance Checklist",
    status: "Active",
    responses: 12,
    created: "2023-04-01",
    expires: "2023-05-01",
  },
  {
    id: "6",
    title: "Training Effectiveness Survey",
    status: "Completed",
    responses: 28,
    created: "2023-03-01",
    expires: "2023-04-01",
  },
];

const SurveysScreen = () => {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>(MOCK_SURVEYS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#10b981";
      case "Completed":
        return "#6366f1";
      case "Draft":
        return "#f59e0b";
      default:
        return "#94a3b8";
    }
  };

  const renderSurveyItem = ({ item }: { item: Survey }) => (
    <TouchableOpacity
      style={styles.surveyCard}
      onPress={() =>
        router.push({
          pathname: "/(root)/(surveys)/[id]",
          params: { id: item.id, title: item.title },
        })
      }
    >
      <View style={styles.surveyHeader}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <FileText stroke="#64748b" width={24} height={24} />
      </View>

      <Text style={styles.surveyTitle}>{item.title}</Text>

      <View style={styles.surveyStats}>
        <View style={styles.statItem}>
          <BarChart2 stroke="#64748b" width={16} height={16} />
          <Text style={styles.statText}>{item.responses} responses</Text>
        </View>
        <View style={styles.statItem}>
          <Clock stroke="#64748b" width={16} height={16} />
          <Text style={styles.statText}>
            {item.expires ? `Expires: ${item.expires}` : "No expiration"}
          </Text>
        </View>
      </View>

      <View style={styles.surveyFooter}>
        <Text style={styles.createdText}>Created: {item.created}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Surveys</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/(root)/(surveys)/new")}
        >
          <Plus stroke="#ffffff" width={20} height={20} />
          <Text style={styles.createButtonText}>Create Survey</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={surveys}
        renderItem={renderSurveyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.surveysList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No surveys found</Text>
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
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 4,
  },
  surveysList: {
    paddingBottom: 16,
  },
  surveyCard: {
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
  surveyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  surveyStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 4,
  },
  surveyFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  createdText: {
    fontSize: 12,
    color: "#94a3b8",
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

export default SurveysScreen;
