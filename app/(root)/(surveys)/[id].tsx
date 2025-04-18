"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, Modal, Share } from "react-native"
import { Calendar, Clock, Download, Eye, Filter, QrCode, Share2, User } from "lucide-react-native"

// Mock survey data
const SURVEY_DATA = {
  id: "1",
  title: "Customer Satisfaction Survey",
  description: "Please provide feedback on your recent experience with our services.",
  status: "Active",
  created: "2023-04-10",
  expires: "2023-05-10",
  totalResponses: 24,
  questions: [
    {
      id: "q1",
      type: "multiple_choice",
      question: "How would you rate our service?",
      options: ["Excellent", "Good", "Average", "Poor", "Very Poor"],
      responses: [10, 8, 4, 2, 0],
    },
    {
      id: "q2",
      type: "rating",
      question: "How likely are you to recommend our services to others?",
      scale: 10,
      responses: [0, 0, 1, 1, 2, 3, 4, 5, 5, 3],
      average: 7.4,
    },
    {
      id: "q3",
      type: "text",
      question: "What improvements would you suggest for our services?",
      responses: [
        "Better communication during projects",
        "More flexible scheduling options",
        "Faster response times to inquiries",
        "More detailed project updates",
      ],
    },
  ],
  recentResponses: [
    {
      id: "r1",
      respondent: "Anonymous",
      date: "2023-04-18",
      time: "10:30 AM",
      answers: [
        { questionId: "q1", answer: "Excellent" },
        { questionId: "q2", answer: 9 },
        { questionId: "q3", answer: "More detailed project updates" },
      ],
    },
    {
      id: "r2",
      respondent: "Anonymous",
      date: "2023-04-17",
      time: "02:15 PM",
      answers: [
        { questionId: "q1", answer: "Good" },
        { questionId: "q2", answer: 8 },
        { questionId: "q3", answer: "Faster response times to inquiries" },
      ],
    },
    {
      id: "r3",
      respondent: "Anonymous",
      date: "2023-04-16",
      time: "11:45 AM",
      answers: [
        { questionId: "q1", answer: "Average" },
        { questionId: "q2", answer: 6 },
        { questionId: "q3", answer: "Better communication during projects" },
      ],
    },
  ],
  shareableLink: "https://survey.workforceapp.com/s/abc123",
}

