import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, Switch, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, R, S, cardShadow } from '../theme/Theme';
import { ProgressFormState } from '../types/progress';

// ── Default form state ────────────────────────────────────────
export const defaultForm: ProgressFormState = {
  workoutCompleted: false,
  workoutType:      'Strength Training',
  workoutDuration:  '',
  caloriesBurned:   '',
  caloriesConsumed: '',
  steps:            '',
  sleepHours:       '',
  waterIntake:      '',
  mood:             'Good',
  energyLevel:      5,
  hasInjury:        false,
  painLevel:        0,
  injuryDetails:    '',
  notes:            '',
};

const WORKOUT_TYPES = [
  'Strength Training','Cardio','HIIT','Yoga',
  'Chest & Triceps','Back & Biceps','Legs',
  'Shoulders','Full Body','Running','Cycling',
];
const MOODS = ['Energetic','Good','Tired','Exhausted','Stressed'];
const MOOD_EMOJI: Record<string, string> = {
  Energetic:'⚡', Good:'😊', Tired:'😴', Exhausted:'🥱', Stressed:'😤',
};

// ── Sub-components ────────────────────────────────────────────
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={f.block}>
      <Text style={f.blockTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Label({ t, req }: { t: string; req?: boolean }) {
  return (
    <Text style={f.label}>
      {t}{req ? <Text style={{ color: C.red }}> *</Text> : ''}
    </Text>
  );
}

function NumIn({
  val, set, ph, unit, dec,
}: {
  val: string; set: (v: string) => void;
  ph: string; unit?: string; dec?: boolean;
}) {
  return (
    <View style={f.inputRow}>
      <TextInput
        style={f.input}
        value={val}
        onChangeText={set}
        placeholder={ph}
        placeholderTextColor={C.text2}
        keyboardType={dec ? 'decimal-pad' : 'numeric'}
        returnKeyType="done"
      />
      {unit ? <Text style={f.unit}>{unit}</Text> : null}
    </View>
  );
}

function Chips({
  opts, sel, onSel, emoji,
}: {
  opts: string[]; sel: string;
  onSel: (v: string) => void; emoji?: Record<string, string>;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
        {opts.map(o => {
          const active = o === sel;
          return (
            <TouchableOpacity
              key={o}
              onPress={() => onSel(o)}
              style={[f.chip, active && f.chipActive]}
              activeOpacity={0.8}
            >
              {active ? (
                <LinearGradient
                  colors={[C.purple, C.pink]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={f.chipGrad}
                >
                  <Text style={f.chipTxtOn}>{emoji?.[o] ?? ''} {o}</Text>
                </LinearGradient>
              ) : (
                <Text style={f.chipTxt}>{emoji?.[o] ?? ''} {o}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Dots({
  val, min, max, set, color = C.purple,
}: {
  val: number; min: number; max: number;
  set: (v: number) => void; color?: string;
}) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        {steps.map(n => (
          <TouchableOpacity
            key={n}
            onPress={() => set(n)}
            style={[
              f.dot,
              { backgroundColor: n <= val ? color : C.card2, width: n === val ? 28 : 18, height: n === val ? 28 : 18 },
            ]}
          >
            {n === val ? <Text style={f.dotTxt}>{n}</Text> : null}
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        <Text style={{ fontSize: 9, color: C.text2 }}>{min}</Text>
        <Text style={{ fontSize: 20, fontWeight: '800', color }}>{val}</Text>
        <Text style={{ fontSize: 9, color: C.text2 }}>{max}</Text>
      </View>
    </View>
  );
}

// ── Main Form ─────────────────────────────────────────────────
interface ProgressFormProps {
  onSubmit:      (f: ProgressFormState) => Promise<void> | void;
  submitting:    boolean;
  submitError:   string | null;
  submitSuccess: boolean;
  onClear?:      () => void;
}

export function ProgressForm({
  onSubmit, submitting, submitError, submitSuccess, onClear,
}: ProgressFormProps) {
  const [form, setForm] = useState<ProgressFormState>(defaultForm);
  const upd = useCallback(
    <K extends keyof ProgressFormState>(k: K, v: ProgressFormState[K]) =>
      setForm(p => ({ ...p, [k]: v })),
    [],
  );

  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [localSubmitError, setLocalSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (submitting || localIsSubmitting) return;
    setLocalIsSubmitting(true);
    setLocalSubmitError(null);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setLocalSubmitError(err?.message || 'Submission failed');
    } finally {
      setLocalIsSubmitting(false);
    }
  };

  const isFormSubmitting = submitting || localIsSubmitting;
  const currentError = localSubmitError || submitError;

  return (
    <View style={{ gap: 10 }}>

      {/* ── Workout ── */}
      <Block title="🏋️  Workout">
        <Label t="Workout Completed Today?" />
        <View style={f.switchRow}>
          <Switch
            value={form.workoutCompleted}
            onValueChange={v => upd('workoutCompleted', v)}
            trackColor={{ false: C.card2, true: C.purple }}
            thumbColor="#fff"
          />
          <Text style={[f.switchLbl, { color: form.workoutCompleted ? C.green : C.text2 }]}>
            {form.workoutCompleted ? '✅ Yes, worked out!' : 'Rest day'}
          </Text>
        </View>

        {form.workoutCompleted && (
          <>
            <Label t="Workout Type" req />
            <Chips opts={WORKOUT_TYPES} sel={form.workoutType} onSel={v => upd('workoutType', v)} />
            <View style={f.twoCol}>
              <View style={{ flex: 1 }}>
                <Label t="Duration" req />
                <NumIn val={form.workoutDuration} set={v => upd('workoutDuration', v)} ph="0" unit="min" />
              </View>
              <View style={{ flex: 1 }}>
                <Label t="Calories Burned" req />
                <NumIn val={form.caloriesBurned} set={v => upd('caloriesBurned', v)} ph="0" unit="kcal" />
              </View>
            </View>
          </>
        )}
      </Block>

      {/* ── Nutrition & Activity ── */}
      <Block title="🥗  Nutrition & Activity">
        <View style={f.twoCol}>
          <View style={{ flex: 1 }}>
            <Label t="Calories Consumed" req />
            <NumIn val={form.caloriesConsumed} set={v => upd('caloriesConsumed', v)} ph="0" unit="kcal" />
          </View>
          <View style={{ flex: 1 }}>
            <Label t="Steps" req />
            <NumIn val={form.steps} set={v => upd('steps', v)} ph="0" unit="steps" />
          </View>
        </View>
        <View style={f.twoCol}>
          <View style={{ flex: 1 }}>
            <Label t="Water Intake" req />
            <NumIn val={form.waterIntake} set={v => upd('waterIntake', v)} ph="0.0" unit="L" dec />
          </View>
          <View style={{ flex: 1 }}>
            <Label t="Sleep Hours" req />
            <NumIn val={form.sleepHours} set={v => upd('sleepHours', v)} ph="0.0" unit="h" dec />
          </View>
        </View>
      </Block>

      {/* ── Wellbeing ── */}
      <Block title="🧠  Wellbeing">
        <Label t="Mood" req />
        <Chips opts={MOODS} sel={form.mood} onSel={v => upd('mood', v)} emoji={MOOD_EMOJI} />
        <Label t={`Energy Level — ${form.energyLevel}/10`} req />
        <Dots val={form.energyLevel} min={1} max={10} set={v => upd('energyLevel', v)} color={C.purple} />
      </Block>

      {/* ── Injury ── */}
      <Block title="🩹  Injury & Pain">
        <Label t="Any Injury or Pain?" />
        <View style={f.switchRow}>
          <Switch
            value={form.hasInjury}
            onValueChange={v => upd('hasInjury', v)}
            trackColor={{ false: C.card2, true: C.red }}
            thumbColor="#fff"
          />
          <Text style={[f.switchLbl, { color: form.hasInjury ? C.red : C.text2 }]}>
            {form.hasInjury ? '⚠️ Injury reported' : 'No injury today'}
          </Text>
        </View>
        {form.hasInjury && (
          <>
            <Label t={`Pain Level — ${form.painLevel}/10`} req />
            <Dots val={form.painLevel} min={0} max={10} set={v => upd('painLevel', v)} color={C.red} />
            <Label t="Injury Details" />
            <TextInput
              style={f.area}
              value={form.injuryDetails}
              onChangeText={v => upd('injuryDetails', v)}
              placeholder="Describe location, movement restrictions..."
              placeholderTextColor={C.text2}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </>
        )}
      </Block>

      {/* ── Notes ── */}
      <Block title="📝  Additional Notes">
        <TextInput
          style={f.area}
          value={form.notes}
          onChangeText={v => upd('notes', v)}
          placeholder="How did today feel? Any soreness, motivation, or observations..."
          placeholderTextColor={C.text2}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </Block>

      {/* ── Status Messages ── */}
      {submitSuccess && (
        <View style={f.successBanner}>
          <Text style={f.successTxt}>✅ AI Report Generated Successfully!</Text>
        </View>
      )}
      {currentError ? (
        <View style={f.errorBanner}>
          <Text style={f.errorTxt}>⚠️ {currentError}</Text>
          {onClear ? (
            <TouchableOpacity onPress={() => { onClear(); setLocalSubmitError(null); }} style={{ marginTop: 6 }}>
              <Text style={{ fontSize: 11, color: C.text2, textDecorationLine: 'underline' }}>Dismiss</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {/* ── Submit ── */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isFormSubmitting}
        activeOpacity={0.85}
        style={[f.submitWrap, isFormSubmitting && { opacity: 0.7 }]}
      >
        <LinearGradient
          colors={isFormSubmitting ? [C.card2, C.card2] : [C.purple, C.pink]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={f.submitGrad}
        >
          {isFormSubmitting ? (
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <ActivityIndicator color={C.text2} size="small" />
              <Text style={[f.submitTxt, { color: C.text2 }]}>Generating AI Analysis...</Text>
            </View>
          ) : (
            <Text style={f.submitTxt}>✦  Generate AI Progress Report</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const f = StyleSheet.create({
  block:        { backgroundColor: C.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 12, ...cardShadow },
  blockTitle:   { fontSize: 13.5, fontWeight: '700', color: C.text, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  label:        { fontSize: 10, fontWeight: '700', color: C.text2, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 8 },
  switchRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  switchLbl:    { fontSize: 12.5, fontWeight: '600' },
  inputRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card2, borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, height: 48 },
  input:        { flex: 1, fontSize: 13.5, fontWeight: '700', color: C.text },
  unit:         { fontSize: 10, color: C.text2 },
  area:         { backgroundColor: C.card2, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 12, fontSize: 12.5, color: C.text, minHeight: 80, marginTop: 4 },
  twoCol:       { flexDirection: 'row', gap: 10 },
  chip:         { borderRadius: R.pill, backgroundColor: C.card2, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  chipActive:   { borderColor: 'transparent' },
  chipGrad:     { paddingHorizontal: 14, paddingVertical: 8, borderRadius: R.pill },
  chipTxt:      { fontSize: 11, fontWeight: '600', color: C.text2, paddingHorizontal: 14, paddingVertical: 8 },
  chipTxtOn:    { fontSize: 11, fontWeight: '700', color: '#fff' },
  dot:          { borderRadius: R.pill, alignItems: 'center', justifyContent: 'center' },
  dotTxt:       { fontSize: 9, fontWeight: '800', color: '#000' },
  submitWrap:   { borderRadius: 18, overflow: 'hidden', marginTop: 8, ...cardShadow },
  submitGrad:   { paddingVertical: 16, alignItems: 'center' },
  submitTxt:    { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  successBanner:{ backgroundColor: 'rgba(163,230,53,0.12)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(163,230,53,0.25)', marginTop: 4 },
  successTxt:   { color: C.green, fontWeight: '700', fontSize: 13, textAlign: 'center' },
  errorBanner:  { backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)', marginTop: 4 },
  errorTxt:     { color: C.red, fontWeight: '700', fontSize: 13 },
});
