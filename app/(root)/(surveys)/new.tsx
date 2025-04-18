"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Modal,
  Share,
} from "react-native"
import { Calendar, ChevronDown, ChevronUp, Copy, Plus, QrCode, Save, Share2, Trash2, X } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useRouter } from "expo-router"

const QUESTION_TYPES = [
  { id: "multiple_choice", label: "Multiple Choice" },
  { id: "rating", label: "Rating Scale" },
  { id: "text", label: "Text Input" },
  { id: "checkbox", label: "Checkboxes" },
]

const CreateSurveyScreen = () => {
    const router = useRouter();
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      type: "multiple_choice",
      question: "",
      options: ["", ""],
      required: true,
      scale: undefined, // Explicitly include optional property
    },
  ])
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // 30 days from now
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [showQRModal, setShowQRModal] = useState(false)
  const [surveyLink, setSurveyLink] = useState("")

  const addQuestion = () => {
    const newQuestion = {
      id: `q${questions.length + 1}`,
      type: "multiple_choice",
      question: "",
      options: ["", ""],
      required: true,
    }
    setQuestions([...questions, newQuestion as Question])
  }

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      Alert.alert("Error", "You must have at least one question")
      return
    }
    const newQuestions = [...questions]
    newQuestions.splice(index, 1)
    setQuestions(newQuestions)
  }

interface Question {
    id: string;
    type: "multiple_choice" | "rating" | "text" | "checkbox";
    question: string;
    options?: string[];
    scale?: number;
    required: boolean;
}

const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    (newQuestions[index] as Record<string, any>)[field] = value;
    setQuestions(newQuestions);
};

interface UpdateQuestionTypeParams {
    index: number;
    type: "multiple_choice" | "rating" | "text" | "checkbox";
}

const updateQuestionType = ({ index, type }: UpdateQuestionTypeParams): void => {
    const newQuestions = [...questions];
    const question: Question = { ...newQuestions[index], type };

    // Initialize type-specific properties
    if (type === "multiple_choice" || type === "checkbox") {
        question.options = question.options || ["", ""];
    } else if (type === "rating") {
        question.scale = question.scale || 5;
    }

    newQuestions[index] = question;
    setQuestions(newQuestions);
};

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions]
    if (newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options.push("")
    }
    setQuestions(newQuestions)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions]
    if ((newQuestions[questionIndex].options ?? []).length <= 2) {
      Alert.alert("Error", "You must have at least two options")
      return
    }
    if (newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options.splice(optionIndex, 1)
    }
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    if (newQuestions[questionIndex].options) {
        newQuestions[questionIndex].options[optionIndex] = value;
    }
    setQuestions(newQuestions)
  }

  const moveQuestion = (index: number, direction: string) => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === questions.length - 1)) {
      return
    }

    const newQuestions = [...questions]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const temp = newQuestions[index]
    newQuestions[index] = newQuestions[targetIndex]
    newQuestions[targetIndex] = temp
    setQuestions(newQuestions)
  }

interface DateChangeEvent {
    type: string;
    nativeEvent: object;
}

