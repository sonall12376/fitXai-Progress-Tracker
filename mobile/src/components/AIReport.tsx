import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, R, S, cardShadow } from '../theme/Theme';
import { AIReport, Recommendation, RecoveryAnalysis, InjuryRisk, WorkoutPerformance, ImprovementAnalysis, GoalProgress } from '../types/progress';
import { PBar } from './Base';

// ── Motivation Banner ─────────────────────────────────────────
export function MotivationBanner({ msg }: { msg: string }) {
  return (
    <LinearGradient colors={['rgba(245,196,0,0.1)','rgba(245,196,0,0.02)']} style={mb.wrap}>
      <Text style={mb.icon}>✦</Text>
      <View style={{ flex:1 }}>
        <Text style={mb.lbl}>AI COACH</Text>
        <Text style={mb.msg}>{msg}</Text>
      </View>
    </LinearGradient>
  );
}
const mb = StyleSheet.create({
  wrap: { borderRadius:20, padding:16, flexDirection:'row', gap:12, borderWidth:1, borderColor:C.border, marginBottom:12 },
  icon: { fontSize:22, color:C.purple },
  lbl:  { fontSize:9, fontWeight:'700', color:C.purple, letterSpacing:0.6, textTransform:'uppercase', marginBottom:4 },
  msg:  { fontSize:12.5, color:C.text, lineHeight:19 },
});

// ── Score Card ────────────────────────────────────────────────
export function ScoreCard({ score, confidence, goal, name }: { score:number; confidence:number; goal:GoalProgress; name:string }) {
  const col = score>=80 ? C.green : score>=60 ? C.purple : C.red;
  const gcfg: Record<string,{color:string;bg:string}> = {
    'Ahead of Plan':{ color:C.green, bg:'rgba(163,230,53,0.15)' },
    'On Track':     { color:C.purple,bg:'rgba(245,196,0,0.15)'  },
    'Behind Plan':  { color:C.amber, bg:'rgba(245,158,11,0.15)' },
    'Stagnant':     { color:C.red,   bg:'rgba(239,68,68,0.15)'  },
  };
  const gc = gcfg[goal.status] ?? gcfg['On Track'];
  return (
    <LinearGradient colors={[C.card, C.card2]} style={sc.card}>
      <View style={sc.top}>
        <View>
          <Text style={sc.over}>AI PROGRESS REPORT</Text>
          <Text style={sc.title}>Today's Analysis</Text>
          <Text style={sc.sub}>for {name}</Text>
        </View>
        <View style={sc.scoreBox}>
          <Text style={[sc.scoreNum, { color:col }]}>{score}</Text>
          <Text style={sc.scoreSub}>/ 100</Text>
        </View>
      </View>

      <View style={{ marginBottom:16 }}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <Text style={{ fontSize:10, color:C.text2 }}>Goal Progress</Text>
          <View style={[sc.pill, { backgroundColor:gc.bg }]}><Text style={[sc.pillTxt, { color:gc.color }]}>{goal.status}</Text></View>
        </View>
        <PBar val={goal.estimatedWeeksToGoal ? 12-goal.estimatedWeeksToGoal : 6} max={12} color={col} />
        <Text style={sc.assess}>{goal.qualitativeAssessment}</Text>
      </View>

      <View style={sc.conf}>
        <Text style={{ fontSize:10, color:C.text2 }}>AI Confidence</Text>
        <Text style={{ fontSize:15, fontWeight:'800', color:C.purple }}>{(confidence*100).toFixed(0)}%</Text>
      </View>
    </LinearGradient>
  );
}
const sc = StyleSheet.create({
  card:     { borderRadius:20, padding:16, borderWidth:1, borderColor:C.border, marginBottom:12, ...cardShadow },
  top:      { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  over:     { fontSize:9, fontWeight:'700', color:C.purple, letterSpacing:0.6, textTransform:'uppercase', marginBottom:4 },
  title:    { fontSize:22, fontWeight:'800', color:C.text },
  sub:      { fontSize:12.5, color:C.text2 },
  scoreBox: { backgroundColor:C.card2, borderRadius:18, padding:12, alignItems:'center', borderWidth:1, borderColor:C.border, minWidth:82 },
  scoreNum: { fontSize:36, fontWeight:'800', lineHeight:40 },
  scoreSub: { fontSize:10, color:C.text2 },
  pill:     { borderRadius:R.pill, paddingHorizontal:10, paddingVertical:3 },
  pillTxt:  { fontSize:10, fontWeight:'700' },
  assess:   { fontSize:11, color:C.text2, lineHeight:17, marginTop:8 },
  conf:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTopWidth:1, borderTopColor:C.border },
});

