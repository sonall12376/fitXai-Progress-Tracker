import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, Polyline, Polygon, Text as SvgText } from 'react-native-svg';
import { C } from '../theme/Theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

// ── Fitness Score Ring ──────────────────────────────────────────
export function FitnessScoreRing({ score }: { score: number }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const CIRC = 232;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [score]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRC, 0],
  });

  return (
    <View style={styles.fscoreRing}>
      <Svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx="44" cy="44" r="37" fill="none" stroke="#241F14" strokeWidth="8" />
        <Defs>
          <LinearGradient id="fsGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={C.purple} />
            <Stop offset="100%" stopColor={C.cyan} />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          cx="44" cy="44" r="37" fill="none" stroke="url(#fsGrad)" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={strokeDashoffset}
        />
      </Svg>
      <View style={styles.fscoreCenter}>
        <Text style={styles.fscoreCenterText}>{score}</Text>
      </View>
    </View>
  );
}

// ── Weight Progress Sparkline ──────────────────────────────────
export function WeightProgressSparkline({ points = "0,18 20,24 40,12 60,20 80,8 100,16 120,6 150,14" }: { points?: string }) {
  const targetPoints = points || "0,18 20,24 40,12 60,20 80,8 100,16 120,6 150,14";
  const anim = useRef(new Animated.Value(0)).current;
  const prev = useRef(targetPoints);

  useEffect(() => {
    if (prev.current !== targetPoints) {
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(() => {
        prev.current = targetPoints;
      });
    }
  }, [targetPoints]);

  const animatedPoints = anim.interpolate({ inputRange: [0, 1], outputRange: [prev.current, targetPoints] });

  return (
    <Svg width="100%" height="46" viewBox="0 0 150 46" preserveAspectRatio="none">
      <AnimatedPolyline points={animatedPoints as any} fill="none" stroke={C.pink} strokeWidth="2.2" />
    </Svg>
  );
}

// ── Recovery Trend Sparkline ───────────────────────────────────
export function RecoveryTrendSparkline({ points = "0,30 20,20 40,26 60,12 80,18 100,6 120,14 150,4" }: { points?: string }) {
  const targetPoints = points || "0,30 20,20 40,26 60,12 80,18 100,6 120,14 150,4";
  const anim = useRef(new Animated.Value(0)).current;
  const prev = useRef(targetPoints);

  useEffect(() => {
    if (prev.current !== targetPoints) {
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(() => {
        prev.current = targetPoints;
      });
    }
  }, [targetPoints]);

  const animatedPoints = anim.interpolate({ inputRange: [0, 1], outputRange: [prev.current, targetPoints] });

  return (
    <Svg width="100%" height="46" viewBox="0 0 150 46" preserveAspectRatio="none">
      <AnimatedPolyline points={animatedPoints as any} fill="none" stroke={C.green} strokeWidth="2.2" />
    </Svg>
  );
}

// ── Strength Progress Radar ────────────────────────────────────
export function StrengthProgressRadar({ points = "50,10 86,34 73,80 27,80 14,34" }: { points?: string }) {
  const targetPoints = points || "50,10 86,34 73,80 27,80 14,34";
  const anim = useRef(new Animated.Value(0)).current;
  const prev = useRef("50,50 50,50 50,50 50,50 50,50"); // initial from center

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(() => {
      prev.current = targetPoints;
    });
  }, [targetPoints]);

  const animatedPoints = anim.interpolate({ inputRange: [0, 1], outputRange: [prev.current, targetPoints] });

  return (
    <Svg width="100%" height="98" viewBox="0 0 100 100">
      <Polygon points="50,8 90,34 76,86 24,86 10,34" fill="none" stroke="#241F14" strokeWidth="1.2" />
      <Polygon points="50,26 72,42 64,72 36,72 28,42" fill="none" stroke="#241F14" strokeWidth="1.2" />
      <AnimatedPolygon points={animatedPoints as any} fill="rgba(245,196,0,.4)" stroke={C.purple} strokeWidth="1.6" />
      <SvgText x="50" y="4" textAnchor="middle" fill={C.text2} fontSize="6.5" fontFamily="Manrope">Overhead</SvgText>
      <SvgText x="94" y="36" textAnchor="start" fill={C.text2} fontSize="6.5" fontFamily="Manrope">Squat</SvgText>
      <SvgText x="76" y="96" textAnchor="middle" fill={C.text2} fontSize="6.5" fontFamily="Manrope">Deadlift</SvgText>
      <SvgText x="24" y="96" textAnchor="middle" fill={C.text2} fontSize="6.5" fontFamily="Manrope">Pull-up</SvgText>
      <SvgText x="6" y="36" textAnchor="end" fill={C.text2} fontSize="6.5" fontFamily="Manrope">Bench</SvgText>
    </Svg>
  );
}

