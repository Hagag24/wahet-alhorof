'use client'

import React, { useState } from 'react'
import { Button, Card, ProgressBar, Badge } from '../DesignSystem'

export function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)

  const students = [
    {
      id: 1,
      name: 'محمد أحمد',
      level: 5,
      progress: 75,
      status: 'excellent',
      lastActivity: 'قبل ساعة',
      stars: 127,
    },
    {
      id: 2,
      name: 'فاطمة علي',
      level: 4,
      progress: 60,
      status: 'good',
      lastActivity: 'قبل يومين',
      stars: 95,
    },
    {
      id: 3,
      name: 'عمر خالد',
      level: 3,
      progress: 45,
      status: 'developing',
      lastActivity: 'قبل 3 أيام',
      stars: 68,
    },
    {
      id: 4,
      name: 'ليلى محمود',
      level: 5,
      progress: 82,
      status: 'excellent',
      lastActivity: 'قبل ساعتين',
      stars: 142,
    },
    {
      id: 5,
      name: 'أحمد سالم',
      level: 2,
      progress: 30,
      status: 'needs-review',
      lastActivity: 'قبل أسبوع',
      stars: 42,
    },
  ]

  const activities = [
    { title: 'تعلم الحروف', icon: '🔤', students: 5 },
    { title: 'لعبة الكلمات', icon: '📖', students: 3 },
    { title: 'الاستماع والتمييز', icon: '👂', students: 4 },
    { title: 'تطابق الصور', icon: '🖼️', students: 2 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-success'
      case 'good':
        return 'bg-primary'
      case 'developing':
        return 'bg-secondary'
      case 'needs-review':
        return 'bg-destructive'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'ممتاز'
      case 'good':
        return 'جيد'
      case 'developing':
        return 'يتطور'
      case 'needs-review':
        return 'يحتاج متابعة'
      default:
        return 'غير معروف'
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            👨‍🏫 لوحة تحكم المعلم
          </h1>
          <p className="text-lg text-muted-foreground">
            إدارة الطلاب والأنشطة التعليمية
          </p>
        </div>
        <Button variant="primary">إضافة طالب +</Button>
      </div>

      {/* Class Selection */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['الصف الأول', 'الصف الثاني', 'الصف الثالث'].map((classroom) => (
          <Button
            key={classroom}
            variant={selectedClass === classroom ? 'primary' : 'secondary'}
            onClick={() => setSelectedClass(classroom)}
          >
            {classroom}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-4 mb-8">
        {/* Stats Cards */}
        <Card color="purple">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-primary">{students.length}</p>
            <p className="font-bold">عدد الطلاب</p>
          </div>
        </Card>

        <Card color="blue">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-secondary">4</p>
            <p className="font-bold">أنشطة نشطة</p>
          </div>
        </Card>

        <Card color="yellow">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-accent">72%</p>
            <p className="font-bold">متوسط التقدم</p>
          </div>
        </Card>

        <Card color="mint">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-accent-mint">23</p>
            <p className="font-bold">ساعات هذا الأسبوع</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Students List */}
        <div className="lg:col-span-2">
          <Card color="blue">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">قائمة الطلاب</h3>
                <input
                  type="text"
                  placeholder="ابحث عن طالب..."
                  className="px-4 py-2 rounded-full border-2 border-primary"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm md:text-base">
                  <thead>
                    <tr className="border-b-2 border-primary">
                      <th className="text-right p-3 font-bold">الاسم</th>
                      <th className="text-right p-3 font-bold">المستوى</th>
                      <th className="text-right p-3 font-bold">التقدم</th>
                      <th className="text-right p-3 font-bold">الحالة</th>
                      <th className="text-right p-3 font-bold">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-gray-200 hover:bg-purple-50"
                      >
                        <td className="p-3 font-bold">{student.name}</td>
                        <td className="p-3 text-center">{student.level}</td>
                        <td className="p-3">
                          <ProgressBar value={student.progress} />
                        </td>
                        <td className="p-3">
                          <Badge
                            status={
                              student.status as
                                | 'completed'
                                | 'locked'
                                | 'new'
                                | 'needs-review'
                            }
                          />
                        </td>
                        <td className="p-3">
                          <Button variant="secondary" size="sm">
                            عرض
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* Activities Panel */}
        <div className="space-y-6">
          <Card color="yellow">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">الأنشطة</h3>

              {activities.map((activity, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-yellow-50 border-2 border-accent transition-all"
                >
                  <span className="text-3xl">{activity.icon}</span>
                  <div className="flex-1 text-right">
                    <p className="font-bold">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.students} طالب
                    </p>
                  </div>
                </button>
              ))}

              <Button variant="primary" size="lg" className="w-full">
                إضافة نشاط +
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Assignment Section */}
      <Card color="pink" className="mb-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">📝 تكليف نشاط جديد</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold block mb-2">اختر الطلاب</label>
              <div className="space-y-2">
                {students.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-2 p-2 hover:bg-pink-100 rounded-lg"
                  >
                    <input type="checkbox" className="w-5 h-5" />
                    <span className="font-bold">{student.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-bold block mb-2">النشاط</label>
                <select className="w-full p-3 rounded-xl border-2 border-primary">
                  <option>اختر نشاطاً...</option>
                  {activities.map((activity) => (
                    <option key={activity.title}>
                      {activity.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-2">المستوى</label>
                <select className="w-full p-3 rounded-xl border-2 border-primary">
                  <option>سهل</option>
                  <option>متوسط</option>
                  <option>صعب</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-2">الموعد النهائي</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-xl border-2 border-primary"
                />
              </div>

              <Button variant="primary" size="lg" className="w-full">
                تكليف الآن
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Reports Section */}
      <Card color="blue">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">📊 التقارير</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="secondary" size="lg" className="w-full">
              تقرير الصف الشامل
            </Button>
            <Button variant="secondary" size="lg" className="w-full">
              تقرير المهارات
            </Button>
            <Button variant="secondary" size="lg" className="w-full">
              نشاط الطلاب
            </Button>
            <Button variant="secondary" size="lg" className="w-full">
              مقارنة الأداء
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
