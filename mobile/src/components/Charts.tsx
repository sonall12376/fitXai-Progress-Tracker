// STEP 8 — Chart Components (react-native-gifted-charts)

import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { C, R, S, cardShadow } from '../theme/Theme';
import { DailyProgress } from '../types/progress';

const W = Dimensions.get('window').width - 48;

function Card({ title, sub, children }: { title:string; sub?:string; children:React.ReactNode }) {
  return (
    <View style={ch.card}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:S.base }}>
        <Text style={ch.title}>{title}</Text>
        {sub ? <View style={ch.badge}><Text style={ch.badgeTxt}>{sub}</Text></View> : null}
      </View>
      {children}
    </View>
  );
}

export function CaloriesChart({ history, today }: { history:DailyProgress[]; today:DailyProgress }) {
  const days = [...history.slice(0,6).reverse(), today];
  const data = days.map((d,i) => ({
    value: d.caloriesBurned,
    label: i===days.length-1 ? 'Today' : new Date(d.date).toLocaleDateString('en-US',{weekday:'short'}),
    frontColor: i===days.length-1 ? C.gold : C.darkGold,
  }));
  return (
    <Card title="Calories Burned" sub="7 Days">
      <BarChart data={data} width={W-40} height={150} barWidth={26} spacing={12} roundedTop
        hideRules xAxisThickness={1} yAxisThickness={0} xAxisColor={C.border}
        yAxisTextStyle={{ color:C.textSec, fontSize:10 }} xAxisLabelTextStyle={{ color:C.textSec, fontSize:9 }}
        noOfSections={4} maxValue={Math.max(...data.map(d=>d.value),500)+100} backgroundColor="transparent" />
    </Card>
  );
}

export function EnergyChart({ history, today }: { history:DailyProgress[]; today:DailyProgress }) {
  const days = [...history.slice(0,6).reverse(), today];
  const data = days.map((d,i) => ({
    value: d.energyLevel,
    label: i===days.length-1 ? 'Today' : new Date(d.date).toLocaleDateString('en-US',{weekday:'short'}),
    dataPointText: i===days.length-1 ? `${d.energyLevel}` : '',
  }));
  return (
    <Card title="Energy Level" sub="Scale 1–10">
      <LineChart data={data} width={W-40} height={130} color={C.gold} thickness={2.5} curved
        hideDataPoints={false} dataPointsColor={C.gold} dataPointsRadius={4}
        startFillColor={`${C.gold}40`} endFillColor={`${C.gold}00`} areaChart
        xAxisThickness={1} yAxisThickness={0} xAxisColor={C.border}
        yAxisTextStyle={{ color:C.textSec, fontSize:10 }} xAxisLabelTextStyle={{ color:C.textSec, fontSize:9 }}
        noOfSections={5} maxValue={10} backgroundColor="transparent" rulesColor={C.border}
        textShiftY={-8} textFontSize={11} dataPointTextColor={C.text} />
    </Card>
  );
}

export function SleepChart({ history, today, target }: { history:DailyProgress[]; today:DailyProgress; target:number }) {
  const days = [...history.slice(0,6).reverse(), today];
  const data = days.map((d,i) => ({
    value: d.sleepHours,
    label: i===days.length-1 ? 'Today' : new Date(d.date).toLocaleDateString('en-US',{weekday:'short'}),
    frontColor: d.sleepHours>=target ? C.green : d.sleepHours>=target*0.8 ? C.gold : C.red,
  }));
  return (
    <Card title="Sleep Hours" sub={`Target ${target}h`}>
      <BarChart data={data} width={W-40} height={130} barWidth={26} spacing={12} roundedTop
        referenceLine1={target} referenceLine1Config={{ color:C.gold, dashWidth:4, dashGap:4, thickness:1.5 }}
        xAxisThickness={1} yAxisThickness={0} xAxisColor={C.border}
        yAxisTextStyle={{ color:C.textSec, fontSize:10 }} xAxisLabelTextStyle={{ color:C.textSec, fontSize:9 }}
        noOfSections={4} maxValue={12} backgroundColor="transparent" rulesColor={C.border} />
    </Card>
  );
}

export function WaterChart({ history, today, target }: { history:DailyProgress[]; today:DailyProgress; target:number }) {
  const days = [...history.slice(0,6).reverse(), today];
  const data = days.map((d,i) => ({
    value: d.waterIntake,
    label: i===days.length-1 ? 'Today' : new Date(d.date).toLocaleDateString('en-US',{weekday:'short'}),
    frontColor: d.waterIntake>=target ? C.green : C.warn,
  }));
  return (
    <Card title="Water Intake" sub={`Target ${target}L`}>
      <BarChart data={data} width={W-40} height={120} barWidth={26} spacing={12} roundedTop
        referenceLine1={target} referenceLine1Config={{ color:C.gold, dashWidth:4, dashGap:4, thickness:1.5 }}
        xAxisThickness={1} yAxisThickness={0} xAxisColor={C.border}
        yAxisTextStyle={{ color:C.textSec, fontSize:10 }} xAxisLabelTextStyle={{ color:C.textSec, fontSize:9 }}
        noOfSections={4} maxValue={6} backgroundColor="transparent" rulesColor={C.border} />
    </Card>
  );
}

export function StepsChart({ history, today, target }: { history:DailyProgress[]; today:DailyProgress; target:number }) {
  const days = [...history.slice(0,6).reverse(), today];
  const data = days.map((d,i) => ({
    value: d.steps,
    label: i===days.length-1 ? 'Today' : new Date(d.date).toLocaleDateString('en-US',{weekday:'short'}),
  }));
  return (
    <Card title="Daily Steps" sub={`Target ${(target/1000).toFixed(0)}K`}>
      <LineChart data={data} width={W-40} height={130} color={C.paleGold} thickness={2.5} curved
        hideDataPoints={false} dataPointsColor={C.paleGold} dataPointsRadius={4}
        startFillColor={`${C.paleGold}40`} endFillColor={`${C.paleGold}00`} areaChart
        xAxisThickness={1} yAxisThickness={0} xAxisColor={C.border}
        yAxisTextStyle={{ color:C.textSec, fontSize:10 }} xAxisLabelTextStyle={{ color:C.textSec, fontSize:9 }}
        noOfSections={4} backgroundColor="transparent" rulesColor={C.border}
        referenceLine1={target} referenceLine1Config={{ color:C.gold, dashWidth:4, dashGap:4, thickness:1.5 }} />
    </Card>
  );
}

const ch = StyleSheet.create({
  card:     { backgroundColor:C.card, borderRadius:R.xl, padding:S.xl, paddingBottom:S.base, borderWidth:1, borderColor:C.border, marginBottom:S.base, ...cardShadow, overflow:'hidden' },
  title:    { fontSize:13.5, fontWeight:'700', color:C.text },
  badge:    { backgroundColor:C.goldTint, borderRadius:R.pill, paddingHorizontal:S.sm, paddingVertical:3 },
  badgeTxt: { fontSize:10, fontWeight:'700', color:C.gold },
});
