"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Users, 
  BookOpen, 
  Star, 
  TrendingUp,
  Download,
  Filter,
  Search,
  MoreVertical,
  Award,
  Clock,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { lessons } from "@/data/lessons";

interface Student {
  id: string;
  name: string;
  avatar: string;
  completedLessons: number;
  totalStars: number;
  lastActive: string;
  level: string;
}

interface TeacherDashboardProps {
  onBack: () => void;
}

export function TeacherDashboard({ onBack }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<"students" | "lessons" | "reports">("students");
  
  // Mock students data
  const students: Student[] = [
    { id: "1", name: "أحمد محمد", avatar: "A", completedLessons: 8, totalStars: 20, lastActive: "منذ ساعة", level: "متقدم" },
    { id: "2", name: "فاطمة علي", avatar: "F", completedLessons: 12, totalStars: 32, lastActive: "منذ يومين", level: "متقدم" },
    { id: "3", name: "عمر خالد", avatar: "O", completedLessons: 5, totalStars: 12, lastActive: "اليوم", level: "مبتدئ" },
    { id: "4", name: "مريم أحمد", avatar: "M", completedLessons: 10, totalStars: 28, lastActive: "منذ 3 أيام", level: "متوسط" },
    { id: "5", name: "يوسف سعيد", avatar: "Y", completedLessons: 3, totalStars: 7, lastActive: "منذ أسبوع", level: "مبتدئ" },
    { id: "6", name: "نور حسن", avatar: "N", completedLessons: 15, totalStars: 42, lastActive: "اليوم", level: "متقدم" },
  ];

  const totalLessons = lessons.length;

  const classStats = {
    totalStudents: students.length,
    averageProgress: Math.round(students.reduce((sum, s) => sum + (s.completedLessons / totalLessons) * 100, 0) / students.length),
    totalLessonsCompleted: students.reduce((sum, s) => sum + s.completedLessons, 0),
    activeToday: students.filter(s => s.lastActive === "اليوم" || s.lastActive === "منذ ساعة").length,
  };

  const lessonStats = lessons.map(lesson => ({
    ...lesson,
    completedBy: Math.floor(Math.random() * students.length) + 1,
    averageStars: (Math.random() * 2 + 1).toFixed(1),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">لوحة المعلم</h1>
              <p className="text-sm text-muted-foreground">إدارة ومتابعة تقدم الطلاب</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              تصدير التقارير
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {[
            { id: "students", label: "الطلاب", icon: Users },
            { id: "lessons", label: "الدروس", icon: BookOpen },
            { id: "reports", label: "التقارير", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Class Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{classStats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">إجمالي الطلاب</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{classStats.averageProgress}%</p>
                <p className="text-xs text-muted-foreground">متوسط التقدم</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{classStats.totalLessonsCompleted}</p>
                <p className="text-xs text-muted-foreground">دروس مكتملة</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{classStats.activeToday}</p>
                <p className="text-xs text-muted-foreground">نشط اليوم</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {activeTab === "students" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>قائمة الطلاب</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="بحث..."
                      className="pl-4 pr-10 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    تصفية
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">الطالب</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">المستوى</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">التقدم</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">النجوم</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">آخر نشاط</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                              {student.avatar}
                            </div>
                            <span className="font-medium text-foreground">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            student.level === "متقدم" ? "bg-primary/20 text-primary" :
                            student.level === "متوسط" ? "bg-secondary/20 text-secondary-foreground" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {student.level}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24">
                              <ProgressBar progress={(student.completedLessons / totalLessons) * 100} height="sm" showLabel={false} />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {student.completedLessons}/{totalLessons}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span className="text-foreground">{student.totalStars}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{student.lastActive}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "lessons" && (
          <Card>
            <CardHeader>
              <CardTitle>تحليل الدروس</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lessonStats.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-bold text-foreground">{lesson.completedBy}</p>
                        <p className="text-xs text-muted-foreground">أكملوه</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span className="font-bold text-foreground">{lesson.averageStars}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">متوسط</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "reports" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  أفضل الطلاب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students
                    .sort((a, b) => b.totalStars - a.totalStars)
                    .slice(0, 5)
                    .map((student, index) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? "bg-accent text-accent-foreground" :
                          index === 1 ? "bg-secondary text-secondary-foreground" :
                          index === 2 ? "bg-primary text-primary-foreground" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{student.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span className="font-bold text-foreground">{student.totalStars}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  الطلاب الذين يحتاجون دعم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students
                    .filter(s => s.completedLessons < 5)
                    .map((student) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {student.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">أكمل {student.completedLessons} دروس فقط</p>
                        </div>
                        <Button variant="outline" size="sm">تواصل</Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
