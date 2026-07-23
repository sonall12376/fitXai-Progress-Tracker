import { LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import type { WeightDataPoint, StrengthMetric, WorkoutCompletion, CalorieDataPoint, RecoveryDataPoint } from './models';

export const WeightLineChart = ({ data }: { data: WeightDataPoint[] }) => (
  <ResponsiveContainer width="100%" height={46}>
    <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
      <Line type="monotone" dataKey="weight" stroke="var(--pink)" strokeWidth={2.2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export const RecoveryLineChart = ({ data }: { data: RecoveryDataPoint[] }) => (
  <ResponsiveContainer width="100%" height={46}>
    <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
      <Line type="monotone" dataKey="score" stroke="var(--green)" strokeWidth={2.2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export const StrengthRadarChart = ({ data }: { data: StrengthMetric[] }) => (
  <ResponsiveContainer width="100%" height={98}>
    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
      <PolarGrid stroke="#241F14" />
      <PolarAngleAxis dataKey="exercise" tick={{ fill: 'var(--text2)', fontSize: 7, fontFamily: 'Manrope' }} />
      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
      <Radar name="Strength" dataKey="score" stroke="var(--purple)" fill="var(--purple)" fillOpacity={0.4} strokeWidth={1.6} />
    </RadarChart>
  </ResponsiveContainer>
);

export const CompletionDonutChart = ({ data }: { data: WorkoutCompletion }) => {
  const chartData = [
    { name: 'Completed', value: data.completed, color: 'var(--blue)' },
    { name: 'Missed', value: data.missed, color: 'var(--red)' },
    { name: 'Skipped', value: data.skipped, color: 'var(--cyan)' }
  ];
  return (
    <ResponsiveContainer width="100%" height={78}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={23} outerRadius={32} dataKey="value" stroke="none">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export const CaloriesBarChart = ({ data }: { data: CalorieDataPoint[] }) => (
  <ResponsiveContainer width="100%" height={60}>
    <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <Bar dataKey="calories" radius={[3, 3, 0, 0]}>
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill="var(--blue)" />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);
