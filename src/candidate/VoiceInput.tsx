import React, { useState } from 'react';
import { Mic, MicOff, Globe, Loader2 } from 'lucide-react';
import { createVoiceRecognizer, isSpeechRecognitionSupported } from './voiceRecognition';

interface VoiceInputProps {
  onSpeechResult: (text: string) => void;
  label?: string;
  currentValue?: string;
  className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onSpeechResult,
  label = 'Voice Input',
  currentValue = '',
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeRecognizer, setActiveRecognizer] = useState<any | null>(null);

  const isSupported = isSpeechRecognitionSupported();

  const handleToggleListening = () => {
    setErrorMsg(null);
    if (isListening && activeRecognizer) {
      try {
        activeRecognizer.stop();
      } catch (e) {
        console.warn('Error stopping speech:', e);
      }
      setIsListening(false);
      return;
    }

    const recognizer = createVoiceRecognizer({
      lang: selectedLang,
      onResult: (transcriptText) => {
        if (transcriptText) {
          const newText = currentValue ? `${currentValue} ${transcriptText}` : transcriptText;
          onSpeechResult(newText);
        }
      },
      onError: (err) => {
        setErrorMsg(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (recognizer) {
      try {
        recognizer.start();
        setActiveRecognizer(recognizer);
        setIsListening(true);
      } catch (err: any) {
        setErrorMsg(`Mic shuru nahi ho saka: ${err.message || err}`);
        setIsListening(false);
      }
    }
  };

  if (!isSupported) {
    return (
      <span className="text-[11px] text-slate-400 italic">
        (Voice input for Chrome/Android)
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Mic Trigger Button */}
      <button
        type="button"
        onClick={handleToggleListening}
        title={isListening ? 'Stop Mic Recording' : 'Bol kar likhein (Voice Input)'}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
          isListening
            ? 'bg-red-600 text-white animate-pulse-recording ring-2 ring-red-400'
            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 text-white animate-spin" />
            <span>Sun rahe hain...</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-emerald-700" />
            <span>Bolein 🎙️</span>
          </>
        )}
      </button>

      {/* Mic Language Selector dropdown */}
      <div className="relative inline-block">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded py-0.5 px-1.5 focus:outline-none cursor-pointer"
        >
          <option value="hi-IN">Hindi (हिंदी)</option>
          <option value="en-IN">English (अंग्रेजी)</option>
          <option value="pa-IN">Punjabi (ਪੰਜਾਬੀ)</option>
        </select>
      </div>

      {errorMsg && (
        <span className="text-[10px] text-red-500 font-medium">
          {errorMsg}
        </span>
      )}
    </div>
  );
};
