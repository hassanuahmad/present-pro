import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, RefreshCw } from "lucide-react"
import { RealtimeTranscriber } from "assemblyai/streaming"
import RecordRTC from "recordrtc"

const fillerWords = ["um", "uh", "like", "you know", "actually", "basically", "literally"]

const SAMPLE_RATE = 16000;

export default function LivePracticeMode() {
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

  const getToken = async () => {
      const response = await fetch("http://172.105.22.222:8000/token");
      const data = await response.json();
      if (data.error) {
          alert(data.error);
      }
      return data.token;
  };

  const startTranscription = async () => {
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

      navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
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

