import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const VoiceToText = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  useEffect(() => {
    // 1. التأكد من دعم المتصفح
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // الاستمرار في التسجيل وعدم التوقف بعد جملة واحدة
      recognition.lang = "ar-EG"; // اللغة العربية (لهجة مصرية)، يمكنك تغييرها لـ ar-SA
      recognition.interimResults = true; // إظهار الكلام أثناء نطقه قبل اكتمال الجملة

      recognition.onresult = (event) => {
        // تحويل النتائج الصوتية إلى نص
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        setText(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    } else {
      toast.error(
        "عذراً، متصفحك لا يدعم تحويل الصوت لنص. يرجى استخدام Google Chrome."
      );
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      speechRecognition.start();
      setIsListening(true);
      setText(""); // مسح النص القديم عند بدء تسجيل جديد
    }
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <button
        onClick={toggleListening}
        className={`px-6 py-2 rounded-full font-bold text-white transition-all ${
          isListening
            ? "bg-red-500 animate-pulse"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isListening ? "⏹️ إيقاف التسجيل" : "🎙️ ابدأ التحدث"}
      </button>

      <div
        className="w-full max-w-lg p-4 border rounded-lg bg-gray-50 min-h-[100px] text-right"
        dir="rtl"
      >
        {text || <span className="text-gray-400">النص سيظهر هنا...</span>}
      </div>
    </div>
  );
};

export default VoiceToText;
