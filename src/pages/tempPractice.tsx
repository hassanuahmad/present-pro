import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square } from "lucide-react";
import { RealtimeTranscriber } from "assemblyai/streaming";
import RecordRTC from "recordrtc";

const SAMPLE_RATE = 16000;

export default function Home() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
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
        <Card className="max-w-md mx-auto mt-10 p-4 shadow-lg">
            <CardHeader>
                <CardTitle>Real-Time Transcription</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4">
                    Click start to begin recording!
                </p>
                <Button onClick={isRecording ? endTranscription : startTranscription} variant="outline" className="flex items-center gap-2">
                    {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                <div className="mt-4 p-2 bg-gray-100 rounded-md min-h-[100px]">
                    {transcript || "Your transcription will appear here..."}
                </div>
            </CardContent>
        </Card>
    );
}
