import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../utils/ThemeContext";

const { width } = Dimensions.get("window");

const ResultScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  
  const [currentResult, setCurrentResult] = useState({ score: 0, total: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const init = async () => {
      const existingHistory = await AsyncStorage.getItem("quizHistory");
      let h = existingHistory ? JSON.parse(existingHistory) : [];
      setHistory(h);

      const last = await AsyncStorage.getItem("quizLastScore");
      if (last) setCurrentResult(JSON.parse(last));

      if (route.params?.score !== undefined && route.params?.score !== null) {
        const res = { 
          score: route.params.score, 
          total: route.params.total,
          results: route.params.results || []
        };
        
        setCurrentResult(res);
        await saveLastScore(res);

        const now = new Date();
        const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
        
        if (h[0]?.date !== dateStr) {
          const entry = { ...res, date: dateStr };
          h = [entry, ...h].slice(0, 20);
          await AsyncStorage.setItem("quizHistory", JSON.stringify(h));
          setHistory(h);
        }
      }
    };
    init();
  }, [route.params]);

  const saveLastScore = async (res) => {
    try { await AsyncStorage.setItem("quizLastScore", JSON.stringify(res)); } catch (e) {}
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("quizHistory");
      await AsyncStorage.removeItem("quizLastScore");
      setHistory([]);
      setCurrentResult({ score: 0, total: 0 });
    } catch (e) {}
  };

  const percentage = currentResult.total > 0 ? Math.round((currentResult.score / currentResult.total) * 100) : 0;
  const barHeights = [20, 50, 80, 40, 60, 90, 30].map(h => (h * (currentResult.score + 1)) / (currentResult.total || 10));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>ANALYTICS</Text>
          <Text style={[styles.title, { color: theme.text }]}>Progress Report</Text>
        </View>

        <View style={styles.chartsRow}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>ACCURACY</Text>
            <View style={styles.pieContainer}>
              <Svg width="100" height="100" viewBox="0 0 40 40">
                <Circle cx="20" cy="20" r="16" fill="transparent" stroke={theme.progressBg} strokeWidth="8" />
                <Circle cx="20" cy="20" r="16" fill="transparent" stroke={theme.correct} strokeWidth="8" strokeDasharray={`${percentage} 100`} transform="rotate(-90 20 20)" />
              </Svg>
              <View style={styles.overlay}>
                <Text style={[styles.overlayText, { color: theme.text }]}>{percentage}%</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>VITALITY</Text>
            <View style={styles.barStack}>
              {barHeights.map((h, i) => (
                <View key={i} style={[styles.bar, { height: Math.max(h, 4), backgroundColor: i === 3 ? theme.accent : theme.progressBg }]} />
              ))}
            </View>
            <Text style={[styles.barCaption, { color: theme.dimmedText }]}>Weekly Effort</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <TouchableOpacity 
            style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => currentResult.results && navigation.navigate("Review", { results: currentResult.results })}
          >
            <Text style={[styles.statVal, { color: theme.correct }]}>{currentResult.score}</Text>
            <Text style={[styles.statSub, { color: theme.textSecondary }]}>CORRECT ANSWERS (TAP TO REVIEW)</Text>
          </TouchableOpacity>
          <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.statVal, { color: theme.accent }]}>{history.length}</Text>
            <Text style={[styles.statSub, { color: theme.textSecondary }]}>TOTAL SESSIONS</Text>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>History</Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={clearHistory}>
                <Text style={[styles.clearBtn, { color: theme.wrong }]}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          {history.length > 0 ? (
            history.map((item, index) => {
              const p = Math.round((item.score / item.total) * 100);
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.historyItem, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("Review", { results: item.results })}
                >
                  <View style={styles.hLeft}>
                    <Text style={[styles.hDate, { color: theme.text }]}>{item.date.split(' ')[0]}</Text>
                    <Text style={[styles.hTime, { color: theme.dimmedText }]}>{item.date.split(' ')[1]}</Text>
                  </View>
                  <View style={styles.hRight}>
                    <Text style={[styles.hScore, { color: theme.text }]}>{item.score}/{item.total}</Text>
                    <View style={[styles.hBadge, { backgroundColor: p >= 60 ? theme.correctBg : theme.wrongBg }]}>
                      <Text style={[styles.hBadgeText, { color: p >= 60 ? theme.correct : theme.wrong }]}>{p}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.dimmedText }]}>No sessions recorded yet.</Text>
            </View>
          )}
        </View>

        {route.params?.score !== undefined && route.params?.score !== null && (
          <TouchableOpacity
            style={[styles.homeButton, { backgroundColor: theme.accent, shadowColor: theme.accent }]}
            onPress={() => navigation.navigate("Main", { screen: "Dashboard" })}
          >
            <Text style={styles.homeButtonText}>Dashboard</Text>
          </TouchableOpacity>
        )}

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
  scrollContent: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 40 },
  header: { marginBottom: 32 },
  subtitle: { fontSize: 13, fontWeight: "900", letterSpacing: 2, marginBottom: 8 },
  title: { fontSize: 34, fontWeight: "900", letterSpacing: -1 },
  chartsRow: { flexDirection: "row", gap: 16, marginBottom: 20 },
  card: { flex: 1, borderRadius: 24, padding: 20, borderWidth: 1, alignItems: "center" },
  cardLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1.5, marginBottom: 16 },
  pieContainer: { width: 80, height: 80, alignItems: "center", justifyContent: "center" },
  overlay: { position: "absolute" },
  overlayText: { fontSize: 18, fontWeight: "900" },
  barStack: { height: 80, flexDirection: "row", alignItems: "flex-end", gap: 4, marginBottom: 4 },
  bar: { width: 6, borderRadius: 3 },
  barCaption: { fontSize: 10, fontWeight: "800", marginTop: 8 },
  statsGrid: { flexDirection: "row", gap: 12, marginBottom: 32 },
  statBox: { flex: 1, padding: 20, borderRadius: 24, borderWidth: 1 },
  statVal: { fontSize: 28, fontWeight: "900" },
  statSub: { fontSize: 8, fontWeight: "900", marginTop: 4, letterSpacing: 0.5 },
  historyContainer: { marginTop: 10 },
  historyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "900" },
  clearBtn: { fontSize: 14, fontWeight: "700" },
  historyItem: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 12 },
  hDate: { fontSize: 16, fontWeight: "800" },
  hTime: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  hRight: { flexDirection: "row", alignItems: "center" },
  hScore: { fontSize: 18, fontWeight: "900", marginRight: 12 },
  hBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  hBadgeText: { fontSize: 12, fontWeight: "800" },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 15, fontWeight: "600", fontStyle: "italic" },
  homeButton: { height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginTop: 20, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  homeButtonText: { color: "#ffffff", fontSize: 18, fontWeight: "800" },
  footer: { marginTop: 40, alignItems: "center" },
  footerText: { fontSize: 10, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
});

export default ResultScreen;
