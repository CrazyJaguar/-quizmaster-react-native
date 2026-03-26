import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import questions from "../data/questions";
import shuffle from "../utils/shuffle";
import { useTheme } from "../utils/ThemeContext";

const QuizScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});

  useFocusEffect(
    useCallback(() => {
      setCurrentIndex(0);
      setScore(0);
      setAnswers({});
      
      const shuffledQs = shuffle(questions).map((q) => ({
        ...q,
        options: shuffle(q.options),
      }));
      setShuffledQuestions(shuffledQs);

      return () => {};
    }, [])
  );

  const currentAnswer = answers[currentIndex];
  const answered = currentAnswer !== undefined;
  const selectedOption = currentAnswer?.selected || null;
  const isCorrect = currentAnswer?.isCorrect || null;

  const handleAnswer = (option) => {
    if (answered) return;
    const correct = shuffledQuestions[currentIndex].correct === option;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { selected: option, isCorrect: correct },
    }));
    if (correct) setScore((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 < shuffledQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const detailedResults = shuffledQuestions.map((q, idx) => ({
        question: q.question,
        selected: answers[idx]?.selected || "(No answer)",
        correct: q.correct,
        isCorrect: answers[idx]?.isCorrect || false,
      }));

      navigation.replace("ResultSummary", {
        score: score,
        total: shuffledQuestions.length,
        results: detailedResults,
      });
    }
  };

  const getOptionStyle = (option) => {
    const base = [styles.optionButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }];
    if (!answered) return base;
    if (option === shuffledQuestions[currentIndex].correct) {
      return [...base, { backgroundColor: theme.correctBg, borderColor: theme.correct, borderWidth: 2 }];
    }
    if (option === selectedOption && !isCorrect) {
      return [...base, { backgroundColor: theme.wrongBg, borderColor: theme.wrong, borderWidth: 2 }];
    }
    return [...base, { opacity: 0.3 }];
  };

  const getOptionTextStyle = (option) => {
    const base = [styles.optionText, { color: theme.text }];
    if (!answered) return base;
    if (option === shuffledQuestions[currentIndex].correct) {
      return [styles.optionText, { color: theme.correct, fontWeight: "900" }];
    }
    if (option === selectedOption && !isCorrect) {
      return [styles.optionText, { color: theme.wrong, fontWeight: "900" }];
    }
    return [styles.optionText, { color: theme.dimmedText }];
  };

  if (shuffledQuestions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Preparing your challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = shuffledQuestions[currentIndex];
  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;
  const isLastQuestion = currentIndex + 1 === shuffledQuestions.length;
  const isFirstQuestion = currentIndex === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <View style={styles.content}>
        <View style={styles.topHeader}>
          <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>STEP {currentIndex + 1}</Text>
          <View style={[styles.scoreBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[styles.scoreBadgeText, { color: theme.accent }]}>{score} PTS</Text>
          </View>
        </View>

        <View style={[styles.progressBarTrack, { backgroundColor: theme.progressBg }]}>
          <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: theme.accent }]} />
        </View>

        <View style={[styles.mainQuestionCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
          <Text style={[styles.questionText, { color: theme.text }]}>
            {currentQuestion.question}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(option)}
              activeOpacity={0.7}
              onPress={() => handleAnswer(option)}
              disabled={answered}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionIndex, { backgroundColor: theme.progressBg }]}>
                  <Text style={[styles.optionIndexText, { color: theme.textSecondary }]}>{String.fromCharCode(65 + index)}</Text>
                </View>
                <Text style={getOptionTextStyle(option)}>{option}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.feedbackArea}>
          {answered && (
            <View style={[styles.feedbackBadge, { backgroundColor: isCorrect ? theme.correctBg : theme.wrongBg }]}>
              <Text style={[styles.feedbackBadgeText, { color: isCorrect ? theme.correct : theme.wrong }]}>
                {isCorrect ? "BRILLIANT! ✓" : "NOT QUITE! ✗"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.smallNavBtn, isFirstQuestion && styles.disabledBtn]}
            onPress={handlePrevious}
            disabled={isFirstQuestion}
          >
            <Text style={[styles.smallNavBtnText, { color: theme.textSecondary }]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.largeNavBtn, { backgroundColor: theme.accent }, !answered && styles.disabledBtn]}
            onPress={handleNext}
          >
            <Text style={styles.largeNavBtnText}>
              {isLastQuestion ? "View Results" : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, fontWeight: "600" },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  stepLabel: { fontSize: 12, fontWeight: "900", letterSpacing: 3 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  scoreBadgeText: { fontSize: 12, fontWeight: "900" },
  progressBarTrack: { height: 4, borderRadius: 2, marginBottom: 40, overflow: "hidden" },
  progressBarFill: { height: "100%" },
  mainQuestionCard: { borderRadius: 24, padding: 32, marginBottom: 32, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  questionText: { fontSize: 24, fontWeight: "800", textAlign: "center", lineHeight: 34 },
  optionsContainer: { gap: 16 },
  optionButton: { paddingVertical: 16, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1.5 },
  optionContent: { flexDirection: "row", alignItems: "center" },
  optionIndex: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 16 },
  optionIndexText: { fontSize: 14, fontWeight: "900" },
  optionText: { fontSize: 17, fontWeight: "600" },
  feedbackArea: { height: 60, justifyContent: "center", alignItems: "center", marginTop: 20 },
  feedbackBadge: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  feedbackBadgeText: { fontSize: 14, fontWeight: "900", letterSpacing: 1 },
  bottomBar: { flexDirection: "row", alignItems: "center", marginTop: "auto", paddingBottom: 30, gap: 16 },
  smallNavBtn: { paddingVertical: 18, paddingHorizontal: 24, alignItems: "center" },
  smallNavBtnText: { fontSize: 16, fontWeight: "700" },
  largeNavBtn: { flex: 1, paddingVertical: 18, borderRadius: 20, alignItems: "center" },
  largeNavBtnText: { color: "#ffffff", fontSize: 18, fontWeight: "800" },
  disabledBtn: { opacity: 0.3 },
});

export default QuizScreen;
