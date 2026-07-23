import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, R, S, cardShadow } from '../theme/Theme';

// ── Section Label ─────────────────────────────────────────────
export function SectionLabel({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={{ marginTop: S.xl, marginBottom: S.sm }}>
      <Text style={sl.title}>{title}</Text>
      {sub ? <Text style={sl.sub}>{sub}</Text> : null}
    </View>
  );
}
const sl = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '700', color: C.text },
  sub:   { fontSize: 11, color: C.text2, marginTop: 2 },
});

// ── Source Badge ──────────────────────────────────────────────
export function SourceBadge({ source, online }: { source: string; online: boolean }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    api:          { label: 'Live',   color: C.green,   bg: 'rgba(163,230,53,0.15)' },
    asyncstorage: { label: 'Cached', color: C.amber,   bg: 'rgba(245,158,11,0.15)' },
    mock:         { label: 'Demo',   color: C.text2,   bg: 'rgba(176,170,154,0.12)' },
  };
  const cfg = map[source] ?? map.mock;
  return (
    <View style={[sb.pill, { backgroundColor: cfg.bg }]}>
      <View style={[sb.dot, { backgroundColor: cfg.color }]} />
      <Text style={[sb.txt, { color: cfg.color }]}>{cfg.label}{!online ? ' · Offline' : ''}</Text>
    </View>
  );
}
const sb = StyleSheet.create({
  pill: { flexDirection:'row', alignItems:'center', borderRadius:R.pill, paddingHorizontal:10, paddingVertical:4 },
  dot:  { width:6, height:6, borderRadius:3, marginRight:5 },
  txt:  { fontSize:10, fontWeight:'700' },
});

// ── Consistency Card ──────────────────────────────────────────
interface CCProps { status:string; completed:number; missed:number; adherence:number }
export function ConsistencyCard({ status, completed, missed, adherence }: CCProps) {
  const cfg: Record<string,{color:string;bg:string;emoji:string}> = {
    'Excellent':        { color:C.green, bg:'rgba(163,230,53,0.15)', emoji:'🔥' },
    'On Track':         { color:C.purple,bg:'rgba(245,196,0,0.15)',  emoji:'✅' },
    'Needs Attention':  { color:C.amber, bg:'rgba(245,158,11,0.15)', emoji:'⚠️' },
    'Unsatisfactory':   { color:C.red,   bg:'rgba(239,68,68,0.15)',   emoji:'❌' },
  };
  const c = cfg[status] ?? cfg['On Track'];
  return (
    <View style={cc.card}>
      <View style={cc.hdr}>
        <View>
          <Text style={cc.over}>WEEKLY CONSISTENCY</Text>
          <Text style={cc.title}>Workout Streak</Text>
        </View>
        <View style={[cc.pill, { backgroundColor:c.bg }]}>
          <Text style={[cc.pillTxt, { color:c.color }]}>{c.emoji} {status}</Text>
        </View>
      </View>
      <View style={cc.row}>
        <View style={cc.stat}><Text style={[cc.num, { color:C.green }]}>{completed}</Text><Text style={cc.lbl}>Done</Text></View>
        <View style={cc.div} />
        <View style={cc.stat}><Text style={[cc.num, { color:C.red }]}>{missed}</Text><Text style={cc.lbl}>Missed</Text></View>
        <View style={cc.div} />
        <View style={cc.stat}><Text style={[cc.num, { color:C.purple }]}>{adherence.toFixed(0)}%</Text><Text style={cc.lbl}>Adherence</Text></View>
      </View>
      <View style={cc.track}><View style={[cc.fill, { width:`${adherence}%` as any }]} /></View>
    </View>
  );
}
const cc = StyleSheet.create({
  card:    { backgroundColor:C.card, borderRadius:20, padding:16, borderWidth:1, borderColor:C.border, marginBottom:12, ...cardShadow },
  hdr:     { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  over:    { fontSize:9, fontWeight:'700', color:C.text2, letterSpacing:0.6, textTransform:'uppercase', marginBottom:3 },
  title:   { fontSize:14, fontWeight:'700', color:C.text },
  pill:    { borderRadius:R.pill, paddingHorizontal:10, paddingVertical:4 },
  pillTxt: { fontSize:11, fontWeight:'700' },
  row:     { flexDirection:'row', marginBottom:20 },
  stat:    { flex:1, alignItems:'center' },
  num:     { fontSize:28, fontWeight:'800' },
  lbl:     { fontSize:10, color:C.text2, marginTop:2 },
  div:     { width:1, height:40, backgroundColor:C.border, alignSelf:'center' },
  track:   { height:7, backgroundColor:C.card2, borderRadius:R.pill, overflow:'hidden' },
  fill:    { height:'100%', backgroundColor:C.purple, borderRadius:R.pill },
});

// ── Vulnerability Card ────────────────────────────────────────
export function VulnerabilityCard({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <View style={vc.card}>
      <View style={vc.hdr}>
        <Text style={vc.title}>Vulnerability Areas</Text>
        <View style={[vc.badge, { backgroundColor:'rgba(245,158,11,0.15)' }]}>
          <Text style={[vc.badgeTxt, { color:C.amber }]}>⚠️ {items.length} Found</Text>
        </View>
      </View>
      {items.map((v,i) => (
        <View key={i} style={[vc.item, i===0 && { borderTopWidth:0 }]}>
          <View style={vc.dot} />
          <Text style={vc.txt}>{v}</Text>
        </View>
      ))}
    </View>
  );
}
const vc = StyleSheet.create({
  card:     { backgroundColor:C.card, borderRadius:20, padding:16, borderWidth:1, borderColor:'rgba(245,158,11,0.2)', marginBottom:12, ...cardShadow },
  hdr:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  title:    { fontSize:14, fontWeight:'700', color:C.text },
  badge:    { borderRadius:R.pill, paddingHorizontal:10, paddingVertical:4 },
  badgeTxt: { fontSize:11, fontWeight:'700' },
  item:     { flexDirection:'row', alignItems:'center', gap:8, paddingVertical:8, borderTopWidth:1, borderTopColor:C.border },
  dot:      { width:8, height:8, borderRadius:4, backgroundColor:C.amber },
  txt:      { fontSize:12.5, color:C.text, flex:1 },
});

// ── Progress Bar ──────────────────────────────────────────────
export function PBar({ val, max, color=C.purple, label }: { val:number; max:number; color?:string; label?:string }) {
  const pct = Math.min(100, Math.max(0, (val/max)*100));
  return (
    <View style={{ marginBottom:8 }}>
      {label ? <Text style={{ fontSize:10, color:C.text2, marginBottom:4 }}>{label}</Text> : null}
      <View style={{ height:6, backgroundColor:C.card2, borderRadius:R.pill, overflow:'hidden' }}>
        <View style={{ height:'100%', width:`${pct}%` as any, backgroundColor:color, borderRadius:R.pill }} />
      </View>
    </View>
  );
}
