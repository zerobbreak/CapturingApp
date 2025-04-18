"use client"

import { useRouter } from "expo-router"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from "react-native"
import { ArrowLeft, Download, Mail, Printer, Save, Share2 } from "lucide-react-native"

// Mock report data
const MOCK_REPORT = {
  id: "1",
  name: "Monthly Worker Activity Report",
  type: "worker",
  dateRange: {
    start: "2023-03-15",
    end: "2023-04-15",
  },
  format: "PDF",
  size: "2.4 MB",
  created: "2023-04-15",
  lastDownloaded: "2023-04-16",
  content: {
    summary: {
      totalWorkers: 24,
      activeWorkers: 22,
      inactiveWorkers: 2,
      totalHours: 3840,
      averageHours: 160,
    },
    topWorkers: [
      { name: "John Smith", hours: 176, projects: 4 },
      { name: "Sarah Johnson", hours: 168, projects: 3 },
      { name: "Michael Brown", hours: 165, projects: 3 },
    ],
    departments: [
      { name: "Operations", workers: 10, hours: 1600 },
      { name: "Maintenance", workers: 8, hours: 1280 },
      { name: "Administration", workers: 6, hours: 960 },
    ],
  },
}

const ReportViewerScreen = () => {
    const router = useRouter();
  const [report, setReport] = useState(MOCK_REPORT)
  const [isLoading, setIsLoading] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleDownload = () => {
    setShowActionsModal(false)
    setShowDownloadModal(true)

    // Simulate download progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 0.1
      setDownloadProgress(Math.min(progress, 1))

      if (progress >= 1) {
        clearInterval(interval)
        setTimeout(() => {
          setShowDownloadModal(false)
          Alert.alert("Download Complete", `Your report has been downloaded.`)
        }, 500)
      }
    }, 200)
  }

  const handleShare = () => {
    setShowActionsModal(false)
    Alert.alert("Share Report", "This would open the share dialog to send the report via email or other methods")
  }

  const handlePrint = () => {
    setShowActionsModal(false)
    Alert.alert("Print Report", "This would open the print dialog to print the report")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft stroke="#1e293b" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{report.name}</Text>
          <TouchableOpacity style={styles.actionsButton} onPress={() => setShowActionsModal(true)}>
            <Share2 stroke="#1e293b" width={24} height={24} />
          </TouchableOpacity>
        </View>
        <Text style={styles.dateRange}>
          {report.dateRange.start} to {report.dateRange.end}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading report...</Text>
        </View>
      ) : (
        <ScrollView style={styles.reportContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{report.content.summary.totalWorkers}</Text>
                <Text style={styles.summaryLabel}>Total Workers</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{report.content.summary.activeWorkers}</Text>
                <Text style={styles.summaryLabel}>Active Workers</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{report.content.summary.inactiveWorkers}</Text>
                <Text style={styles.summaryLabel}>Inactive Workers</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{report.content.summary.totalHours}</Text>
                <Text style={styles.summaryLabel}>Total Hours</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{report.content.summary.averageHours}</Text>
                <Text style={styles.summaryLabel}>Avg Hours/Worker</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Performing Workers</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Name</Text>
                <Text style={styles.tableHeaderCell}>Hours</Text>
                <Text style={styles.tableHeaderCell}>Projects</Text>
              </View>
              {report.content.topWorkers.map((worker, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{worker.name}</Text>
                  <Text style={styles.tableCell}>{worker.hours}</Text>
                  <Text style={styles.tableCell}>{worker.projects}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Department Breakdown</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Department</Text>
                <Text style={styles.tableHeaderCell}>Workers</Text>
                <Text style={styles.tableHeaderCell}>Hours</Text>
              </View>
              {report.content.departments.map((department, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{department.name}</Text>
                  <Text style={styles.tableCell}>{department.workers}</Text>
                  <Text style={styles.tableCell}>{department.hours}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Charts & Visualizations</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>Worker Hours by Department</Text>
              {/* This would be a real chart in a production app */}
              <View style={styles.barChartPlaceholder}>
                <View style={[styles.barChartBar, { height: 120 }]}>
                  <Text style={styles.barChartLabel}>Ops</Text>
                </View>
                <View style={[styles.barChartBar, { height: 80 }]}>
                  <Text style={styles.barChartLabel}>Maint</Text>
                </View>
                <View style={[styles.barChartBar, { height: 60 }]}>
                  <Text style={styles.barChartLabel}>Admin</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report Information</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Report Type:</Text>
                <Text style={styles.infoValue}>Worker Activity</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Generated On:</Text>
                <Text style={styles.infoValue}>{report.created}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Last Downloaded:</Text>
                <Text style={styles.infoValue}>{report.lastDownloaded}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Format:</Text>
                <Text style={styles.infoValue}>{report.format}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Size:</Text>
                <Text style={styles.infoValue}>{report.size}</Text>
              </View>
            </View>
          </View>

          <View style={styles.downloadButtonContainer}>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Download stroke="#ffffff" width={20} height={20} />
              <Text style={styles.downloadButtonText}>Download Report</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Actions Modal */}
      <Modal visible={showActionsModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.actionsModalContainer}>
            <Text style={styles.modalTitle}>Report Actions</Text>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
                <View style={styles.actionButtonIcon}>
                  <Download stroke="#2563eb" width={24} height={24} />
                </View>
                <Text style={styles.actionButtonLabel}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <View style={styles.actionButtonIcon}>
                  <Share2 stroke="#2563eb" width={24} height={24} />
                </View>
                <Text style={styles.actionButtonLabel}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handlePrint}>
                <View style={styles.actionButtonIcon}>
                  <Printer stroke="#2563eb" width={24} height={24} />
                </View>
                <Text style={styles.actionButtonLabel}>Print</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setShowActionsModal(false)
                  Alert.alert("Save Report", "This would save the report to your device")
                }}
              >
                <View style={styles.actionButtonIcon}>
                  <Save stroke="#2563eb" width={24} height={24} />
                </View>
                <Text style={styles.actionButtonLabel}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setShowActionsModal(false)
                  Alert.alert("Email Report", "This would open your email app to send the report")
                }}
              >
                <View style={styles.actionButtonIcon}>
                  <Mail stroke="#2563eb" width={24} height={24} />
                </View>
                <Text style={styles.actionButtonLabel}>Email</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowActionsModal(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Download Progress Modal */}
      <Modal visible={showDownloadModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.downloadModalContainer}>
            <Text style={styles.modalTitle}>Downloading Report</Text>
            <Text style={styles.modalSubtitle}>
              {report.format} • {Math.round(downloadProgress * 100)}%
            </Text>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${downloadProgress * 100}%` }]} />
            </View>

            <Text style={styles.downloadInfoText}>Your report will be saved to your device when complete</Text>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginLeft: 8,
  },
  actionsButton: {
    padding: 4,
  },
  dateRange: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
  reportContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryItem: {
    width: "48%",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
  },
  chartPlaceholder: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  chartPlaceholderText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 16,
  },
  barChartPlaceholder: {
    flexDirection: "row",
    height: 150,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  barChartBar: {
    width: 60,
    backgroundColor: "#2563eb",
    borderRadius: 4,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
  },
  barChartLabel: {
    color: "white",
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 16,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: 140,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: "#1e293b",
  },
  downloadButtonContainer: {
    marginBottom: 24,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 10,
  },
  downloadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  actionsModalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  actionButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonLabel: {
    fontSize: 14,
    color: "#1e293b",
  },
  modalCloseButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: "#64748b",
    fontWeight: "500",
  },
  downloadModalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    marginVertical: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2563eb",
  },
  downloadInfoText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
})

export default ReportViewerScreen
