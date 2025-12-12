import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic,
  Square,
  Play,
  Pause,
  Share2,
  Download,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

const QuranRecitation = ({ surah = "" }) => {
  const [isListening, setIsListening] = useState(false);

  // Audio States
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [mimeType, setMimeType] = useState("");

  const getSupportedMimeType = () => {
    const types = [
      "audio/mp4",
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg",
      "audio/aac",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "";
  };

  useEffect(() => {
    setMimeType(getSupportedMimeType());
    return () => stopEverything();
  }, []);

  const stopEverything = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      setAudioUrl(null);
      setAudioBlob(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = mimeType ? { mimeType } : {};

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      toast.info("بدأ التسجيل...");
    } catch (err) {
      console.error(err);
      toast.error("لا يمكن الوصول للميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsListening(false);
    toast.success("تم الانتهاء");
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          toast.error("فشل تشغيل الصوت");
          setIsPlaying(false);
        });
    }
  };

  // --- دوال التحميل والمشاركة المعدلة ---

  // دالة مساعدة لتوليد اسم الملف مع التاريخ
  const getFilename = (ext) => {
    const now = new Date();

    const hour = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    // التنسيق النهائي: Day-Month_Hour-Min
    // مثال: recitation-12-05_14-30.m4a
    const timestamp = `${hour}-${min}`;
    return `تلاوة-${surah}-${timestamp}.${ext}`;
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;

    // تحديد الامتداد وتوليد الاسم
    const extension = mimeType.includes("mp4") ? "m4a" : "webm";
    a.download = getFilename(extension);

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("تم بدء التحميل");
  };

  const handleShare = async () => {
    if (!audioBlob) return;

    const extension = mimeType.includes("mp4") ? "m4a" : "webm";
    const filename = getFilename(extension);

    // إنشاء ملف باسم مميز
    const file = new File([audioBlob], filename, { type: mimeType });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "تلاوة قرآنية",
          text: "استمع إلى تلاوتي",
        });
        toast.success("تمت المشاركة بنجاح");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast.error("المشاركة غير مدعومة، سيتم التحميل بدلاً منها.");
      handleDownload();
    }
  };

  return (
    <div className="w-full mt-6 flex flex-col items-center gap-6">
      {/* أزرار التحكم بالتسجيل */}
      <div className="flex items-center justify-center gap-4 py-2">
        {!isListening && !audioUrl ? (
          <Button
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-primary hover:scale-110 transition-all shadow-xl border-4 border-primary/10"
            title="اضغط للبدء"
          >
            <Mic className="w-10 h-10" />
          </Button>
        ) : isListening ? (
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></span>
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="relative w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-xl z-10"
              title="إيقاف"
            >
              <Square className="w-8 h-8 fill-current" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={startRecording}
            variant="outline"
            className="w-14 h-14 rounded-full border-2"
            title="تسجيل جديد"
          >
            <RotateCcw className="w-6 h-6 text-muted-foreground" />
          </Button>
        )}
      </div>

      {/* المشغل وأزرار المشاركة */}
      {audioUrl && !isListening && (
        <div className="w-full max-w-sm bg-card border rounded-xl p-4 shadow-sm animate-in slide-in-from-bottom-2">
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            playsInline
            className="hidden"
          />

          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <Button
                onClick={togglePlayback}
                className="w-full rounded-full h-12 text-lg gap-2"
                variant={isPlaying ? "secondary" : "default"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
                {isPlaying ? "إيقاف مؤقت" : "استماع للتلاوة"}
              </Button>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary"
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </Button>

              <Button
                onClick={handleDownload}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                title="تحميل"
              >
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranRecitation;
