"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Calendar, ChevronDown, FileText, Mail, Printer, Save, Share2, X } from "lucide-react-native"
import { router } from "expo-router"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"

// Report types with their available fields
const REPORT_TYPES = [
  {
    id: "worker",
    label: "Worker Report",
    description: "Generate reports on worker activity, check-ins, and performance",
    fields: [
      { id: "name", label: "Name", default: true },
      { id: "position", label: "Position", default: true },
      { id: "department", label: "Department", default: true },
      { id: "status", label: "Status", default: true },
      { id: "checkins", label: "Check-ins", default: true },
      { id: "hours", label: "Hours Worked", default: true },
      { id: "projects", label: "Projects", default: false },
      { id: "skills", label: "Skills", default: false },
      { id: "contact", label: "Contact Info", default: false },
      { id: "notes", label: "Notes", default: false },
    ],
  },
  {
    id: "customer",
    label: "Customer Report",
    description: "Generate reports on customer interactions and projects",
    fields: [
      { id: "name", label: "Company Name", default: true },
      { id: "contact", label: "Contact Person", default: true },
      { id: "industry", label: "Industry", default: true },
      { id: "status", label: "Status", default: true },
      { id: "projects", label: "Projects", default: true },
      { id: "interactions", label: "Interactions", default: true },
      { id: "revenue", label: "Revenue", default: false },
      { id: "contact_info", label: "Contact Info", default: false },
      { id: "notes", label: "Notes", default: false },
    ],
  },
  {
    id: "checkin",
    label: "Check-in Report",
    description: "Generate reports on worker check-ins and check-outs",
    fields: [
      { id: "worker", label: "Worker", default: true },
      { id: "type", label: "Type (In/Out)", default: true },
      { id: "time", label: "Time", default: true },
      { id: "date", label: "Date", default: true },
      { id: "location", label: "Location", default: true },
      { id: "duration", label: "Duration", default: true },
      { id: "project", label: "Project", default: false },
      { id: "notes", label: "Notes", default: false },
    ],
  },
  {
    id: "survey",
    label: "Survey Report",
    description: "Generate reports on survey responses and analytics",
    fields: [
      { id: "title", label: "Survey Title", default: true },
      { id: "responses", label: "Total Responses", default: true },
      { id: "questions", label: "Questions", default: true },
      { id: "analytics", label: "Response Analytics", default: true },
      { id: "date_range", label: "Date Range", default: true },
      { id: "respondents", label: "Respondent Info", default: false },
      { id: "comments", label: "Text Responses", default: false },
      { id: "raw_data", label: "Raw Data", default: false },
    ],
  },
]

// Export formats
const EXPORT_FORMATS = [
  { id: "pdf", label: "PDF Document", icon: FileText },
  { id: "excel", label: "Excel Spreadsheet", icon: FileText },
  { id: "csv", label: "CSV File", icon: FileText },
]

