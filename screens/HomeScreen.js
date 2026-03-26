import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../utils/ThemeContext";

const HomeScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [lastScore, setLastScore] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadLastScore();
    });
    return unsubscribe;
  }, [navigation]);

  const loadLastScore = async () => {
    try {
      const savedScore = await AsyncStorage.getItem("quizLastScore");
      if (savedScore !== null) {
        setLastScore(JSON.parse(savedScore));
      }
    } catch (e) {
      console.log("Error loading last score:", e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleIcon}>{isDark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroContainer}>
          <View style={[styles.heroIconContainer, { backgroundColor: theme.accentLight }]}>
            <Text style={styles.heroEmoji}>🚀</Text>
          </View>
          <Text style={[styles.heroTitle, { color: theme.text }]}>QuizMaster</Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Challenge yourself and track your journey to mastery.
          </Text>
        </View>

        <View style={[styles.mainCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, shadowColor: theme.shadow }]}>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTag, { color: theme.accent }]}>QUICK PLAY</Text>
            <Text style={[styles.cardHeading, { color: theme.text }]}>Ready for a{'\n'}New Challenge?</Text>
            <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
              {lastScore 
                ? `Last play: ${lastScore.score}/${lastScore.total} points` 
                : "Begin your first quiz session!"}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: theme.accent, shadowColor: theme.accent }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Quiz")}
          >
            <Text style={styles.playButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipContainer}>
          <View style={[styles.tipIcon, { backgroundColor: theme.accentLight }]}>
            <Text style={styles.tipEmoji}>💡</Text>
          </View>
          <View style={styles.tipTextContent}>
            <Text style={[styles.tipTitle, { color: theme.text }]}>Pro Tip</Text>
            <Text style={[styles.tipDesc, { color: theme.textSecondary }]}>
              Frequent practice improves long-term memory. Try one quiz every day!
            </Text>
          </View>
        </View>

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
  scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 20 },
  themeToggle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  toggleIcon: { fontSize: 20 },
  heroContainer: { alignItems: "center", marginBottom: 40, marginTop: 10 },
  heroIconContainer: { width: 90, height: 90, borderRadius: 45, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  heroEmoji: { fontSize: 45 },
  heroTitle: { fontSize: 40, fontWeight: "900", letterSpacing: -2, marginBottom: 8 },
  heroSubtitle: { fontSize: 16, textAlign: "center", lineHeight: 24, paddingHorizontal: 30 },
  mainCard: { borderRadius: 32, padding: 32, borderWidth: 1, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, marginBottom: 30 },
  cardTag: { fontSize: 12, fontWeight: "900", letterSpacing: 2, marginBottom: 12 },
  cardHeading: { fontSize: 26, fontWeight: "900", lineHeight: 32, marginBottom: 8 },
  cardSub: { fontSize: 15, fontWeight: "600", marginBottom: 32 },
  playButton: { height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  playButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "800" },
  tipContainer: { flexDirection: "row", alignItems: "center", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "transparent", marginTop: 10 },
  tipIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 16 },
  tipEmoji: { fontSize: 20 },
  tipTextContent: { flex: 1 },
  tipTitle: { fontSize: 16, fontWeight: "800", marginBottom: 2 },
  tipDesc: { fontSize: 13, lineHeight: 18, fontWeight: "600" },
  footer: { marginTop: 50, alignItems: "center" },
  footerText: { fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
});

export default HomeScreen;
