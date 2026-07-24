// Legacy Chart Components (react-native-gifted-charts)
import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { C, R, S, cardShadow } from '../theme/Theme';
import { DailyProgress } from '../types/progress';

const W = Dimensions.get('window').width - 48;

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <View style={ch.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.base }}>
        <Text style={ch.title}>{title}</Text>
        {sub ? <View style={ch.badge}><Text style={ch.badgeTxt}>{sub}</Text></View> : null}
      </View>
      {children}
    </View>
  );
}

export function CaloriesChart({ history, today }: { history: DailyProgress[]; today: DailyProgress }) {
  const days = [...history.slice(0, 6).reverse(), today];
  const data = days.map((d, i) => ({
    value: d.caloriesBurned,
    label: i === days.length - 1 ? 'Today' : new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    frontColor: i === days.length - 1 ? C.purple : C.blue,
  }));
  return (
    <Card title="Calories Burned" sub="7 Days">
      <BarChart
        data={data} width={W - 40} height={150} barWidth={26} spacing={12} roundedTop
        hideRules xAxisThickness={1} yAxisThickness={0} xAxisColor={C.border}
        yAxisTextStyle={{ color: C.text2, fontSize: 10 }} xAxisLabelTextStyle={{ color: C.text2, fontSize: 9 }}
        noOfSections={4} maxValue={Math.max(...data.map(d => d.value), 500) + 100} backgroundColor="transparent"
      />
    </Card>
  );
}

export function EnergyChart({ history, today }: { history: DailyProgress[]; today: DailyProgress }) {
  const days = [...history.slice(0, 6).reverse(), today];
  const data = days.map((d, i) => ({
    value: d.energyLevel,
    label: i === days.length - 1 ? 'Today' : new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    dataPointText: i === days.length - 1 ? `${d.energyLevel}` : '',
  }));
  return (
    <Card title="Energy Level" sub="Scale 1–10">
      <LineChart
        data={data} width={W - 40} height={130} color={C.purple} thickness={2.5} curved
        hideDataPoints={false} dataPointsColor={C.purple} dataPointsRadius={4}
        startFillColor={`${C.purple}40`} endFillColor={`${C.purple}00`} areaChart
        xAxisThickness={1} yAxisThickness={0} xAxisColor={C.border}
        yAxisTextStyle={{ color: C.text2, fontSize: 10 }} xAxisLabelTextStyle={{ color: C.text2, fontSize: 9 }}
        noOfSections={5} maxValue={10} backgroundColor="transparent" rulesColor={C.border}
        textShiftY={-8} textFontSize={11} textColor={C.text}
      />
    </Card>
  );
}

export function SleepChart({ history, today, target }: { history: DailyProgress[]; today: DailyProgress; target: number }) {
  const days = [...history.slice(0, 6).reverse(), today];
  const data = days.map((d, i) => ({
    value: d.sleepHours,
    label: i === days.length - 1 ? 'Today' : new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    frontColor: d.sleepHours >= target ? C.green : C.amber,
  }));
  return (
    <Card title="Sleep Duration" sub={`Target ${target}h`}>
      <BarChart
        data={data} width={W - 40} height={140} barWidth={26} spacing={12} roundedTop
        hideRules xAxisThickness={1} yAxisThickness={0} xAxisColor={C.border}
        yAxisTextStyle={{ color: C.text2, fontSize: 10 }} xAxisLabelTextStyle={{ color: C.text2, fontSize: 9 }}
        noOfSections={4} maxValue={10} backgroundColor="transparent" rulesColor={C.border}
        showReferenceLine1 referenceLine1Position={target}
        referenceLine1Config={{ color: C.purple, dashWidth: 4, dashGap: 4, thickness: 1.5 }}
      />
    </Card>
  );
}

export function WaterChart({ history, today, target }: { history: DailyProgress[]; today: DailyProgress; target: number }) {
  const days = [...history.slice(0, 6).reverse(), today];
  const data = days.map((d, i) => ({
    value: d.waterIntake,
    label: i === days.length - 1 ? 'Today' : new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
  }));
  return (
    <Card title="Water Intake" sub={`Target ${target}L`}>
      <LineChart
        data={data} width={W - 40} height={130} color={C.purple} thickness={2.5} curved
        hideDataPoints={false} dataPointsColor={C.purple} dataPointsRadius={4}
        startFillColor={`${C.purple}40`} endFillColor={`${C.purple}00`} areaChart
        xAxisThickness={1} yAxisThickness={0} xAxisColor={C.border}
        yAxisTextStyle={{ color: C.text2, fontSize: 10 }} xAxisLabelTextStyle={{ color: C.text2, fontSize: 9 }}
        noOfSections={4} maxValue={4} backgroundColor="transparent" rulesColor={C.border}
        showReferenceLine1 referenceLine1Position={target}
        referenceLine1Config={{ color: C.cyan, dashWidth: 4, dashGap: 4, thickness: 1.5 }}
      />
    </Card>
  );
}

const ch = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 12, ...cardShadow },
  title: { fontSize: 14, fontWeight: '700', color: C.text },
  badge: { backgroundColor: 'rgba(245,196,0,0.15)', borderRadius: R.pill, paddingHorizontal: 10, paddingVertical: 4 },
  badgeTxt: { fontSize: 11, fontWeight: '700', color: C.purple },
});
