# PresentPro

## Inspiration
Public speaking is a critical skill, yet many people struggle with it due to lack of real-time feedback and practice opportunities. We were inspired to create PresentPro after observing how speakers often unknowingly fall into patterns of speaking too fast, using filler words, or maintaining inconsistent pacing. Our goal was to create a tool that provides immediate, tactile feedback to help speakers improve in real-time.

## What it does
PresentPro is an innovative presentation practice platform that combines real-time speech analysis with haptic feedback:
- **Real-time Speech Analysis**: Monitors speaking pace (WPM) and provides instant feedback
- **Haptic Feedback System**: Sends vibration alerts through an IoT device when speaking too fast (>160 WPM)
- **Practice Mode**: Allows users to rehearse presentations with live feedback
- **Analytics Dashboard**: Tracks performance metrics and improvement over time
- **Preparation Tools**: Helps users organize and structure their content

## How we built it
- **Frontend**: React with TypeScript for a responsive, type-safe UI
- **Real-time Communication**: WebSocket connections for instant speech processing and IoT device control
- **Speech Processing**: Browser's MediaRecorder API for high-quality audio capture
- **IoT Integration**: Custom WebSocket protocol for controlling vibration feedback
- **UI Framework**: Tailwind CSS for modern, responsive design
- **State Management**: React hooks for efficient state handling

## Challenges we ran into
1. **WebSocket Stability**: Ensuring reliable connections between the web app and IoT device
2. **Speech Processing Accuracy**: Fine-tuning the WPM calculation for accurate speed detection
3. **Latency Management**: Minimizing delay between speech detection and haptic feedback
4. **IoT Device Integration**: Developing a robust protocol for device communication
5. **Real-time Performance**: Optimizing the application for smooth performance during long practice sessions

## Accomplishments that we're proud of
- Successfully implemented real-time haptic feedback system
- Created an intuitive and responsive user interface
- Developed accurate speech pace monitoring
- Built a scalable architecture that can support additional features
- Achieved seamless integration between web app and IoT device

## What we learned
- WebSocket management for real-time applications
- Speech processing and analysis techniques
- IoT device integration best practices
- Real-time feedback systems design
- User experience optimization for learning tools

## What's next for PresentPro
1. **Advanced Analytics**: Deeper insights into speaking patterns and improvement trends
2. **AI-Powered Feedback**: Machine learning for content analysis and suggestions
3. **Multiple Feedback Types**: Additional haptic patterns for different speaking issues
4. **Collaborative Features**: Allow coaches or peers to provide feedback
5. **Mobile App**: Native mobile application for more convenient practice sessions
6. **Expanded IoT Support**: Integration with more wearable devices
7. **Custom Practice Modes**: Tailored exercises for different presentation styles
