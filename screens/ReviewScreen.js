import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../utils/ThemeContext";

const ReviewScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { results } = route.params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtnText, { color: theme.textSecondary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Quiz Review</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {results.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.reviewCard, 
              { 
                backgroundColor: theme.card, 
                borderColor: item.isCorrect ? theme.correct : theme.wrong,
                borderLeftWidth: 6
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.qNum, { color: theme.dimmedText }]}>QUESTION {index + 1}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.isCorrect ? theme.correctBg : theme.wrongBg }]}>
                <Text style={[styles.statusText, { color: item.isCorrect ? theme.correct : theme.wrong }]}>
                  {item.isCorrect ? "CORRECT" : "WRONG"}
                </Text>
              </View>
            </View>

            <Text style={[styles.questionText, { color: theme.text }]}>{item.question}</Text>

            <View style={styles.answerSection}>
              <View style={styles.answerRow}>
                <Text style={[styles.answerLabel, { color: theme.dimmedText }]}>Your Choice:</Text>
                <Text style={[styles.answerVal, { color: item.isCorrect ? theme.correct : theme.wrong }]}>
                  {item.selected}
                </Text>
              </View>
              
              {!item.isCorrect && (
                <View style={styles.answerRow}>
                  <Text style={[styles.answerLabel, { color: theme.dimmedText }]}>Correct Answer:</Text>
                  <Text style={[styles.answerVal, { color: theme.correct }]}>
                    {item.correct}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: theme.accent }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeBtnText}>Done Reviewing</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.dimmedText }]}>
            Designed by Sushant Raj Mishra
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { marginRight: 20 },
  backBtnText: { fontSize: 16, fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "900" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  reviewCard: { borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  qNum: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: "900" },
  questionText: { fontSize: 18, fontWeight: "700", lineHeight: 26, marginBottom: 20 },
  answerSection: { gap: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  answerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  answerLabel: { fontSize: 13, fontWeight: "600", flex: 0.4 },
  answerVal: { fontSize: 14, fontWeight: "800", flex: 0.6, textAlign: "right" },
  closeBtn: { height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginTop: 20, marginBottom: 30 },
  closeBtnText: { color: "#ffffff", fontSize: 18, fontWeight: "800" },
  footer: { alignItems: "center" },
  footerText: { fontSize: 10, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
});

export default ReviewScreen;