// ── Workout Completion Donut ───────────────────────────────────
export function WorkoutCompletionDonut({ percentage }: { percentage: number }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const CIRC = 201;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRC, CIRC - (CIRC * (percentage / 100))],
  });

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ position: 'relative', width: 78, height: 78 }}>
        <Svg width="78" height="78" viewBox="0 0 78 78">
          <Circle cx="39" cy="39" r="32" fill="none" stroke="#241F14" strokeWidth="9" />
          <Defs>
            <LinearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={C.purple} />
              <Stop offset="100%" stopColor={C.blue} />
            </LinearGradient>
          </Defs>
          <AnimatedCircle 
            cx="39" cy="39" r="32" fill="none" stroke="url(#donutGrad)" strokeWidth="9"
            strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 39 39)"
          />
        </Svg>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: C.text }}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
}

// ── Calories Burned Bars ───────────────────────────────────────
export function CaloriesBurnedBars({ data, labels = ['M','T','W','T','F','S','S'] }: { data: number[], labels?: string[] }) {
  // Normalize against the actual max value in data — works for both
  // mock values (45–110) and real kcal values (300–600+)
  const safeData = data.length ? data : [0,0,0,0,0,0,0];
  const maxVal   = Math.max(...safeData, 1); // always at least 1 to avoid divide-by-0

  const animatedValuesRef = useRef<Animated.Value[]>([]);
  if (animatedValuesRef.current.length !== safeData.length) {
    animatedValuesRef.current = safeData.map((_, i) => animatedValuesRef.current[i] || new Animated.Value(0));
  }
  const animatedValues = animatedValuesRef.current;

  useEffect(() => {
    Animated.stagger(60,
      animatedValues.map((val, i) =>
        Animated.timing(val, {
          toValue: safeData[i] || 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      )
    ).start();
  }, [JSON.stringify(safeData)]);

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 60 }}>
        {safeData.map((h, i) => (
          <Animated.View
            key={i}
            style={{
              flex: 1,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              backgroundColor: C.blue,
              // Normalize: height % = (value / maxVal) * 100%
              height: animatedValues[i].interpolate({
                inputRange: [0, maxVal],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        {labels.map((d, i) => (
          <Text key={i} style={{ fontSize: 9, color: C.text2, flex: 1, textAlign: 'center' }}>{d}</Text>
        ))}
      </View>
    </View>
  );
}


// ── Nutrition Compliance Rings ─────────────────────────────────
export function NutritionComplianceRings({ p1, p2, p3 }: { p1: number, p2: number, p3: number }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [p1, p2, p3]);

  const rings = [
    { r: 31, c: 195, p: p1, color: C.green },
    { r: 24, c: 151, p: p2, color: C.purple },
    { r: 17, c: 107, p: p3, color: C.cyan },
  ];

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Svg width="72" height="72" viewBox="0 0 72 72">
        {rings.map((ring, i) => (
          <Circle key={`bg-${i}`} cx="36" cy="36" r={ring.r} fill="none" stroke="#241F14" strokeWidth="4" />
        ))}
        {rings.map((ring, i) => {
          const offset = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [ring.c, ring.c - (ring.c * ring.p)]
          });
          return (
            <AnimatedCircle 
              key={`fg-${i}`} cx="36" cy="36" r={ring.r} fill="none" stroke={ring.color} strokeWidth="4"
              strokeLinecap="round" strokeDasharray={ring.c} strokeDashoffset={offset}
              transform="rotate(-90 36 36)"
            />
          );
        })}
      </Svg>
    </View>
  );
}

// ── Achievements Hexagons ──────────────────────────────────────
export function AchievementHex({ gradient, num, label, icon }: { gradient: string[], num: string, label: string, icon: React.ReactNode }) {
  return (
    <View style={styles.achieve}>
      <View style={styles.hexOuter}>
        <Defs>
          <LinearGradient id={`grad-${num || label.replace(/\s+/g, '')}`} x1="0.2" y1="0" x2="0.8" y2="1">
            <Stop offset="0%" stopColor={gradient[0]} />
            <Stop offset="100%" stopColor={gradient[1]} />
          </LinearGradient>
        </Defs>
        <Svg width="64" height="64" viewBox="0 0 64 64" style={styles.hexSvg}>
          <Polygon points="32,0 60.8,16 60.8,48 32,64 3.2,48 3.2,16" fill={`url(#grad-${num || label.replace(/\s+/g, '')})`} />
        </Svg>
        <View style={styles.hexContent}>
          {icon}
          {num !== '' && <Text style={styles.hexNum}>{num}</Text>}
        </View>
      </View>
      <Text style={styles.achieveLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fscoreRing: { position: 'relative', width: 88, height: 88 },
  fscoreCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  fscoreCenterText: { fontSize: 22, fontWeight: '800', color: C.text },
  achieve: { flexShrink: 0, width: 88, alignItems: 'center' },
  hexOuter: { position: 'relative', width: 64, height: 64, marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  hexSvg: { position: 'absolute' },
  hexContent: { alignItems: 'center', justifyContent: 'center', marginTop: -4 },
  hexNum: { fontSize: 11, fontWeight: '800', color: '#fff', marginTop: 1 },
  achieveLabel: { fontSize: 11, fontWeight: '700', color: C.text2, textAlign: 'center' },
});
