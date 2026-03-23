const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MEDICAL_SYSTEM_PROMPT = `You are MedAI, an advanced AI medical assistant integrated into a personalized medicine platform. 
Your role is to provide thorough medical analysis and reasoning based on patient data including vitals, lab reports, symptoms, medications, and medical history.

IMPORTANT GUIDELINES:
1. Always provide evidence-based medical reasoning
2. Consider drug interactions when medications are mentioned
3. Analyze lab values against standard reference ranges
4. Provide differential diagnoses when symptoms are described
5. Suggest relevant follow-up tests or consultations when appropriate
6. Use clear, professional medical terminology with explanations
7. Always remind patients that this is AI-assisted analysis and they should consult their healthcare provider
8. Consider the patient's complete medical context (age, gender, existing conditions, medications)
9. When analyzing lab reports, highlight any abnormal values and explain their clinical significance
10. Provide personalized treatment insights based on the patient's specific data

FORMAT YOUR RESPONSES:
- Use markdown formatting for clarity
- Use bullet points for lists
- Bold important findings
- Include relevant medical references when possible
- Structure analysis as: Assessment → Analysis → Recommendations → Disclaimer`;

async function getMedicalResponse(messages, patientContext = null) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  let contextPrompt = MEDICAL_SYSTEM_PROMPT;
  
  if (patientContext) {
    contextPrompt += `\n\nPATIENT CONTEXT:\n`;
    if (patientContext.name) contextPrompt += `- Name: ${patientContext.name}\n`;
    if (patientContext.age) contextPrompt += `- Age: ${patientContext.age}\n`;
    if (patientContext.gender) contextPrompt += `- Gender: ${patientContext.gender}\n`;
    if (patientContext.bloodGroup) contextPrompt += `- Blood Group: ${patientContext.bloodGroup}\n`;
    if (patientContext.vitals) {
      contextPrompt += `- Vitals:\n`;
      const v = patientContext.vitals;
      if (v.bloodPressure) contextPrompt += `  - Blood Pressure: ${v.bloodPressure}\n`;
      if (v.heartRate) contextPrompt += `  - Heart Rate: ${v.heartRate} bpm\n`;
      if (v.temperature) contextPrompt += `  - Temperature: ${v.temperature}°F\n`;
      if (v.spo2) contextPrompt += `  - SpO2: ${v.spo2}%\n`;
      if (v.respiratoryRate) contextPrompt += `  - Respiratory Rate: ${v.respiratoryRate}/min\n`;
    }
    if (patientContext.medications && patientContext.medications.length > 0) {
      contextPrompt += `- Current Medications: ${patientContext.medications.join(', ')}\n`;
    }
    if (patientContext.conditions && patientContext.conditions.length > 0) {
      contextPrompt += `- Existing Conditions: ${patientContext.conditions.join(', ')}\n`;
    }
    if (patientContext.symptoms) {
      contextPrompt += `- Current Symptoms: ${patientContext.symptoms}\n`;
    }
    if (patientContext.labReports) {
      contextPrompt += `- Lab Reports: ${patientContext.labReports}\n`;
    }
  }

  const chat = model.startChat({
    history: messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    systemInstruction: contextPrompt,
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = await result.response;
  return response.text();
}

async function analyzeLabReport(reportData, patientContext = null) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  let prompt = `${MEDICAL_SYSTEM_PROMPT}\n\nPlease perform a comprehensive analysis of the following lab report data. 
Identify any abnormal values, potential concerns, and provide clinical interpretation.\n\n`;

  if (patientContext) {
    prompt += `PATIENT CONTEXT:\n`;
    if (patientContext.age) prompt += `Age: ${patientContext.age}\n`;
    if (patientContext.gender) prompt += `Gender: ${patientContext.gender}\n`;
    if (patientContext.conditions) prompt += `Existing Conditions: ${patientContext.conditions}\n`;
    if (patientContext.medications) prompt += `Current Medications: ${patientContext.medications}\n`;
    prompt += '\n';
  }

  prompt += `LAB REPORT DATA:\n${reportData}\n\n`;
  prompt += `Please analyze each parameter, compare against standard reference ranges, 
identify any concerning values, potential diagnoses, and recommend follow-up actions.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

module.exports = { getMedicalResponse, analyzeLabReport };
