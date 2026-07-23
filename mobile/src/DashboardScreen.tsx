import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDataRouting } from './useDataRouting';
import { SegmentToggle } from './components';
import { WeightLineChart, CaloriesBarChart, CompletionDonutChart } from './charts';
import { ScoreRing, StrengthRadar, NutritionRings, HexagonBadge } from './CustomSVGCharts';
import { globalStyles, colors } from './theme';

export default function DashboardScreen() {
  const { data, isOffline } = useDataRouting();
  const [timeRange, setTimeRange] = useState('30D');

  if (!data) return <SafeAreaView style={globalStyles.container}><Text style={{color: 'white', padding: 20}}>Loading...</Text></SafeAreaView>;

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity style={{ padding: 4 }}>
            <Ionicons name="chevron-back" size={24} color={colors.textMain} />
          </TouchableOpacity>
          <Text style={styles.title}>Progress & Analytics</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={20} color={colors.textSec} />
          </TouchableOpacity>
        </View>

        <SegmentToggle options={['7D', '30D', '90D', '1Y']} active={timeRange} onChange={setTimeRange} />

        <View style={[globalStyles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 }]}>
          <View>
            <Text style={styles.cardSubtitle}>Fitness Score</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.scoreBig}>{data.progressScore.fitnessScore}</Text>
              <Text style={styles.scoreSmall}>/100</Text>
            </View>
            <Text style={styles.successMsg}>{data.progressScore.message}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ScoreRing score={data.progressScore.fitnessScore} size={70} strokeWidth={6} />
            <View style={{ marginLeft: 16, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="water-outline" size={16} color={colors.yellow} />
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 13 }}>24 Days</Text>
                  <Text style={{ color: colors.textSec, fontSize: 11 }}>Streak</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="trending-up" size={16} color={colors.textSec} />
                <View style={{ marginLeft: 4 }}>
                  <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 13 }}>5/6</Text>
                  <Text style={{ color: colors.textSec, fontSize: 11 }}>Workouts</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={[globalStyles.miniCard, { marginRight: 6 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={styles.miniTitle}>Weight{'\n'}Progress</Text>
              <Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>↓ 2.8{'\n'}kg</Text>
            </View>
            <Text style={styles.miniValue}>{data.weightProgress[data.weightProgress.length - 1].weight} <Text style={{fontSize: 13, color: colors.textSec}}>kg</Text></Text>
            <WeightLineChart data={data.weightProgress} />
          </View>
          
          <View style={[globalStyles.miniCard, { marginLeft: 6 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={styles.miniTitle}>Strength{'\n'}Progress</Text>
              <Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>+18%</Text>
            </View>
            <StrengthRadar data={data.strengthMetrics.map(m => m.score)} />
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={[globalStyles.miniCard, { marginRight: 6 }]}>
            <Text style={styles.miniTitle}>Workout Completion</Text>
            <CompletionDonutChart data={data.workoutCompletion} />
          </View>

          <View style={[globalStyles.miniCard, { marginLeft: 6 }]}>
            <Text style={styles.miniTitle}>Calories Burned</Text>
            <Text style={styles.miniSubtitle}>Avg 420 kcal</Text>
            <CaloriesBarChart data={data.calorieHistory} />
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={[globalStyles.miniCard, { marginRight: 6 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.miniTitle}>Recovery Trend</Text>
              <Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>+ Good</Text>
            </View>
            {/* Using weight line chart component as a placeholder for recovery line chart for now */}
            <View style={{ opacity: 0.6 }}>
              <WeightLineChart data={data.weightProgress} />
            </View>
          </View>

          <View style={[globalStyles.miniCard, { marginLeft: 6 }]}>
            <Text style={styles.miniTitle}>Nutrition{'\n'}Compliance</Text>
            <NutritionRings data={data.nutrition.map(n => ({ score: n.score, color: n.name === 'Protein' ? colors.yellow : n.name === 'Calories' ? colors.green : colors.darkGreen }))} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              {data.nutrition.map((n, i) => (
                <View key={n.name} style={{ alignItems: 'center' }}>
                  <Text style={{ color: i === 0 ? colors.yellow : i === 1 ? colors.green : colors.darkGreen, fontWeight: '700', fontSize: 10 }}>{n.score}%</Text>
                  <Text style={{ color: colors.textSec, fontSize: 9 }}>{n.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ marginTop: 8, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textMain }}>Achievements</Text>
            <TouchableOpacity><Text style={{ color: colors.yellow, fontWeight: '600', fontSize: 13 }}>View All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.achievements.map((ach, idx) => (
              <View key={ach.id} style={{ alignItems: 'center', marginRight: 16 }}>
                <HexagonBadge size={70} color={ach.color}>
                  <Ionicons name={ach.iconName as any} size={24} color="#FFF" />
                  <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14, marginTop: 2 }}>{ach.value}</Text>
                </HexagonBadge>
                <Text style={styles.achievementText}>{ach.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[globalStyles.card, { padding: 20 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="sparkles" size={18} color={colors.yellow} />
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textMain, marginLeft: 8 }}>AI Insights</Text>
          </View>
          <Text style={{ color: colors.textSec, fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
            {data.aiInsights}
          </Text>
          <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.borderBase, alignSelf: 'flex-start' }}>
            <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 13 }}>See Details</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 140 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  iconButton: { padding: 8, backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.borderBase },
  title: { fontSize: 20, fontWeight: '800', color: colors.textMain },
  cardSubtitle: { fontSize: 13, fontWeight: '700', color: colors.textSec, marginBottom: 8 },
  scoreBig: { fontSize: 36, fontWeight: '800', color: colors.textMain },
  scoreSmall: { fontSize: 15, fontWeight: '600', color: colors.textSec },
  successMsg: { fontSize: 13, fontWeight: '600', color: colors.green, marginTop: 4 },
  gridRow: { flexDirection: 'row', marginBottom: 12 },
  miniTitle: { fontSize: 13, fontWeight: '700', color: colors.textMain, marginBottom: 4 },
  miniSubtitle: { fontSize: 10.5, color: colors.textSec, marginBottom: 6 },
  miniValue: { fontSize: 22, fontWeight: '800', color: colors.textMain, marginVertical: 4 },
  achievementText: { color: colors.textMain, fontWeight: '600', fontSize: 12, marginTop: 8 },
  hexagon: { width: 70, height: 70, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
