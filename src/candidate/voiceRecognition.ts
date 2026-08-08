// TypeScript declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoiceRecognitionOptions {
  lang?: string;
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createVoiceRecognizer(options: VoiceRecognitionOptions) {
  if (!isSpeechRecognitionSupported()) {
    if (options.onError) {
      options.onError('Aapke browser me Mic Voice Input supports nahi hai. Kripya type karein.');
    }
    return null;
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = options.lang || 'hi-IN'; // Default Hindi (India)

  let finalTranscript = '';

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    const combined = finalTranscript || interimTranscript;
    options.onResult(combined);
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition error:', event.error);
    if (options.onError) {
      options.onError(`Awaaz sun-ne me samasya: ${event.error}`);
    }
  };

  recognition.onend = () => {
    if (options.onEnd) {
      options.onEnd();
    }
  };

  return recognition;
}