const SurveyDetailScreen = () => {
  const [survey, setSurvey] = useState(SURVEY_DATA)
  const [activeTab, setActiveTab] = useState("summary")
  const [showQRModal, setShowQRModal] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Please complete our survey: ${survey.title}\n${survey.shareableLink}`,
      })
    } catch (error) {
      Alert.alert("Error", "Could not share the survey")
    }
  }

  interface Response {
    id: string;
    respondent: string;
    date: string;
    time: string;
    answers: {
      questionId: string;
      answer: string | number;
    }[];
  }

  const handleViewResponse = (response: Response): void => {
    setSelectedResponse(response)
    setShowResponseModal(true)
  }

  interface MultipleChoiceQuestion {
    options: string[];
    responses: number[];
  }

  interface RenderMultipleChoiceResultsProps {
    question: MultipleChoiceQuestion;
  }

  const renderMultipleChoiceResults = (question: RenderMultipleChoiceResultsProps["question"]) => {
    const maxResponse = Math.max(...question.responses)
    return (
      <View style={styles.questionResults}>
        {question.options.map((option, index) => (
          <View key={index} style={styles.resultItem}>
            <Text style={styles.resultLabel}>{option}</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(question.responses[index] / survey.totalResponses) * 100}%`,
                    backgroundColor: getBarColor({ index }),
                  },
                ]}
              />
              <Text style={styles.resultCount}>{question.responses[index]}</Text>
            </View>
          </View>
        ))}
      </View>
    )
  }

  interface RatingQuestion {
    average: number;
    responses: number[];
    scale: number;
  }

  interface RenderRatingResultsProps {
    question: RatingQuestion;
  }

  const renderRatingResults = (question: RenderRatingResultsProps["question"]) => {
    return (
      <View style={styles.questionResults}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingAverage}>{question.average.toFixed(1)}</Text>
          <Text style={styles.ratingLabel}>Average Rating</Text>
        </View>
        <View style={styles.ratingBars}>
          {question.responses.map((count, index) => (
            <View key={index} style={styles.ratingBarItem}>
              <Text style={styles.ratingBarLabel}>{index + 1}</Text>
              <View style={styles.ratingBarContainer}>
                <View
                  style={[
                    styles.ratingBar,
                    {
                      height: `${(count / Math.max(...question.responses)) * 100}%`,
                      backgroundColor: getRatingColor({ index, scale: question.scale }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.ratingBarCount}>{count}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  interface TextQuestion {
    responses: string[];
  }

  interface RenderTextResultsProps {
    question: TextQuestion;
  }

  const renderTextResults = (question: RenderTextResultsProps["question"]) => {
    return (
      <View style={styles.questionResults}>
        <FlatList
          data={question.responses}
          keyExtractor={(item, index) => `text-${index}`}
          renderItem={({ item }: { item: string }) => (
            <View style={styles.textResponse}>
              <Text style={styles.textResponseContent}>"{item}"</Text>
            </View>
          )}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No text responses have been submitted yet.</Text>}
        />
      </View>
    )
  }

  interface GetBarColorParams {
    index: number;
  }

  const getBarColor = ({ index }: GetBarColorParams): string => {
    const colors: string[] = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];
    return colors[index % colors.length];
  };

  interface GetRatingColorParams {
    index: number;
    scale: number;
  }

  const getRatingColor = ({ index, scale }: GetRatingColorParams): string => {
    // Create a gradient from red to green
    const percent = index / (scale - 1);
    if (percent < 0.5) {
      // Red to yellow
      const g = Math.floor(255 * (percent * 2));
      return `rgb(255, ${g}, 0)`;
    } else {
      // Yellow to green
      const r = Math.floor(255 * (1 - (percent - 0.5) * 2));
      return `rgb(${r}, 255, 0)`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{survey.title}</Text>
          <Text style={styles.description}>{survey.description}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: survey.status === "Active" ? "#10b981" : "#94a3b8" }]}>
          <Text style={styles.statusText}>{survey.status}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{survey.totalResponses}</Text>
          <Text style={styles.statLabel}>Responses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{survey.created}</Text>
          <Text style={styles.statLabel}>Created</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{survey.expires}</Text>
          <Text style={styles.statLabel}>Expires</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowQRModal(true)}>
          <QrCode stroke="#ffffff" width={20} height={20} />
          <Text style={styles.actionButtonText}>QR Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 stroke="#ffffff" width={20} height={20} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Download stroke="#ffffff" width={20} height={20} />
          <Text style={styles.actionButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "summary" && styles.activeTabButton]}
          onPress={() => setActiveTab("summary")}
        >
          <Text style={[styles.tabButtonText, activeTab === "summary" && styles.activeTabButtonText]}>Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "responses" && styles.activeTabButton]}
          onPress={() => setActiveTab("responses")}
        >
          <Text style={[styles.tabButtonText, activeTab === "responses" && styles.activeTabButtonText]}>Responses</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "summary" ? (
        <View style={styles.summaryContainer}>
          {survey.questions.map((question) => (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question.question}</Text>
              {question.type === "multiple_choice" && renderMultipleChoiceResults(question)}
              {question.type === "rating" && renderRatingResults(question)}
              {question.type === "text" && renderTextResults(question)}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.responsesContainer}>
          <View style={styles.responsesHeader}>
            <Text style={styles.responsesTitle}>Individual Responses</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter stroke="#64748b" width={20} height={20} />
            </TouchableOpacity>
          </View>

          {survey.recentResponses.map((response) => (
            <TouchableOpacity
              key={response.id}
              style={styles.responseCard}
              onPress={() => handleViewResponse(response)}
            >
              <View style={styles.responseHeader}>
                <View style={styles.respondentInfo}>
                  <User stroke="#64748b" width={20} height={20} />
                  <Text style={styles.respondentName}>{response.respondent}</Text>
                </View>
                <TouchableOpacity style={styles.viewButton} onPress={() => handleViewResponse(response)}>
                  <Eye stroke="#2563eb" width={16} height={16} />
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.responseDetails}>
                <View style={styles.responseDetail}>
                  <Calendar stroke="#64748b" width={16} height={16} />
                  <Text style={styles.responseDetailText}>{response.date}</Text>
                </View>
                <View style={styles.responseDetail}>
                  <Clock stroke="#64748b" width={16} height={16} />
                  <Text style={styles.responseDetailText}>{response.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* QR Code Modal */}
      <Modal visible={showQRModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Survey QR Code</Text>
            <Text style={styles.modalSubtitle}>Scan this QR code to access the survey</Text>

            <View style={styles.qrCodeContainer}>
              {/* This would be a real QR code component in a production app */}
              <View style={styles.qrCodePlaceholder}>
                <QrCode stroke="#1e293b" width={40} height={40} />
                <Text style={styles.qrCodeText}>QR Code</Text>
              </View>
            </View>

            <Text style={styles.linkText}>{survey.shareableLink}</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleShare}>
                <Share2 stroke="#ffffff" width={20} height={20} />
                <Text style={styles.modalButtonText}>Share Link</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowQRModal(false)}>
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Response Detail Modal */}
      <Modal visible={showResponseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Response Details</Text>
            <Text style={styles.modalSubtitle}>
              {selectedResponse?.date} at {selectedResponse?.time}
            </Text>

            <ScrollView style={styles.responseDetailContainer}>
              {selectedResponse?.answers.map((answer, index) => {
                const question = survey.questions.find((q) => q.id === answer.questionId)
                return (
                  <View key={index} style={styles.responseDetailItem}>
                    <Text style={styles.responseDetailQuestion}>{question?.question}</Text>
                    <Text style={styles.responseDetailAnswer}>
                      {typeof answer.answer === "number" ? `Rating: ${answer.answer}/10` : answer.answer}
                    </Text>
                  </View>
                )
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowResponseModal(false)
                setSelectedResponse(null)
              }}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#2563eb",
  },
  tabButtonText: {
    fontWeight: "500",
    color: "#64748b",
  },
  activeTabButtonText: {
    color: "white",
  },
  summaryContainer: {
    padding: 16,
  },
  questionContainer: {
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
  questionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 16,
  },
  questionResults: {
    marginTop: 8,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
  },
  bar: {
    height: "100%",
    borderRadius: 4,
    minWidth: 4,
  },
  resultCount: {
    marginLeft: 8,
    fontSize: 14,
    color: "#64748b",
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  ratingAverage: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2563eb",
  },
  ratingLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  ratingBars: {
    flexDirection: "row",
    height: 150,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 8,
  },
  ratingBarItem: {
    flex: 1,
    alignItems: "center",
  },
  ratingBarLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  ratingBarContainer: {
    width: "60%",
    height: "80%",
    justifyContent: "flex-end",
  },
  ratingBar: {
    width: "100%",
    borderRadius: 4,
  },
  ratingBarCount: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  textResponse: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  textResponseContent: {
    fontSize: 14,
    color: "#334155",
    fontStyle: "italic",
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 16,
  },
  responsesContainer: {
    padding: 16,
  },
  responsesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  responsesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  filterButton: {
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  responseCard: {
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
  responseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  respondentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  respondentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginLeft: 8,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 12,
    color: "#2563eb",
    marginLeft: 4,
  },
  responseDetails: {
    flexDirection: "row",
  },
  responseDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  responseDetailText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 4,
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
  qrCodeContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  qrCodeText: {
    marginTop: 8,
    fontSize: 16,
    color: "#1e293b",
  },
  linkText: {
    fontSize: 14,
    color: "#2563eb",
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  modalButtons: {
    flexDirection: "row",
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
  },
  modalCloseButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalCloseButtonText: {
    color: "#64748b",
    fontWeight: "500",
  },
  responseDetailContainer: {
    maxHeight: 300,
    marginVertical: 16,
  },
  responseDetailItem: {
    marginBottom: 16,
  },
  responseDetailQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  responseDetailAnswer: {
    fontSize: 14,
    color: "#334155",
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
  },
})

export default SurveyDetailScreen
