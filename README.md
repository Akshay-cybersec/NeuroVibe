# 🧠 NeuroVibe  
### Feel The Conversation. Touch The Emotion.

NeuroVibe is an AI-powered accessibility platform that converts real-time speech into vibration patterns with emotion-aware haptics — enabling communication through **touch** instead of sound or visuals.

Developed for the Google AI Hackathon, NeuroVibe focuses on delivering **inclusive**, **non-visual**, and **non-audio** communication for Deaf-Blind communities and users in environments where hearing or vision is limited.

---

## 🚨 Problem Statement

Most accessibility solutions translate sign language to text or speech, but fail to communicate back to users who cannot see or hear. Deaf-Blind individuals and users in low-visibility or high-noise environments are excluded from two-way communication, especially in critical situations.

There is a need for an innovative, non-visual, non-audio communication system that enables real-time, intuitive message delivery through touch — ensuring true accessibility, independence, and inclusion.

---

## 💡 Our Solution

Our solution enables real-time, two-way inclusive communication using touch-based feedback. When a user sends audio input, the system converts it into text using speech-to-text processing. Simultaneously, emotion detection analyzes tone and context to identify emotions such as urgency, calm, or distress. The processed text and detected emotion are then translated into structured vibration patterns using haptic encoding.

These vibrations are delivered instantly to the receiver through a wearable or mobile device, allowing them to feel the message and emotional intent in real time, without relying on sight or sound — making communication accessible, intuitive, and effective even in emergency or low-visibility environments.

---

## 🔁 How NeuroVibe Works

1️⃣ Sender speaks using push-to-talk  
2️⃣ Speech is converted to **text → Morse-like haptic code**  
3️⃣ AI analyzes **emotion & urgency**  
4️⃣ Vibrations intensity changes based on emotion  
5️⃣ Receiver **feels** the communication in real-time

✔ Zero dependency on hearing  
✔ No visual interpretation needed  
✔ Works in noise / darkness / emergencies

---

## 🤖 AI Features

- **Sentiment-based emotion detection** (happy / sad / angry / neutral)
- Emotion-to-vibration intensity mapping  
- Offline/on-device processing capability for faster response  

🧩 Emotion Example:
| Emotion | Vibration Strength |
|--------|------------------|
| Angry | High intensity |
| Happy | Medium intensity |
| Sad | Low & slow |
| Neutral | Standard |

---

## 🧩 Tech Stack

| Layer | Tools Used |
|-------|------------|
Frontend | Next.js, TypeScript, Web Speech API, Vibration API |
Backend | FastAPI, WebSocket Real-time Streaming |
Database | Firebase Firestore |
Authentication | Clerk |
AI Models | Sentiment Analysis (ML-based text emotion) |
Hosting | Vercel (frontend), Render (backend) |

---

## 🔐 Privacy & Connectivity

- Temporary **room codes** for session joining  
- WebSockets enable **low-latency communication**
- Supports secure QR-based connection sharing
- 🔜 End-to-End Encryption for full privacy

---

## 🎥 Demo Capabilities

- Start a live room as sender  
- Receiver connects via link / QR  
- Live speech → haptic feedback  
- Emotion-based vibration change visible & felt  

> *“Communication you can feel — even in silence.”*

---

## 🌍 Impact & Use Cases

- Deaf-Blind accessibility assistance
- Emergency communication in dark/noisy areas
- Silent mode communication in hospitals, defense
- Assistive wearable interaction systems

---

## 📌 Future Enhancements

| Feature | Impact |
|--------|--------|
Wearable haptic bands | More natural touch perception |
Custom emotion profiles | Personalized feedback |
Secure E2EE mode | Trusted communication |
Bidirectional AI translation | Touch → speech/text mapping |

---

## 👥 Team

Built with ❤️ to empower accessibility and inclusivity through technology.

---

## 🏁 Conclusion

NeuroVibe bridges the sensory gap between sound and touch.  
With AI-driven vibration feedback, communication becomes a **felt experience**, enabling everyone to stay connected beyond the limits of sight or sound.  
Silence now has meaning you can feel.