// ── Workout Summary ───────────────────────────────────────────
export function WorkoutSummary({ perf, imp }: { perf:WorkoutPerformance; imp:ImprovementAnalysis }) {
  const icfg: Record<string,{color:string;emoji:string}> = { High:{color:C.green,emoji:'🔥'}, Moderate:{color:C.purple,emoji:'⚡'}, Low:{color:C.text2,emoji:'🐢'} };
  const ic = icfg[perf.intensityLevel] ?? icfg.Moderate;
  return (
    <View style={ws.card}>
      <Text style={ws.title}>Workout Analysis</Text>
      <View style={ws.row}>
        <View style={ws.m}><Text style={[ws.mv, { color:ic.color }]}>{ic.emoji} {perf.intensityLevel}</Text><Text style={ws.ml}>Intensity</Text></View>
        <View style={ws.div} />
        <View style={ws.m}><Text style={[ws.mv, { color:perf.caloriesBurnedVariance>=0?C.green:C.red }]}>{perf.caloriesBurnedVariance>=0?'+':''}{perf.caloriesBurnedVariance.toFixed(1)}%</Text><Text style={ws.ml}>Cal Δ</Text></View>
        <View style={ws.div} />
        <View style={ws.m}><Text style={[ws.mv, { color:perf.durationVariance>=0?C.green:C.amber }]}>{perf.durationVariance>=0?'+':''}{perf.durationVariance.toFixed(1)}%</Text><Text style={ws.ml}>Duration Δ</Text></View>
      </View>
      <Text style={ws.fb}>{perf.feedback}</Text>

      <View style={ws.impSec}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <Text style={{ fontSize:12, fontWeight:'700', color:C.text }}>Week-over-Week</Text>
          <View style={[ws.pill, { backgroundColor: imp.isImproving ? 'rgba(163,230,53,0.15)' : 'rgba(239,68,68,0.15)' }]}>
            <Text style={{ fontSize:10, fontWeight:'700', color: imp.isImproving ? C.green : C.red }}>{imp.isImproving ? '📈 Improving' : '📉 Declining'}</Text>
          </View>
        </View>
        {imp.metricChanges.map((m,i) => (
          <View key={i} style={{ flexDirection:'row', gap:8, marginBottom:3 }}>
            <Text style={{ color:C.purple, fontSize:11 }}>▸</Text>
            <Text style={{ fontSize:12, color:C.text2, flex:1 }}>{m}</Text>
          </View>
        ))}
        <View style={ws.bottleneck}>
          <Text style={{ fontSize:10, fontWeight:'700', color:C.amber, marginBottom:4 }}>⚠️ Primary Bottleneck</Text>
          <Text style={{ fontSize:12, color:C.text }}>{imp.primaryBottleneck}</Text>
        </View>
      </View>
    </View>
  );
}
const ws = StyleSheet.create({
  card:      { backgroundColor:C.card, borderRadius:20, padding:16, borderWidth:1, borderColor:C.border, marginBottom:12, ...cardShadow },
  title:     { fontSize:14, fontWeight:'700', color:C.text, marginBottom:12 },
  row:       { flexDirection:'row', marginBottom:12 },
  m:         { flex:1, alignItems:'center' },
  mv:        { fontSize:17, fontWeight:'800' },
  ml:        { fontSize:10, color:C.text2, marginTop:2 },
  div:       { width:1, backgroundColor:C.border, marginHorizontal:8 },
  fb:        { fontSize:12, color:C.text2, lineHeight:18, paddingTop:12, borderTopWidth:1, borderTopColor:C.border, marginBottom:12 },
  impSec:    { paddingTop:12, borderTopWidth:1, borderTopColor:C.border },
  pill:      { borderRadius:R.pill, paddingHorizontal:10, paddingVertical:3 },
  bottleneck:{ backgroundColor:'rgba(245,158,11,0.15)', borderRadius:12, padding:12, marginTop:8, borderWidth:1, borderColor:'rgba(245,158,11,0.2)' },
});

