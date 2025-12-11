import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Trash2, Copy, Info, Play, Pause } from "lucide-react";
import { toast } from "sonner";

const QuranRecitation = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Audio Recording States
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // متغير لتخزين نوع الملف المدعوم
  const [mimeType, setMimeType] = useState("");

  // 1. دالة لاكتشاف الصيغة المدعومة في جهاز المستخدم
  const getSupportedMimeType = () => {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4", // الآيفون بيحب ده
      "audio/ogg",
      "audio/aac",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return ""; // لو معرفش يحدد، هيستخدم الافتراضي
  };
  const stopEverything = () => {
    if (recognitionRef.current) recognitionRef.current.abort();
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setIsPlaying(false);
  };

  useEffect(() => {
    // تحديد الصيغة عند تحميل الصفحة
    setMimeType(getSupportedMimeType());

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "ar-SA";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setText(transcript);
      };

      recognition.onerror = (event) => {
        // نتجاهل خطأ عدم السماح لو المستخدم لسه مابدأش
        if (event.error === "not-allowed" && isListening) {
          toast.error("يرجى السماح بالوصول للميكروفون");
          stopEverything();
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      stopEverything();
    };
  }, []); // eslint-disable-line

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // استخدام الصيغة المكتشفة
      const options = mimeType ? { mimeType } : {};
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        // إنشاء ملف بالصيغة الصحيحة
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();

      if (recognitionRef.current) {
        setText("");
        setAudioUrl(null);
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log(e);
        }
      }

      setIsListening(true);
      toast.info("بدأ التسجيل...");
    } catch (err) {
      toast.error("Error accessing microphone:", err);
      toast.error("لا يمكن الوصول للميكروفون، تأكد من إعدادات Safari");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsListening(false);
    toast.success("تم الحفظ، يمكنك الاستماع والمراجعة");
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // إعادة التشغيل من البداية لو كان خلصان
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
      }

      // التعامل مع Promise التشغيل (Safari بيحتاج ده)
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Playback failed:", error);
            toast.error("فشل تشغيل الصوت");
            setIsPlaying(false);
          });
      }
    }
  };

  // const handleClear = () => {
  //   setText("");
  //   setAudioUrl(null);
  //   setIsPlaying(false);
  //   toast.success("تم الحذف");
  // };

  return (
    <div className="w-full mt-6 flex flex-col items-center gap-6">
      <div className="flex items-center justify-center gap-4 py-2">
        {!isListening ? (
          <Button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-primary hover:scale-110 transition-all shadow-xl border-4 border-primary/10"
            title="اضغط للبدء"
          >
            <Mic className="w-8 h-8" />
          </Button>
        ) : (
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></span>
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="relative w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-xl z-10"
              title="إيقاف وحفظ"
            >
              <Square className="w-6 h-6 fill-current" />
            </Button>
          </div>
        )}
      </div>

      {audioUrl && !isListening && (
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          {/* خاصية playsInline مهمة جدا للآيفون */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            playsInline
            className="hidden"
          />

          <Button
            onClick={togglePlayback}
            variant={isPlaying ? "secondary" : "default"}
            className="rounded-full gap-2 px-6 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? "إيقاف مؤقت" : "استماع لتسجيلك"}
          </Button>
        </div>
      )}

      {/* <Card className="w-full relative min-h-[160px] p-6 bg-slate-50/50 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center transition-all">
        {text ? (
          <div className="w-full space-y-4">
            <p
              className="text-xl md:text-2xl leading-[2] font-quran text-foreground animate-in fade-in zoom-in-95 duration-300"
              dir="rtl"
            >
              {text}
            </p>
          </div>
        ) : (
          <div className="text-muted-foreground/50 text-sm flex flex-col items-center gap-2">
            {isListening ? (
              <span className="animate-pulse">جاري التسجيل والكتابة...</span>
            ) : (
              <span>اضغط الميكروفون واقرأ الآية...</span>
            )}
          </div>
        )}

        {text && !isListening && (
          <div className="absolute top-2 left-2 flex gap-1 bg-background/80 p-1 rounded-lg border shadow-sm backdrop-blur-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                navigator.clipboard.writeText(text);
                toast.success("تم النسخ");
              }}
              title="نسخ"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:bg-red-50"
              onClick={handleClear}
              title="مسح"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card> */}

      <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg border border-border/50 text-xs text-muted-foreground max-w-sm text-center">
        <Info className="w-4 h-4 shrink-0 text-primary/70" />
        <p>أداة للمراجعة الذاتية، التسجيل يحذف بمجرد تحديث الصفحة.</p>
      </div>
    </div>
  );
};

export default QuranRecitation;
