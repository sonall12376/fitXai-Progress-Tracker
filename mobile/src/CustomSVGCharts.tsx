import React from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText } from 'react-native-svg';
import { colors } from './theme';

export const ScoreRing = ({ score, size = 70, strokeWidth = 6 }: { score: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={colors.borderBase}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={colors.yellow}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFillObject}>
        <RNText style={{ textAlign: 'center', lineHeight: size, color: colors.textMain, fontSize: 18, fontWeight: '800' }}>
          {score}
        </RNText>
      </View>
    </View>
  );
};

export const StrengthRadar = ({ size = 140, data }: { size?: number, data: number[] }) => {
  const center = size / 2;
  const radius = 45; // Fixed smaller radius to allow text to fit
  const labels = ["Overhead", "Squat", "Deadlift", "Pull-up", "Bench"];
  
  const getPoint = (val: number, i: number, total: number) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const r = (val / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };
  
  const outerPolygon = [100, 100, 100, 100, 100].map((v, i) => getPoint(v, i, 5)).join(" ");
  const innerPolygon = data.map((v, i) => getPoint(v, i, 5)).join(" ");
  
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
      <Svg width={size} height={size}>
        <Polygon points={outerPolygon} stroke={colors.borderBase} strokeWidth="1" fill="none" />
        <Polygon points={innerPolygon} stroke={colors.yellow} strokeWidth="1.5" fill="rgba(255, 214, 10, 0.2)" />
        {labels.map((label, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const r = radius + 15; 
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
             <SvgText key={label} x={x} y={y} fill={colors.textSec} fontSize="9" textAnchor="middle" alignmentBaseline="middle">
               {label}
             </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

export const NutritionRings = ({ size = 90, data }: { size?: number, data: {score: number, color: string}[] }) => {
  const center = size / 2;
  const strokeWidth = 5;
  const rings = data;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
      <Svg width={size} height={size}>
        {rings.map((ring, i) => {
          const radius = center - strokeWidth / 2 - (i * (strokeWidth + 2));
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (ring.score / 100) * circumference;
          return (
            <React.Fragment key={i}>
              <Circle cx={center} cy={center} r={radius} stroke={colors.borderBase} strokeWidth={strokeWidth} fill="none" />
              <Circle cx={center} cy={center} r={radius} stroke={ring.color} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" rotation="-90" origin={`${center}, ${center}`} />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

export const HexagonBadge = ({ size = 70, color = colors.yellow, children }: { size?: number, color?: string, children?: React.ReactNode }) => {
  const s = size;
  const points = `${s/2},0 ${s},${s*0.25} ${s},${s*0.75} ${s/2},${s} 0,${s*0.75} 0,${s*0.25}`;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Polygon points={points} fill={color} />
      </Svg>
      <View style={{ alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
};