const handleDateChange = (event: DateChangeEvent, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
        setExpiryDate(selectedDate)
    }
}

  const validateSurvey = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a survey title")
      return false
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.question.trim()) {
        Alert.alert("Error", `Question ${i + 1} is empty`)
        return false
      }

      if (q.type === "multiple_choice" || q.type === "checkbox") {
        for (let j = 0; j < (q.options ?? []).length; j++) {
          if (!(q.options?.[j]?.trim())) {
            Alert.alert("Error", `Option ${j + 1} in Question ${i + 1} is empty`)
            return false
          }
        }
      }
    }

    return true
  }

  const handleSave = () => {
    if (!validateSurvey()) {
      return
    }

    // Generate a mock survey link
    const mockLink = `https://survey.workforceapp.com/s/${Math.random().toString(36).substring(2, 8)}`
    setSurveyLink(mockLink)

    Alert.alert("Survey Created", "Your survey has been created successfully. Would you like to share it now?", [
      {
        text: "No",
        style: "cancel",
        onPress: () => router.back(),
      },
      {
        text: "Yes",
        onPress: () => setShowQRModal(true),
      },
    ])
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Please complete our survey: ${title}\n${surveyLink}`,
      })
    } catch (error) {
      Alert.alert("Error", "Could not share the survey")
    }
  }

interface RenderQuestionOptionsProps {
    question: Question;
    index: number;
}

const renderQuestionOptions = ({ question, index }: RenderQuestionOptionsProps): JSX.Element | null => {
    switch (question.type) {
        case "multiple_choice":
        case "checkbox":
            return (
                <View style={styles.optionsContainer}>
                    <Text style={styles.optionsLabel}>Options:</Text>
                    {question.options?.map((option, optionIndex) => (
                        <View key={optionIndex} style={styles.optionItem}>
                            <TextInput
                                style={styles.optionInput}
                                placeholder={`Option ${optionIndex + 1}`}
                                value={option}
                                onChangeText={(text) => updateOption(index, optionIndex, text)}
                            />
                            <TouchableOpacity style={styles.removeOptionButton} onPress={() => removeOption(index, optionIndex)}>
                                <X stroke="#ef4444" width={16} height={16} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addOptionButton} onPress={() => addOption(index)}>
                        <Plus stroke="#2563eb" width={16} height={16} />
                        <Text style={styles.addOptionText}>Add Option</Text>
                    </TouchableOpacity>
                </View>
            );
        case "rating":
            return (
                <View style={styles.ratingContainer}>
                    <Text style={styles.optionsLabel}>Scale:</Text>
                    <View style={styles.ratingScaleContainer}>
                        <TouchableOpacity
                            style={styles.ratingScaleButton}
                            onPress={() => {
                                const newScale = Math.max(3, (question.scale || 5) - 1);
                                updateQuestion(index, "scale", newScale);
                            }}
                        >
                            <Text style={styles.ratingScaleButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.ratingScaleText}>{question.scale || 5}</Text>
                        <TouchableOpacity
                            style={styles.ratingScaleButton}
                            onPress={() => {
                                const newScale = Math.min(10, (question.scale || 5) + 1);
                                updateQuestion(index, "scale", newScale);
                            }}
                        >
                            <Text style={styles.ratingScaleButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        case "text":
            return (
                <View style={styles.textInputPreview}>
                    <Text style={styles.textInputPreviewLabel}>Text Input Field</Text>
                </View>
            );
        default:
            return null;
    }
};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Survey</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Survey Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput style={styles.input} placeholder="Enter survey title" value={title} onChangeText={setTitle} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter survey description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Expiry Date</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Calendar stroke="#64748b" width={20} height={20} />
            <Text style={styles.dateText}>
              {expiryDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Anonymous Responses</Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
            thumbColor={isAnonymous ? "#2563eb" : "#f1f5f9"}
          />
        </View>

        <View style={styles.questionsContainer}>
          <Text style={styles.sectionTitle}>Questions</Text>

          {questions.map((question, index) => (
            <View key={question.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Question {index + 1}</Text>
                <View style={styles.questionActions}>
                  <TouchableOpacity
                    style={styles.questionActionButton}
                    onPress={() => moveQuestion(index, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp stroke={index === 0 ? "#cbd5e1" : "#64748b"} width={20} height={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.questionActionButton}
                    onPress={() => moveQuestion(index, "down")}
                    disabled={index === questions.length - 1}
                  >
                    <ChevronDown
                      stroke={index === questions.length - 1 ? "#cbd5e1" : "#64748b"}
                      width={20}
                      height={20}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.questionActionButton} onPress={() => removeQuestion(index)}>
                    <Trash2 stroke="#ef4444" width={20} height={20} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Question <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your question"
                  value={question.question}
                  onChangeText={(text) => updateQuestion(index, "question", text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Question Type</Text>
                <View style={styles.questionTypeContainer}>
                  {QUESTION_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.questionTypeButton,
                        question.type === type.id && styles.questionTypeButtonSelected,
                      ]}
                      onPress={() => updateQuestionType({ index, type: type.id as "multiple_choice" | "rating" | "text" | "checkbox" })}
                    >
                      <Text
                        style={[
                          styles.questionTypeButtonText,
                          question.type === type.id && styles.questionTypeButtonTextSelected,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {renderQuestionOptions({ question, index })}

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Required</Text>
                <Switch
                  value={question.required}
                  onValueChange={(value) => updateQuestion(index, "required", value)}
                  trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
                  thumbColor={question.required ? "#2563eb" : "#f1f5f9"}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addQuestionButton} onPress={addQuestion}>
            <Plus stroke="#ffffff" width={20} height={20} />
            <Text style={styles.addQuestionButtonText}>Add Question</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save stroke="#ffffff" width={20} height={20} />
            <Text style={styles.saveButtonText}>Create Survey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <X stroke="#64748b" width={20} height={20} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* QR Code Modal */}
      <Modal visible={showQRModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Survey Created!</Text>
            <Text style={styles.modalSubtitle}>Share your survey with the QR code or link below</Text>

            <View style={styles.qrCodeContainer}>
              {/* This would be a real QR code component in a production app */}
              <View style={styles.qrCodePlaceholder}>
                <QrCode stroke="#1e293b" width={40} height={40} />
                <Text style={styles.qrCodeText}>QR Code</Text>
              </View>
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>{surveyLink}</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  // In a real app, this would copy to clipboard
                  Alert.alert("Copied", "Link copied to clipboard")
                }}
              >
                <Copy stroke="#2563eb" width={16} height={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleShare}>
                <Share2 stroke="#ffffff" width={20} height={20} />
                <Text style={styles.modalButtonText}>Share Link</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowQRModal(false)
                  router.back()
                }}
              >
                <Text style={styles.modalCloseButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
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
  textArea: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  },
  dateInput: {
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: "#1e293b",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  questionsContainer: {
    marginBottom: 16,
  },
  questionCard: {
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
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  questionActions: {
    flexDirection: "row",
  },
  questionActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  questionTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  questionTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  questionTypeButtonSelected: {
    backgroundColor: "#2563eb",
  },
  questionTypeButtonText: {
    fontSize: 14,
    color: "#64748b",
  },
  questionTypeButtonTextSelected: {
    color: "white",
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionsLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  removeOptionButton: {
    padding: 12,
    marginLeft: 8,
  },
  addOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  addOptionText: {
    fontSize: 14,
    color: "#2563eb",
    marginLeft: 4,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingScaleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 8,
  },
  ratingScaleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingScaleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#64748b",
  },
  ratingScaleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  textInputPreview: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputPreviewLabel: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
  },
  addQuestionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  addQuestionButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  saveButtonText: {
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
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: "#2563eb",
  },
  copyButton: {
    padding: 8,
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
})

export default CreateSurveyScreen
