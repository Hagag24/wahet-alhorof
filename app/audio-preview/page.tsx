"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Music, BookOpen, CheckCircle, AlertCircle, User, UserCheck } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";

interface AudioFile {
  id: string;
  kind: string;
  group: string;
  fileName: string;
  path: string;
  text: string;
  ttsText: string;
  voice?: string;
}

export default function AudioPreviewPage() {
  const [manifest, setManifest] = useState<{ files: AudioFile[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const { speak, stop, isSpeaking } = useTTS();
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/audio-manifest.json")
      .then((res) => res.json())
      .then((data) => {
        setManifest(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load manifest:", err);
        setLoading(false);
      });
  }, []);

  const handlePlay = (file: AudioFile) => {
    if (playingId === file.id && isSpeaking) {
      stop();
      setPlayingId(null);
    } else {
      setPlayingId(file.id);
      const audioPath = "/" + file.path.replace(/^public\//, "");
      speak(file.text, audioPath);
    }
  };

  if (loading) {
    return <div className="p-8 text-center" dir="rtl">جاري تحميل البيانات...</div>;
  }

  if (!manifest) {
    return (
      <div className="p-8 text-center text-destructive flex flex-col items-center gap-4" dir="rtl">
        <AlertCircle className="w-12 h-12" />
        <p>فشل تحميل ملف manifest.json</p>
      </div>
    );
  }

  const words = manifest.files.filter((f) => f.kind === "word");
  const stories = manifest.files.filter((f) => f.kind === "storyScene");
  const games = manifest.files.filter((f) => f.kind === "gameText");

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">مستعرض الصوتيات النهائي</h1>
          <p className="text-slate-500 text-lg">تحقق من جودة ومحتوى الملفات الصوتية المعدلة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Words Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">الكلمات ({words.length})</h2>
            </div>
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {words.map((file) => (
                    <Button
                      key={file.id}
                      variant={playingId === file.id && isSpeaking ? "default" : "outline"}
                      className="justify-start gap-2 h-auto py-3 px-4 transition-all hover:scale-105"
                      onClick={() => handlePlay(file)}
                    >
                      {playingId === file.id && isSpeaking ? (
                        <Pause className="w-4 h-4 shrink-0" />
                      ) : (
                        <Play className="w-4 h-4 shrink-0" />
                      )}
                      <div className="flex flex-col items-start overflow-hidden text-right">
                        <span className="truncate font-medium">{file.text}</span>
                        {file.voice && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {file.voice.split('-')[2]}
                          </span>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Stories Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold">القصص ({stories.length})</h2>
            </div>
            <div className="space-y-3">
              {stories.map((file) => (
                <Card key={file.id} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex items-center p-4 gap-4">
                    <Button
                      size="icon"
                      variant={playingId === file.id && isSpeaking ? "default" : "secondary"}
                      className="shrink-0 w-12 h-12 rounded-full"
                      onClick={() => handlePlay(file)}
                    >
                      {playingId === file.id && isSpeaking ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </Button>
                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 rounded-full uppercase tracking-wider text-slate-500">
                          {file.group}
                        </span>
                        {file.voice && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono flex items-center gap-1 ${
                            file.voice.includes('Salma') ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'
                          }`}>
                            {file.voice.includes('Salma') ? <User className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                            {file.voice.split('-')[2]}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">{file.text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-4" dir="rtl">
          <div className="bg-emerald-500 p-2 rounded-full text-white">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900">اكتمال العملية</h3>
            <p className="text-emerald-700">تم تحديث النصوص بالكامل وتخصيص الأصوات (سلمى للمؤنث وشاكر للمذكر) بنجاح.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
