"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BarChart3, 
  Clock, 
  Star, 
  Trophy, 
  BookOpen,
  Target,
  TrendingUp,
  Settings,
  User,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { useGameProgress } from "@/hooks/use-game-progress";
import { lessons } from "@/data/lessons";

interface ParentDashboardProps {
  onBack: () => void;
}

export function ParentDashboard({ onBack }: ParentDashboardProps) {
  const { progress, overallProgress, getEarnedBadges, totalStars, completedLessons } = useGameProgress();
  const [activeTab, setActiveTab] = useState<"overview" | "progress" | "settings">("overview");
  
  const totalLessons = lessons.length;
  const earnedBadges = getEarnedBadges();
  
  // Mock data for demonstration
  const weeklyActivity = [
    { day: "السبت", minutes: 25 },
    { day: "الأحد", minutes: 30 },
    { day: "الاثنين", minutes: 15 },
    { day: "الثلاثاء", minutes: 40 },
    { day: "الأربعاء", minutes: 20 },
    { day: "الخميس", minutes: 35 },
    { day: "الجمعة", minutes: 0 },
  ];
  
  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes));
  const totalMinutesThisWeek = weeklyActivity.reduce((sum, d) => sum + d.minutes, 0);

  const recentAchievements = [
    { title: "أكمل 5 دروس", date: "منذ يومين", icon: BookOpen },
    { title: "حصل على 15 نجمة", date: "منذ 3 أيام", icon: Star },
    { title: "تعلم 10 كلمات جديدة", date: "منذ أسبوع", icon: Target },
  ];

  const skillsProgress = [
    { name: "تمييز الأصوات", progress: 75, color: "bg-primary" },
    { name: "تقطيع المقاطع", progress: 60, color: "bg-secondary" },
    { name: "السجع والتشابه", progress: 45, color: "bg-accent" },
    { name: "بناء الكلمات", progress: 30, color: "bg-primary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">لوحة الأهل</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {[
            { id: "overview", label: "نظرة عامة" },
            { id: "progress", label: "التقدم التفصيلي" },
            { id: "settings", label: "الإعدادات" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Child Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-foreground">طالب</h2>
                    <p className="text-sm text-muted-foreground">المستوى: 1</p>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-primary">{totalStars}</p>
                    <p className="text-xs text-muted-foreground">نجمة</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{completedLessons}</p>
                    <p className="text-xs text-muted-foreground">دروس مكتملة</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{totalStars}</p>
                    <p className="text-xs text-muted-foreground">نجوم محصلة</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{earnedBadges.length}</p>
                    <p className="text-xs text-muted-foreground">مكافآت</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{totalMinutesThisWeek}</p>
                    <p className="text-xs text-muted-foreground">دقيقة هذا الأسبوع</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  النشاط الأسبوعي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-2 h-40">
                  {weeklyActivity.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div 
                        className="w-full bg-primary rounded-t-lg min-h-[4px]"
                        style={{ height: `${Math.max((day.minutes / maxMinutes) * 100, 5)}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{day.day}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Skills Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    تقدم المهارات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillsProgress.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.progress}%</span>
                      </div>
                      <ProgressBar progress={skill.progress} color={skill.color} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    الإنجازات الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <achievement.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  التقدم الكلي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{completedLessons} من {totalLessons} درس</span>
                    <span className="text-muted-foreground">{overallProgress}%</span>
                  </div>
                  <ProgressBar progress={overallProgress} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>التقدم في كل درس</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons.map((lesson, index) => {
                    const lessonProgress = progress[lesson.id];
                    const isCompleted = lessonProgress?.completed;
                    const stars = lessonProgress?.stars || 0;
                    
                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">{lesson.description}</p>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= stars ? "text-accent fill-accent" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات التطبيق</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">تفعيل الصوت</h3>
                    <p className="text-sm text-muted-foreground">تشغيل المؤثرات الصوتية</p>
                  </div>
                  <Button variant="outline" size="sm">مفعل</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">الإشعارات</h3>
                    <p className="text-sm text-muted-foreground">تنبيهات التقدم والإنجازات</p>
                  </div>
                  <Button variant="outline" size="sm">مفعل</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">وقت اللعب اليومي</h3>
                    <p className="text-sm text-muted-foreground">الحد الأقصى للعب اليومي</p>
                  </div>
                  <Button variant="outline" size="sm">30 دقيقة</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
