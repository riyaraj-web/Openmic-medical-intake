# 🩺 OpenMic Webhook Integration 


This project implements webhook endpoints and a simple UI to integrate with **OpenMic Voice Agents**.  
The assignment includes creating **pre-call, function-call, and post-call webhooks**, exposing them via ngrok, and testing using Postman (since the OpenMic test call interface was unreliable).  

---

## 🚀 Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database (Optional)**: SQLite (via Prisma) for logs
- **Tunnel**: ngrok (to expose local APIs to OpenMic)

---

## 📌 Features
- ✅ API endpoints (`/pre-call`, `/function-call`, `/post-call`)  
- ✅ Next.js frontend with **Bot List & Call Logs**  
- ✅ Integration with OpenMic via exposed API routes  
- ✅ Tested locally with **Postman**  

---

## 🔗 API Endpoints

### 1️⃣ Pre-call Webhook
Fetch patient details before a call begins.

**Endpoint:**  
`POST /api/webhook/pre-call`

**Request Example:**
```json
{
  "patientId": "123"
}
