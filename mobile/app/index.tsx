import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { C, S, cardShadow } from '../src/theme/Theme';
import { useDataRouting } from '../src/hooks/useDataRouting';
import { ProgressForm } from '../src/components/ProgressForm';
import { ConsistencyCard, VulnerabilityCard, SourceBadge } from '../src/components/Base';
import { MotivationBanner, ScoreCard, WorkoutSummary, RecoveryCard, InjuryCard, RecsSection } from '../src/components/AIReport';
import { 
  FitnessScoreRing, 
  WeightProgressSparkline, 
  RecoveryTrendSparkline, 
  StrengthProgressRadar, 
  WorkoutCompletionDonut, 
  CaloriesBurnedBars, 
  NutritionComplianceRings,
  AchievementHex
} from '../src/components/AnalyticsCharts';

export default function AnalyticsDashboard() {
  const [segment, setSegment] = useState('30D');
  const { data, aiReport, chartData, isLoading, isSubmitting, error, submitError, source, isOnline, submit, reload } = useDataRouting(segment);

  if (!chartData) {
    return (
      <View style={[g.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={C.purple} />
        <Text style={{ color: C.text, marginTop: 16 }}>Loading Dashboard...</Text>
      </View>
    );
  }

  const icons = [
    <Svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2"><Path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z" /></Svg>,
    <Svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2"><Path d="M12 2s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" /></Svg>,
    <Svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2"><Rect x="3" y="4" width="18" height="18" rx="2"/><Path d="M16 2v4M8 2v4M3 10h18" /></Svg>,
    <Svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2"><Path d="M6 9H3a1 1 0 01-1-1V5a1 1 0 011-1h3m12 5h3a1 1 0 001-1V5a1 1 0 00-1-1h-3M6 4h12v6a6 6 0 01-12 0V4z" /></Svg>,
    <Svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2"><Path d="M2 6l4 3 6-6 6 6 4-3-2 13H4L2 6z" /></Svg>
  ];
  const gradients = [
    ['#FFD60A', '#CA8A04'],
    ['#FB923C', '#C2410C'],
    ['#F97316', '#B91C1C'],
    ['#CA8A04', '#78350F'],
    ['#FBBF24', '#B45309']
  ];

  return (
    <SafeAreaView style={g.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {isSubmitting && (
        <View style={g.loadingOverlay}>
          <ActivityIndicator size="large" color={C.purple} />
          <Text style={g.loadingText}>Generating AI Analysis...</Text>
        </View>
      )}

      <ScrollView style={g.scroll} contentContainerStyle={g.content} showsVerticalScrollIndicator={false}>
        
        {/* ── Topbar ── */}
        <View style={g.topbar}>
          <View style={g.topbarLeft}>
            <TouchableOpacity style={g.iconBtn} activeOpacity={0.7}>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <Path d="M15 18l-6-6 6-6" />
              </Svg>
            </TouchableOpacity>
            <Text style={g.title}>Progress & Analytics</Text>
          </View>
          <SourceBadge source={source} online={isOnline} />
        </View>

        {/* ── Segment ── */}
        <View style={g.segment}>
          {['7D', '30D', '90D', '1Y'].map(s => (
            <TouchableOpacity key={s} style={[g.segBtn, segment === s && g.segActiveBtn]} onPress={() => setSegment(s)} activeOpacity={0.8}>
              {segment === s ? (
                <LinearGradient colors={[C.purple, C.pink]} style={g.segGrad}>
                  <Text style={[g.segTxt, g.segActiveTxt]}>{s}</Text>
                </LinearGradient>
              ) : (
                <Text style={g.segTxt}>{s}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Fitness Score ── */}
        <View style={g.card}>
          <View style={g.fsTop}>
            <View style={g.fsLeft}>
              <Text style={g.fsLabel}>Fitness Score</Text>
              <Text style={g.fsBig}>{chartData.fitnessScore}<Text style={g.fsSmall}>/100</Text></Text>
              <Text style={g.fsMsg}>Great Progress! 🔥</Text>
            </View>
            <FitnessScoreRing score={chartData.fitnessScore} />
            <View style={g.fsSide}>
              <View style={g.fsItem}>
                <Svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={C.amber} strokeWidth="2">
                  <Path d="M12 2s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" />
                </Svg>
                <View>
                  <Text style={g.fsItemB}>{segment === '7D' ? '7' : segment === '30D' ? '24' : segment === '90D' ? '60' : '300'} Days</Text>
                  <Text style={g.fsItemL}>Streak</Text>
                </View>
              </View>
              <View style={g.fsItem}>
                <Svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={C.text2} strokeWidth="2">
                  <Path d="M4 12h4m8 0h4M8 12a4 4 0 018 0" />
                </Svg>
                <View>
                  <Text style={g.fsItemB}>{aiReport?.consistencyAnalysis.completedWorkoutsCount ?? 5}/{aiReport?.consistencyAnalysis.completedWorkoutsCount ? (aiReport.consistencyAnalysis.completedWorkoutsCount + aiReport.consistencyAnalysis.missedWorkoutsCount) : 6}</Text>
                  <Text style={g.fsItemL}>Workouts</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── Mini Cards Grid ── */}
        <View style={g.grid2}>
          <View style={g.mini}>
            <View style={g.mHead}><Text style={g.mTitle}>Weight Progress</Text><Text style={[g.mTag, { color: C.green }]}>{chartData.weightLoss}</Text></View>
            <Text style={g.mStat}>{chartData.weightCurrent} <Text style={g.mStatUnit}>kg</Text></Text>
            <WeightProgressSparkline points={chartData.weightTrend} />
            <View style={g.mFoot}><Text style={g.mFootTxt}>Start</Text><Text style={g.mFootTxt}>Mid</Text><Text style={g.mFootTxt}>Now</Text></View>
          </View>
          <View style={g.mini}>
            <View style={g.mHead}><Text style={g.mTitle}>Strength Progress</Text><Text style={[g.mTag, { color: C.green }]}>{chartData.strengthGain}</Text></View>
            <StrengthProgressRadar points={chartData.strengthRadar} />
          </View>
          <View style={g.mini}>
            <View style={g.mHead}><Text style={g.mTitle}>Workout Completion</Text></View>
            <WorkoutCompletionDonut percentage={chartData.workoutCompletion} />
            <View style={g.legend}>
              <View style={g.lRow}><View style={g.lWrap}><View style={[g.lDot, { backgroundColor: C.blue }]} /><Text style={g.lTxt}>Completed</Text></View><Text style={g.lNum}>{aiReport?.consistencyAnalysis.completedWorkoutsCount ?? 19}</Text></View>
              <View style={g.lRow}><View style={g.lWrap}><View style={[g.lDot, { backgroundColor: C.red }]} /><Text style={g.lTxt}>Missed</Text></View><Text style={g.lNum}>{aiReport?.consistencyAnalysis.missedWorkoutsCount ?? 6}</Text></View>
              <View style={g.lRow}><View style={g.lWrap}><View style={[g.lDot, { backgroundColor: C.cyan }]} /><Text style={g.lTxt}>Skipped</Text></View><Text style={g.lNum}>3</Text></View>
            </View>
          </View>
          <View style={g.mini}>
            <View style={g.mHead}><Text style={g.mTitle}>Calories Burned</Text></View>
            <Text style={{ fontSize: 10.5, color: C.text2, marginBottom: 6 }}>Avg {chartData.caloriesAvg} kcal</Text>
            <CaloriesBurnedBars data={chartData.caloriesData} />
          </View>
          <View style={g.mini}>
            <View style={g.mHead}><Text style={g.mTitle}>Recovery Trend</Text><Text style={[g.mTag, { color: C.green }]}>+ Good</Text></View>
            <RecoveryTrendSparkline points={chartData.recoveryTrend} />
            <View style={g.mFoot}><Text style={g.mFootTxt}>Start</Text><Text style={g.mFootTxt}>Mid</Text><Text style={g.mFootTxt}>Now</Text></View>
          </View>
          <View style={g.mini}>
            <View style={g.mHead}><Text style={g.mTitle}>Nutrition Compliance</Text></View>
            <NutritionComplianceRings p1={chartData.proteinPct} p2={chartData.caloriesPct} p3={chartData.waterPct} />
            <View style={g.nLabels}>
              <View style={g.nLabCol}><Text style={[g.nLabPct, { color: C.green }]}>{Math.round(chartData.proteinPct*100)}%</Text><Text style={g.nLabT}>Protein</Text></View>
              <View style={g.nLabCol}><Text style={[g.nLabPct, { color: C.purple }]}>{Math.round(chartData.caloriesPct*100)}%</Text><Text style={g.nLabT}>Calories</Text></View>
              <View style={g.nLabCol}><Text style={[g.nLabPct, { color: C.cyan }]}>{Math.round(chartData.waterPct*100)}%</Text><Text style={g.nLabT}>Water</Text></View>
            </View>
          </View>
        </View>

        {/* ── Achievements ── */}
        <View style={g.secHead}>
          <Text style={g.secTitle}>Achievements</Text>
          <Text style={g.secLink}>View All</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={g.achieveRow}>
          {chartData.achievements.map((a, idx) => (
             <AchievementHex key={idx} gradient={gradients[idx % gradients.length]} num={a.num} label={a.label} icon={icons[idx % icons.length]} />
          ))}
        </ScrollView>

        {/* ── AI Report Section ── */}
        {aiReport && (
          <View style={{ marginTop: 20 }}>
            <View style={g.secHead}><Text style={g.secTitle}>AI Progress Report</Text></View>
            <MotivationBanner msg={aiReport.motivationMessage} />
            <ScoreCard score={aiReport.progressScore} confidence={aiReport.confidenceScore} goal={aiReport.goalProgress} name={data?.userProfile?.name || 'User'} />
            
            <View style={{ marginTop: 16 }}><Text style={g.secTitle}>Consistency</Text></View>
            <ConsistencyCard status={aiReport.consistencyAnalysis.status} completed={aiReport.consistencyAnalysis.completedWorkoutsCount} missed={aiReport.consistencyAnalysis.missedWorkoutsCount} adherence={aiReport.consistencyAnalysis.weeklyAdherencePercentage} />
            
            <View style={{ marginTop: 16 }}><Text style={g.secTitle}>Progress Summary</Text></View>
            <WorkoutSummary perf={aiReport.workoutPerformance} imp={aiReport.improvementAnalysis} />
            
            <View style={{ marginTop: 16 }}><Text style={g.secTitle}>Recovery Analysis</Text></View>
            <RecoveryCard rec={aiReport.recoveryAnalysis} />
            
            <View style={{ marginTop: 16 }}><Text style={g.secTitle}>Vulnerability Analysis</Text></View>
            <VulnerabilityCard items={aiReport.userVulnerabilities} />
            
            <View style={{ marginTop: 16 }}><Text style={g.secTitle}>Injury Risk Analysis</Text></View>
            <InjuryCard risk={aiReport.injuryRisk} />
            
            <View style={{ marginTop: 16 }}><Text style={g.secTitle}>Recommendations</Text></View>
            <RecsSection recs={aiReport.personalizedRecommendations} />
          </View>
        )}

        {/* ── Daily Progress Form ── */}
        <View style={{ marginTop: 30 }}>
          <View style={[g.secHead, { marginBottom: 16 }]}><Text style={g.secTitle}>Log Daily Progress</Text></View>
          {submitError && <Text style={{ color: C.red, marginBottom: 10 }}>{submitError}</Text>}
          <ProgressForm onSubmit={submit} submitting={isSubmitting} />
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const g = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 10 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: C.purple, marginTop: 12, fontWeight: '700' },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, marginBottom: 16 },
  topbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', color: C.text2 },
  title: { fontSize: 19, fontWeight: '800', color: C.text },
  segment: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 14, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  segBtn: { flex: 1, borderRadius: 10 },
  segGrad: { flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 9 },
  segTxt: { textAlign: 'center', paddingVertical: 9, fontSize: 12, fontWeight: '700', color: C.text2 },
  segActiveTxt: { color: '#fff', paddingVertical: 0 },
  segActiveBtn: { },
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border, ...cardShadow },
  fsTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  fsLeft: { },
  fsLabel: { fontSize: 13, fontWeight: '700', color: C.text2, marginBottom: 8 },
  fsBig: { fontSize: 32, fontWeight: '800', color: C.text },
  fsSmall: { fontSize: 15, fontWeight: '600', color: C.text2 },
  fsMsg: { fontSize: 12, fontWeight: '600', color: C.green, marginTop: 4 },
  fsSide: { alignItems: 'flex-end', gap: 10 },
  fsItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fsItemB: { fontSize: 12.5, fontWeight: '700', color: C.text, textAlign: 'right' },
  fsItemL: { fontSize: 11.5, fontWeight: '600', color: C.text2, textAlign: 'right' },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  mini: { width: '48%', backgroundColor: C.card, borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: C.border, ...cardShadow },
  mHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mTitle: { fontSize: 12.5, fontWeight: '700', color: C.text },
  mTag: { fontSize: 10.5, fontWeight: '700' },
  mStat: { fontSize: 19, fontWeight: '800', color: C.text, marginVertical: 4 },
  mStatUnit: { fontSize: 12, fontWeight: '600', color: C.text2 },
  mFoot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  mFootTxt: { fontSize: 9, color: C.text2 },
  legend: { marginTop: 6, gap: 6 },
  lRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lDot: { width: 7, height: 7, borderRadius: 3.5 },
  lTxt: { fontSize: 10, color: C.text2 },
  lNum: { fontSize: 10, fontWeight: '700', color: C.text2 },
  nLabels: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  nLabCol: { alignItems: 'center' },
  nLabPct: { fontSize: 12, fontWeight: '800' },
  nLabT: { fontSize: 9.5, color: C.text2 },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 18, marginBottom: 12 },
  secTitle: { fontSize: 16, fontWeight: '700', color: C.text },
  secLink: { fontSize: 12.5, fontWeight: '700', color: C.purple },
  achieveRow: { paddingBottom: 6, marginBottom: 12, gap: 10 },
});
