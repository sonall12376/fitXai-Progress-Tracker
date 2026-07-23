import { useState } from 'react';
import { useDataRouting } from './useDataRouting';
import { Card, MiniCard, SegmentToggle, HexAchievement } from './components';
import { WeightLineChart, StrengthRadarChart, CompletionDonutChart, CaloriesBarChart, RecoveryLineChart } from './charts';
import { Activity, Dumbbell, User, Home, ArrowLeft, Settings } from 'lucide-react';

export const DashboardLayout = () => {
  const { data, isOffline } = useDataRouting();
  const [timeRange, setTimeRange] = useState('30D');

  if (!data) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-[1120px] mx-auto w-full p-4 md:p-6 lg:p-8 relative min-h-screen pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center text-textSec cursor-pointer">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[28px] font-extrabold leading-tight">Progress & Analytics</h1>
            {isOffline && <span className="text-amber text-xs font-bold block">Offline Mode - Showing Cached Data</span>}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-card border border-borderBase flex items-center justify-center text-textSec cursor-pointer hover:bg-card2 transition-colors">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      <div className="max-w-[400px] mb-6">
        <SegmentToggle options={['7D', '30D', '90D', '1Y']} active={timeRange} onChange={setTimeRange} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Fitness Score */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-between items-start p-6">
          <div>
            <div className="text-[13px] font-bold text-textSec mb-2">Fitness Score</div>
            <div className="text-[32px] font-extrabold flex items-baseline gap-1">
              {data.progressScore.fitnessScore}
              <small className="text-[15px] text-textSec font-semibold">/100</small>
            </div>
            <div className="text-[12px] text-green font-semibold mt-1">{data.progressScore.message}</div>
          </div>
          <div className="flex flex-col gap-2 items-end">
             <div className="text-right text-[11.5px] font-semibold text-textSec flex items-center gap-2">
               <Activity className="w-4 h-4 text-amber" />
               <b className="text-textMain text-[12.5px]">{data.progressScore.streakDays} Days</b> Streak
             </div>
             <div className="text-right text-[11.5px] font-semibold text-textSec flex items-center gap-2">
               <Dumbbell className="w-4 h-4 text-textSec" />
               <b className="text-textMain text-[12.5px]">{data.progressScore.workoutsCompleted}/{data.progressScore.workoutsTotal}</b> Workouts
             </div>
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2 lg:col-span-3">
          <MiniCard title="Weight Progress" tag="↓ 2.8 kg">
            <div className="text-[19px] font-extrabold my-1">{data.weightProgress[data.weightProgress.length - 1].weight} <small className="text-[12px] text-textSec">kg</small></div>
            <WeightLineChart data={data.weightProgress} />
            <div className="flex justify-between text-[9px] text-textSec mt-1">
              <span>{data.weightProgress[0].date}</span>
              <span>{data.weightProgress[data.weightProgress.length - 1].date}</span>
            </div>
          </MiniCard>

          <MiniCard title="Strength Progress" tag="+18%">
            <StrengthRadarChart data={data.strengthMetrics} />
          </MiniCard>

          <MiniCard title="Workout Completion">
            <div className="flex justify-center my-2 relative">
               <CompletionDonutChart data={data.workoutCompletion} />
               <div className="absolute inset-0 flex items-center justify-center text-[17px] font-extrabold">
                  {data.workoutCompletion.completionRate}%
               </div>
            </div>
            <div className="flex flex-col gap-1 text-[10px] text-textSec mt-2">
              <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue"></span>Completed</span><b className="text-textMain">{data.workoutCompletion.completed}</b></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red"></span>Missed</span><b className="text-textMain">{data.workoutCompletion.missed}</b></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan"></span>Skipped</span><b className="text-textMain">{data.workoutCompletion.skipped}</b></div>
            </div>
          </MiniCard>

          <MiniCard title="Calories Burned">
            <div className="text-[10.5px] text-textSec mb-2">Avg 420 kcal</div>
            <CaloriesBarChart data={data.calorieHistory} />
            <div className="flex justify-between text-[9px] text-textSec mt-1">
              {data.calorieHistory.map((d, i) => <span key={i}>{d.day}</span>)}
            </div>
          </MiniCard>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <MiniCard title="Recovery Trend" tag="+ Good">
            <RecoveryLineChart data={data.recoveryTrend} />
            <div className="flex justify-between text-[9px] text-textSec mt-1">
              <span>{data.recoveryTrend[0].date}</span>
              <span>{data.recoveryTrend[data.recoveryTrend.length - 1].date}</span>
            </div>
          </MiniCard>
        </div>

      </div>

      {/* Achievements Section */}
      <div className="mt-8 mb-4 flex justify-between items-center">
        <h3 className="text-[16px] font-bold">Achievements</h3>
        <span className="text-[12.5px] text-purple font-bold cursor-pointer">View All</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        <HexAchievement number="100" title="Workouts" gradient="linear-gradient(160deg, #FFD60A, #CA8A04)" />
        <HexAchievement number="5KG" title="Lost" gradient="linear-gradient(160deg, #FB923C, #C2410C)" />
        <HexAchievement number="30" title="Day Streak" gradient="linear-gradient(160deg, #F97316, #B91C1C)" />
      </div>

      {/* AI Insights Card */}
      <Card className="mt-4 mb-20 bg-gradient-to-r from-[rgba(253,230,138,0.05)] to-transparent border-t-purple/30 border-t-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[15px] font-bold text-cyan">AI Insights</span>
        </div>
        <div className="text-[12.5px] text-textSec leading-relaxed mb-4">
          Consistency improved by 18%. Increase lower body intensity next week to keep strength gains balanced.
        </div>
        <button className="px-4 py-2 rounded-xl border border-borderBase bg-white/5 text-white text-[12.5px] font-bold cursor-pointer hover:bg-white/10 transition-colors">
          See Details
        </button>
      </Card>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-[80px] bg-bg/90 backdrop-blur-xl border-t border-borderBase flex items-center justify-around z-50">
        <div className="flex flex-col items-center gap-1 text-textSec cursor-pointer hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-textSec cursor-pointer hover:text-white transition-colors">
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Workout</span>
        </div>
        <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-purple to-pink flex items-center justify-center text-white shadow-[0_10px_24px_-6px_rgba(245,196,0,0.6)] -mt-6 cursor-pointer hover:scale-105 transition-transform">
          <Activity className="w-6 h-6" />
        </div>
        <div className="flex flex-col items-center gap-1 text-purple bg-purple/10 px-3 py-1.5 rounded-2xl cursor-pointer">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Analytics</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-textSec cursor-pointer hover:text-white transition-colors">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Profile</span>
        </div>
      </div>

    </div>
  );
};