const GenerateReportScreen = () => {
  const [selectedReportType, setSelectedReportType] = useState(REPORT_TYPES[0])
  const [reportName, setReportName] = useState("")
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // 30 days ago
  const [endDate, setEndDate] = useState(new Date())
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)
  const [selectedFields, setSelectedFields] = useState(
    selectedReportType.fields.filter((field) => field.default).map((field) => field.id),
  )
  const [includeCharts, setIncludeCharts] = useState(true)
  const [showReportTypeModal, setShowReportTypeModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  interface GeneratedReport {
    id: string
    name: string
    type: string
    dateRange: {
      start: string
      end: string
    }
    fields: string[]
    includeCharts: boolean
    createdAt: string
  }
  
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [selectedFormat, setSelectedFormat] = useState(EXPORT_FORMATS[0])

  // Handle report type change
  const handleReportTypeChange = (reportType: any) => {
    setSelectedReportType(reportType)
    setSelectedFields(reportType.fields.filter((field: any) => field.default).map((field: any) => field.id))
    setShowReportTypeModal(false)
  }

  // Handle field selection
  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId))
    } else {
      setSelectedFields([...selectedFields, fieldId])
    }
  }

  // Handle date changes
  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartDatePicker(false)
    if (selectedDate) {
      setStartDate(selectedDate)
    }
  }

  const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndDatePicker(false)
    if (selectedDate) {
      setEndDate(selectedDate)
    }
  }

  // Generate report
  const handleGenerateReport = () => {
    if (!reportName.trim()) {
      Alert.alert("Error", "Please enter a report name")
      return
    }

    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedReport({
        id: `report-${Date.now()}`,
        name: reportName,
        type: selectedReportType.id,
        dateRange: {
          start: startDate.toISOString().split("T")[0],
          end: endDate.toISOString().split("T")[0],
        },
        fields: selectedFields,
        includeCharts,
        createdAt: new Date().toISOString(),
      })
      setShowExportModal(true)
    }, 2000)
  }

  // Handle export format selection
  const handleExportFormat = (format: any) => {
    setSelectedFormat(format)
    setShowExportModal(false)
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
          Alert.alert("Download Complete", `Your report "${reportName}" has been downloaded as a ${format.label}.`, [
            {
              text: "View Report",
              onPress: () => {
                // In a real app, this would open the report
                Alert.alert("Opening Report", "This would open the report file in a viewer")
              },
            },
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ])
        }, 500)
      }
    }, 200)
  }

  // Handle share report
  const handleShareReport = () => {
    Alert.alert("Share Report", "This would open the share dialog to send the report via email or other methods")
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Generate Report</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Report Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter report name"
            value={reportName}
            onChangeText={setReportName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Report Type</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => setShowReportTypeModal(true)}>
            <Text style={styles.selectButtonText}>{selectedReportType.label}</Text>
            <ChevronDown stroke="#64748b" width={20} height={20} />
          </TouchableOpacity>
          <Text style={styles.helperText}>{selectedReportType.description}</Text>
        </View>

        <View style={styles.dateRangeContainer}>
          <Text style={styles.label}>Date Range</Text>
          <View style={styles.dateInputsContainer}>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
              <Calendar stroke="#64748b" width={20} height={20} />
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateRangeSeparator}>to</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}>
              <Calendar stroke="#64748b" width={20} height={20} />
              <Text style={styles.dateText}>
                {endDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </TouchableOpacity>
          </View>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, date) => handleStartDateChange(event, date)}
              maximumDate={endDate}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              minimumDate={startDate}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.fieldsContainer}>
          <Text style={styles.label}>Include Fields</Text>
          <View style={styles.fieldsList}>
            {selectedReportType.fields.map((field) => (
              <View key={field.id} style={styles.fieldItem}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <Switch
                  value={selectedFields.includes(field.id)}
                  onValueChange={() => toggleField(field.id)}
                  trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
                  thumbColor={selectedFields.includes(field.id) ? "#2563eb" : "#f1f5f9"}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.optionItem}>
            <Text style={styles.optionLabel}>Include Charts & Graphs</Text>
            <Switch
              value={includeCharts}
              onValueChange={setIncludeCharts}
              trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
              thumbColor={includeCharts ? "#2563eb" : "#f1f5f9"}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <FileText stroke="#ffffff" width={20} height={20} />
                <Text style={styles.generateButtonText}>Generate Report</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <X stroke="#64748b" width={20} height={20} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Report Type Modal */}
      <Modal visible={showReportTypeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Report Type</Text>
            <ScrollView style={styles.modalScrollView}>
              {REPORT_TYPES.map((reportType) => (
                <TouchableOpacity
                  key={reportType.id}
                  style={[
                    styles.reportTypeItem,
                    selectedReportType.id === reportType.id && styles.reportTypeItemSelected,
                  ]}
                  onPress={() => handleReportTypeChange(reportType)}
                >
                  <Text
                    style={[
                      styles.reportTypeLabel,
                      selectedReportType.id === reportType.id && styles.reportTypeLabelSelected,
                    ]}
                  >
                    {reportType.label}
                  </Text>
                  <Text
                    style={[
                      styles.reportTypeDescription,
                      selectedReportType.id === reportType.id && styles.reportTypeDescriptionSelected,
                    ]}
                  >
                    {reportType.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowReportTypeModal(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Export Format Modal */}
      <Modal visible={showExportModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Export Report</Text>
            <Text style={styles.modalSubtitle}>Choose a format to export your report</Text>

            <View style={styles.exportOptionsContainer}>
              {EXPORT_FORMATS.map((format) => (
                <TouchableOpacity
                  key={format.id}
                  style={styles.exportOption}
                  onPress={() => handleExportFormat(format)}
                >
                  <format.icon stroke="#2563eb" width={24} height={24} />
                  <Text style={styles.exportOptionLabel}>{format.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.exportActionsContainer}>
              <TouchableOpacity style={styles.exportActionButton} onPress={handleShareReport}>
                <Mail stroke="#64748b" width={20} height={20} />
                <Text style={styles.exportActionText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportActionButton}>
                <Printer stroke="#64748b" width={20} height={20} />
                <Text style={styles.exportActionText}>Print</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportActionButton}>
                <Save stroke="#64748b" width={20} height={20} />
                <Text style={styles.exportActionText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportActionButton}>
                <Share2 stroke="#64748b" width={20} height={20} />
                <Text style={styles.exportActionText}>Share</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowExportModal(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Download Progress Modal */}
      <Modal visible={showDownloadModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Downloading Report</Text>
            <Text style={styles.modalSubtitle}>
              {selectedFormat?.label} • {Math.round(downloadProgress * 100)}%
            </Text>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${downloadProgress * 100}%` }]} />
            </View>

            <Text style={styles.downloadInfoText}>Your report will be saved to your device when complete</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  formContainer: {
    padding: 16,
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
  required: {
    color: "#ef4444",
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  selectButton: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectButtonText: {
    fontSize: 16,
    color: "#1e293b",
  },
  helperText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  dateRangeContainer: {
    marginBottom: 16,
  },
  dateInputsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#1e293b",
  },
  dateRangeSeparator: {
    marginHorizontal: 8,
    color: "#64748b",
  },
  fieldsContainer: {
    marginBottom: 16,
  },
  fieldsList: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 4,
  },
  fieldItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  fieldLabel: {
    fontSize: 16,
    color: "#1e293b",
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
  },
  optionLabel: {
    fontSize: 16,
    color: "#1e293b",
  },
  buttonContainer: {
    marginTop: 8,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  generateButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    paddingVertical: 16,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: "#64748b",
    fontWeight: "500",
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
  modalContainer: {
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
    marginBottom: 4,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
    textAlign: "center",
  },
  modalScrollView: {
    maxHeight: 300,
    marginBottom: 16,
  },
  reportTypeItem: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  reportTypeItemSelected: {
    backgroundColor: "#2563eb",
  },
  reportTypeLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  reportTypeLabelSelected: {
    color: "white",
  },
  reportTypeDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  reportTypeDescriptionSelected: {
    color: "#e0e7ff",
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
  exportOptionsContainer: {
    marginBottom: 16,
  },
  exportOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  exportOptionLabel: {
    fontSize: 16,
    color: "#1e293b",
    marginLeft: 12,
  },
  exportActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  exportActionButton: {
    alignItems: "center",
    padding: 8,
  },
  exportActionText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
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
    marginBottom: 16,
  },
})

export default GenerateReportScreen
