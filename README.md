# 🧠 NeuroVibe  
### Feel the Conversation.

NeuroVibe is an AI-powered accessibility application that converts real-time speech into intelligent haptic (vibration) patterns, enabling deaf and hard-of-hearing users to feel conversations instead of hearing them.

Built for a Google AI Hackathon, NeuroVibe explores how artificial intelligence and haptics can create an alternative communication layer using touch.

---

## 🚀 Problem Statement

Traditional voice communication is inaccessible to deaf and hard-of-hearing individuals. While text-based solutions exist, they often fail in real-time, emotional, or urgent conversations.

There is a lack of solutions that:  
- Work in real time  
- Preserve speech intensity and emotion  
- Do not rely solely on text  

---

## 💡 Our Solution

NeuroVibe translates live speech into a tactile language using AI-driven audio analysis and haptic feedback.

Instead of playing audio on the receiver’s device, NeuroVibe converts speech features such as loudness, emphasis, and emotion into vibration patterns that users can feel instantly.

---

## 🌟 Key Highlights

- Real-time vibration synced with speech  
- Emotion-preserved haptic patterns  
- No text dependency  
- Secure, code-based communication  
- Low network dependency  

NeuroVibe converts *human expression into touch*, enabling intuitive communication.

---

## 🧪 How to Run (Deployed Version)

Follow these steps to test NeuroVibe live:

1. Open the NeuroVibe Web App  
   https://neuro-vibe-psi.vercel.app

2. Wake up the backend (free-tier hosting sleeps when idle)  
   https://neurovibe.onrender.com/  
   You should see: NeuroVibe backend running status  
   (Refresh once if needed)

3. Return to the Web App → Open *Dashboard*

4. Click *Create Session* and choose your *Role* (Sender / Receiver)

5. Copy the generated *Session Code*  
   - Open the app on an *Android device* as Receiver  
   - Join using the same session code  
   ⚠️ Vibration currently works *only on Android*

6. Sender uses *push-to-talk* for audio  
   - Desktop → Hold *Spacebar*  
   - Mobile → Hold *Mic Button*

7. After testing → Click *Exit Session* to disconnect

---

## 🔁 How It Works

1. Speech captured from sender  
2. Live audio streaming via WebSockets  
3. AI analyzes speech characteristics  
4. Mapped dynamically to vibration patterns  
5. Receiver feels the conversation in real time  

---

## 🤖 AI Integration

AI interprets speech instead of fixed rules.

### Capabilities:
- Speech feature extraction (amplitude, pitch, emotion)
- Intelligent haptic transformation
- Adaptive vibration mapping

### Google AI Tools:
- ML Kit (on-device processing)
- Google Speech-to-Text (optional)
- Firebase for pairing & signaling

---

## 🧩 Tech Stack

*Frontend*  
React Native + Native Haptic APIs  

*Backend*  
FastAPI + WebSockets  

*AI*  
Google ML Kit + Custom mapping logic  

*Deployment*  
Vercel (Frontend)  
Render (Backend)

---

## 🔐 Session & Security

- No phone number required  
- Private communication via room code  
- Optional QR scanning for faster pairing  

---

## 🎥 Demo Video

Showcases:
- Session creation  
- Live speech streaming  
- Real-time vibration on receiver device  

---

## 🌍 Impact

NeuroVibe aims to:
- Support accessibility for deaf & HoH users  
- Enable silent communication in loud environments  
- Create a new tactile language  

---

## 📌 Future Enhancements

- Wearable vibration device support  
- Personalized vibration learning modes  
- Advanced speech-emotion recognition  
- Emergency communication use cases  

---

## 👥 Team

**Team Name:** Elytra 2.0  
Built with ❤️ for accessibility and inclusion.


---

## 🏁 Conclusion

NeuroVibe bridges the gap between *sound and touch, making silent communication truly **feelable*