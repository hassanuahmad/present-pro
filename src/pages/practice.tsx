import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, RefreshCw } from "lucide-react"
import { RealtimeTranscriber } from "assemblyai/streaming"
import RecordRTC from "recordrtc"

const fillerWords = ["um", "uh", "like", "you know", "actually", "basically", "literally"]

const SAMPLE_RATE = 16000;

export default function LivePracticeMode() {
  const wsRef = useRef<WebSocket | null>(null);
  let theme = "dark"
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [fillerCount, setFillerCount] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const transcriptRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcriptRef.current]) //Corrected dependency

  const resetPractice = () => {
      // Close WebSocket connection if it exists
      if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
      }
    setTranscript("")
    setFillerCount(0)
    setIsRecording(false)
    setCurrentWord("")
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const realtimeTranscriber = useRef<RealtimeTranscriber | null>(null);
  const recorder = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const getToken = async () => {
      const response = await fetch(`http://${import.meta.env.VITE_ENDPOINT_URL}/token`);
      const data = await response.json();
      if (data.error) {
          alert(data.error);
      }
      return data.token;
  };

  const startTranscription = async () => {
      // Initialize WebSocket connection first
      wsRef.current = new WebSocket(`ws://${import.meta.env.VITE_ENDPOINT_URL}/microphone`);
      
      wsRef.current.onopen = () => {
          console.log('WebSocket Connected');
      };
      
      wsRef.current.onerror = (error) => {
          console.error('WebSocket Error:', error);
      };
      
      wsRef.current.onclose = () => {
          console.log('WebSocket Connection Closed');
      };

      // Wait for WebSocket to connect
      await new Promise<void>((resolve) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
              resolve();
          } else {
              wsRef.current!.addEventListener('open', () => resolve());
          }
      });

      try {
          console.log('Setting up MediaRecorder...');
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorderRef.current = new MediaRecorder(stream, {
              mimeType: 'audio/webm;codecs=opus',
              audioBitsPerSecond: 16000
          });

          mediaRecorderRef.current.ondataavailable = async (event) => {
              if (event.data.size > 0) {
                  chunksRef.current.push(event.data);
                  console.log('Got audio chunk, size:', event.data.size);
                  
                  // Send to your backend
                  if (wsRef.current?.readyState === WebSocket.OPEN) {
                      wsRef.current.send(event.data);
                      console.log('Sent audio chunk to server');
                  } else {
                      console.warn('WebSocket not open, state:', wsRef.current?.readyState);
                  }
              }
          };

          console.log('Starting MediaRecorder...');
          mediaRecorderRef.current.start(1000); // Send chunks every 1 second
      } catch (error) {
          console.error("Error setting up MediaRecorder:", error);
      }

      wsRef.current.onmessage = (event) => {
          console.log('Received from server:', event.data);
          try {
              const data = JSON.parse(event.data);
              console.log('Parsed server data:', data);
          } catch (error) {
              console.log('Raw server data:', event.data);
          }
      };
      realtimeTranscriber.current = new RealtimeTranscriber({
          token: await getToken(),
          sampleRate: SAMPLE_RATE,
      });

      const texts: Record<number, string> = {};
      realtimeTranscriber.current.on("transcript", (transcript) => {

          let msg = '';
          texts[transcript.audio_start] = transcript.text;
          const keys = Object.keys(texts);
          keys.sort((a, b) => Number(a) - Number(b));
          for (const key of keys) {
              if (texts[Number(key)]) {
                  msg += ` ${texts[Number(key)]}`;
                  console.log(msg);
              }
          }
          
          // Count filler words in the new transcript
          const words = msg.toLowerCase().split(/\s+/);
          const fillerWordCount = words.filter(word => fillerWords.includes(word)).length;
          setFillerCount(fillerWordCount);
          setTranscript(msg);
      });

      realtimeTranscriber.current.on("error", (event) => {
          console.error(event);
          realtimeTranscriber.current?.close();
          realtimeTranscriber.current = null;
      });

      realtimeTranscriber.current.on("close", (code, reason) => {
          console.log(`Connection closed: ${code} ${reason}`);
          realtimeTranscriber.current = null;
      });

      await realtimeTranscriber.current.connect();

      // Set up stream for AssemblyAI transcription
      navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
              // Recorder for AssemblyAI
              recorder.current = new RecordRTC(stream, {
                  type: 'audio',
                  mimeType: 'audio/webm;codecs=pcm',
                  recorderType: RecordRTC.StereoAudioRecorder,
                  timeSlice: 250,
                  desiredSampRate: 16000,
                  numberOfAudioChannels: 1,
                  bufferSize: 4096,
                  audioBitsPerSecond: 128000,
                  ondataavailable: async (blob: any) => {
                      if (!realtimeTranscriber.current) return;
                      const buffer = await blob.arrayBuffer();
                      realtimeTranscriber.current.sendAudio(buffer);
                  },
              });
              
              recorder.current.startRecording();
          })
          .catch((err) => console.error(err));

      setIsRecording(true);
  };

  const endTranscription = async () => {
      // Stop MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          chunksRef.current = [];
          mediaRecorderRef.current = null;
      }
      // Close WebSocket connection
      if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
      }
      setIsRecording(false);
      await realtimeTranscriber.current?.close();
      realtimeTranscriber.current = null;
      recorder.current?.pauseRecording();
      recorder.current = null;
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-teal-900 text-gray-200"
          : "bg-gradient-to-br from-gray-100 via-teal-50 to-cyan-100 text-gray-800"
      } p-6`}
    >
      <Card className={`max-w-4xl mx-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <CardHeader>
          <CardTitle
            className={`text-2xl font-bold text-center ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
          >
            Live Practice Mode v31
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            {/* <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "default"}>
              {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button> */}
            <Button onClick={isRecording ? endTranscription : startTranscription} variant="outline" className="flex items-center gap-2">
                    {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
            <div className="text-lg font-semibold">
              Filler Words: <span className="text-red-500">{fillerCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* <ThemeToggle /> */}
              {/* <Button onClick={() => toggleTheme()} variant="outline" size="sm">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button> */}
              <Button onClick={resetPractice} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
          <div
            className={`mb-4 h-16 flex items-center justify-center rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-blue-50"
            }`}
          >
            <span className={`text-4xl font-bold ${theme === "dark" ? "text-blue-300" : "text-blue-500"}`}>
              {currentWord}
            </span>
          </div>
          <div
            ref={transcriptRef}
            className={`p-4 rounded-lg h-64 overflow-y-auto ${
              theme === "dark" ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            {transcript ? transcript.split(/\s+/).map((word, index) => (
              <span
                key={index}
                className={`${fillerWords.includes(word.toLowerCase()) ? 'text-red-500 font-semibold' : ''} mr-1`}
              >
                {word}
              </span>
            )) : "Transcript will appear here"}
            {/* {transcript.split(" ").map((word, index) => (
              <span
                key={index}
                className={
                  fillerWords.includes(word.toLowerCase())
                    ? theme === "dark"
                      ? "text-red-400 font-bold"
                      : "text-red-600 font-bold"
                    : theme === "dark"
                      ? "text-gray-300"
                      : "text-gray-800"
                }
              >
                {word}{" "}
              </span>
            ))} */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

