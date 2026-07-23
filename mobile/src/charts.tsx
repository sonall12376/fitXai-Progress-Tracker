import React from 'react';
import { View, Text } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import { WeightDataPoint, CalorieDataPoint, WorkoutCompletion } from './models';
import { colors } from './theme';

export const WeightLineChart = ({ data }: { data: WeightDataPoint[] }) => {
  const chartData = data.map(d => ({ value: d.weight, label: d.date }));
  return (
    <View style={{ marginVertical: 10, alignItems: 'center' }}>
      <LineChart
        data={chartData}
        height={45}
        width={120}
        thickness={2}
        color={colors.yellow}
        hideDataPoints
        hideAxesAndRules
        curved
        areaChart
        yAxisOffset={65}
        startFillColor={colors.yellow}
        endFillColor={colors.yellow}
        startOpacity={0.2}
        endOpacity={0.0}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, marginTop: 4 }}>
        <Text style={{ fontSize: 9, color: colors.textSec }}>{data[0]?.date}</Text>
        <Text style={{ fontSize: 9, color: colors.textSec }}>{data[Math.floor(data.length / 2)]?.date}</Text>
        <Text style={{ fontSize: 9, color: colors.textSec }}>{data[data.length - 1]?.date}</Text>
      </View>
    </View>
  );
};

export const CaloriesBarChart = ({ data }: { data: CalorieDataPoint[] }) => {
  const chartData = data.map(d => ({ value: d.calories, label: d.day, frontColor: colors.yellow }));
  return (
    <View style={{ marginVertical: 10, alignItems: 'center' }}>
      <BarChart
        data={chartData}
        height={80}
        width={140}
        barWidth={10}
        spacing={8}
        initialSpacing={5}
        barBorderRadius={3}
        hideRules
        hideYAxisText
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ color: colors.textSec, fontSize: 9 }}
      />
    </View>
  );
};

export const CompletionDonutChart = ({ data }: { data: WorkoutCompletion }) => {
  const pieData = [
    { value: data.completed, color: colors.yellow },
    { value: data.missed, color: colors.red },
    { value: data.skipped, color: colors.borderBase },
  ];
  return (
    <View style={{ marginVertical: 10 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <PieChart
          donut
          radius={38}
          innerRadius={28}
          innerCircleColor={colors.card}
          data={pieData}
          centerLabelComponent={() => (
            <Text style={{ color: colors.textMain, fontSize: 16, fontWeight: '800' }}>
              {data.completionRate}%
            </Text>
          )}
        />
      </View>
      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.yellow, marginRight: 6 }} />
            <Text style={{ fontSize: 11, color: colors.textSec }}>Completed</Text>
          </View>
          <Text style={{ fontSize: 11, color: colors.textMain, fontWeight: '600' }}>{data.completed}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.red, marginRight: 6 }} />
            <Text style={{ fontSize: 11, color: colors.textSec }}>Missed</Text>
          </View>
          <Text style={{ fontSize: 11, color: colors.textMain, fontWeight: '600' }}>{data.missed}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.borderBase, marginRight: 6 }} />
            <Text style={{ fontSize: 11, color: colors.textSec }}>Skipped</Text>
          </View>
          <Text style={{ fontSize: 11, color: colors.textMain, fontWeight: '600' }}>{data.skipped}</Text>
        </View>
      </View>
    </View>
  );
};