// ── Recovery Card ─────────────────────────────────────────────
export function RecoveryCard({ rec }: { rec: RecoveryAnalysis }) {
  const scfg: Record<string,{color:string;bg:string}> = {
    Optimal:  { color:C.green, bg:'rgba(163,230,53,0.15)' },
    Adequate: { color:C.purple,bg:'rgba(245,196,0,0.15)'  },
    Impaired: { color:C.amber, bg:'rgba(245,158,11,0.15)' },
    Critical: { color:C.red,   bg:'rgba(239,68,68,0.15)'  },
  };
  const cfg = scfg[rec.status] ?? scfg.Adequate;

  function badge(label:string, val:string, good:string, fair:string) {
    const col = val===good ? C.green : val===fair ? C.purple : C.red;
    return (
      <View style={[rc.badge, { backgroundColor:`${col}20` }]}>
        <Text style={[rc.bval, { color:col }]}>{val}</Text>
        <Text style={rc.blbl}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={rc.card}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <Text style={{ fontSize:14, fontWeight:'700', color:C.text }}>Recovery Analysis</Text>
        <View style={[rc.pill, { backgroundColor:cfg.bg }]}><Text style={[rc.pillTxt, { color:cfg.color }]}>{rec.status}</Text></View>
      </View>
      <View style={rc.badges}>
        {badge('Sleep', rec.sleepQuality, 'Good', 'Fair')}
        {badge('Hydration', rec.hydrationStatus, 'Optimal', 'Sub-optimal')}
        {badge('Fatigue', rec.fatigueLevel, 'Low', 'Medium')}
      </View>
      {rec.insights.map((ins,i) => (
        <View key={i} style={[rc.insight, i===0 && { borderTopWidth:0 }]}>
          <Text style={{ fontSize:14 }}>💡</Text>
          <Text style={{ fontSize:12, color:C.text2, flex:1, lineHeight:17 }}>{ins}</Text>
        </View>
      ))}
    </View>
  );
}
const rc = StyleSheet.create({
  card:    { backgroundColor:C.card, borderRadius:20, padding:16, borderWidth:1, borderColor:C.border, marginBottom:12, ...cardShadow },
  pill:    { borderRadius:R.pill, paddingHorizontal:10, paddingVertical:4 },
  pillTxt: { fontSize:11, fontWeight:'700' },
  badges:  { flexDirection:'row', gap:8, marginBottom:12 },
  badge:   { flex:1, borderRadius:12, padding:8, alignItems:'center' },
  bval:    { fontSize:10.5, fontWeight:'800', marginBottom:2, textAlign:'center' },
  blbl:    { fontSize:9, color:C.text2, textAlign:'center' },
  insight: { flexDirection:'row', gap:8, paddingTop:8, borderTopWidth:1, borderTopColor:C.border, marginTop:4 },
});

// ── Injury Card ───────────────────────────────────────────────
export function InjuryCard({ risk }: { risk: InjuryRisk }) {
  const cfg: Record<string,{color:string;bg:string;border:string;emoji:string}> = {
    Low:      { color:C.green, bg:'rgba(163,230,53,0.15)', border:'rgba(163,230,53,0.25)',  emoji:'✅' },
    Moderate: { color:C.amber, bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.25)', emoji:'⚠️' },
    High:     { color:C.red,   bg:'rgba(239,68,68,0.15)',  border:'rgba(239,68,68,0.25)',   emoji:'🚨' },
  };
  const c = cfg[risk.riskLevel] ?? cfg.Low;
  return (
    <View style={[ic.card, { borderColor:c.border }]}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <Text style={{ fontSize:14, fontWeight:'700', color:C.text }}>Injury Risk Analysis</Text>
        <View style={[ic.badge, { backgroundColor:c.bg }]}>
          <Text style={[ic.badgeTxt, { color:c.color }]}>{c.emoji} {risk.riskLevel} Risk</Text>
        </View>
      </View>
      {risk.criticalAreas.length > 0 && (
        <View style={{ marginBottom:12 }}>
          <Text style={{ fontSize:10, color:C.text2, marginBottom:8 }}>Critical Areas</Text>
          {risk.criticalAreas.map((a,i) => (
            <View key={i} style={[ic.areaChip, { backgroundColor:c.bg }]}>
              <Text style={[{ fontSize:11, fontWeight:'700' }, { color:c.color }]}>📍 {a}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={ic.action}>
        <Text style={{ fontSize:10, fontWeight:'700', color:C.text, marginBottom:6 }}>🛡️ Preventative Action</Text>
        <Text style={{ fontSize:12, color:C.text2, lineHeight:18 }}>{risk.preventativeAction}</Text>
      </View>
    </View>
  );
}
const ic = StyleSheet.create({
  card:    { backgroundColor:C.card, borderRadius:20, padding:16, borderWidth:1, marginBottom:12, ...cardShadow },
  badge:   { borderRadius:R.pill, paddingHorizontal:10, paddingVertical:5 },
  badgeTxt:{ fontSize:11, fontWeight:'800' },
  areaChip:{ borderRadius:R.sm, paddingHorizontal:12, paddingVertical:4, alignSelf:'flex-start', marginBottom:4 },
  action:  { backgroundColor:C.card2, borderRadius:14, padding:12 },
});

// ── Recommendations ───────────────────────────────────────────
export function RecsSection({ recs }: { recs: Recommendation[] }) {
  const catCfg: Record<string,{emoji:string;color:string;bg:string}> = {
    Workout:  { emoji:'🏋️', color:C.purple,    bg:'rgba(245,196,0,0.15)'  },
    Diet:     { emoji:'🥗', color:C.green,     bg:'rgba(163,230,53,0.15)' },
    Recovery: { emoji:'😴', color:C.pink,      bg:'rgba(255,179,0,0.15)'  },
    Safety:   { emoji:'🛡️', color:C.red,       bg:'rgba(239,68,68,0.15)'  },
  };
  const priCol: Record<string,string> = { High:C.red, Medium:C.amber, Low:C.text2 };
  return (
    <View style={{ gap:10 }}>
      {recs.map((r,i) => {
        const cat = catCfg[r.category] ?? catCfg.Recovery;
        return (
          <View key={i} style={[rv.card, { borderLeftColor:cat.color }]}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <View style={[rv.catBadge, { backgroundColor:cat.bg }]}>
                <Text style={[rv.catTxt, { color:cat.color }]}>{cat.emoji} {r.category}</Text>
              </View>
              <Text style={[rv.pri, { color:priCol[r.priority] }]}>● {r.priority}</Text>
            </View>
            <Text style={rv.action}>{r.action}</Text>
            <Text style={rv.rationale}>{r.rationale}</Text>
          </View>
        );
      })}
    </View>
  );
}
const rv = StyleSheet.create({
  card:     { backgroundColor:C.card, borderRadius:18, padding:12, borderWidth:1, borderColor:C.border, borderLeftWidth:3, ...cardShadow },
  catBadge: { borderRadius:R.pill, paddingHorizontal:10, paddingVertical:3 },
  catTxt:   { fontSize:10, fontWeight:'700' },
  pri:      { fontSize:10, fontWeight:'700' },
  action:   { fontSize:13, fontWeight:'700', color:C.text, marginBottom:4 },
  rationale:{ fontSize:12, color:C.text2, lineHeight:17 },
});
