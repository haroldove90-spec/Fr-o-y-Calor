/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API endpoint for AI diagnostic assistant
app.post("/api/diagnose", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Mensajes no válidos." });
  }

  if (!ai) {
    // If no key is set or is placeholder, fallback to friendly simulated assistance so the app stays functional
    const lastUserMessage = messages[messages.length - 1]?.text || "";
    const lowerMsg = lastUserMessage.toLowerCase();
    
    let reply = "Hola. Soy el asistente de climatización virtual. Nota: Para habilitar respuestas de inteligencia artificial personalizadas de Gemini, puedes configurar tu GEMINI_API_KEY en el panel de Secrets de la plataforma.\n\n" +
      "Basado en tu mensaje, aquí tienes un diagnóstico preliminar técnico:\n\n";
      
    if (lowerMsg.includes("gotea") || lowerMsg.includes("agua") || lowerMsg.includes("fuga")) {
      reply += "💧 **Goteo de Agua:** Esto ocurre en un 90% de los casos por una obstrucción en la manguera de drenaje por acumulación de moho/polvo, o por la congelación del evaporador debido a filtros extremadamente sucios o falta de gas. \n\n🛠️ **Recomendación:** Apaga el equipo, limpia los filtros de aire. Si el goteo persiste al encenderlo, solicita una **Limpieza de Drenaje / Mantenimiento Preventivo** mediante la pestaña de **Citas**.";
    } else if (lowerMsg.includes("no enfria") || lowerMsg.includes("no enfría") || lowerMsg.includes("calor") || lowerMsg.includes("frio") || lowerMsg.includes("frío")) {
      reply += "❄️ **Problema de Enfriamiento:** Si el ventilador expulsa aire pero no está frío, las razones más frecuentes son:\n1. Filtros de aire muy sucios (obstruyen la transferencia de calor).\n2. Baja presión de gas refrigerante debido a una microfuga.\n3. El compresor exterior no está encendiendo (capacitor dañado o sobrecalentamiento).\n\n🛠️ **Recomendación:** Coloca tu mano en la salida del aire exterior, si sale aire templado tirando a frío, el compresor no está trabajando. Reserva una visita de **Reparación Técnica** en nuestra sección de **Citas**.";
    } else if (lowerMsg.includes("ruido") || lowerMsg.includes("sonar") || lowerMsg.includes("vibracion") || lowerMsg.includes("vibración")) {
      reply += "🔊 **Ruido Extraño:** Los ruidos mecánicos fuertes o vibraciones pueden deberse a un aspa del ventilador rota, turbina interior desbalanceada, tornillos sueltos en el chasis, o desgaste en los rodamientos del motor.\n\n🛠️ **Recomendación:** Te sugerimos apagar el equipo por seguridad para evitar daños mayores en el motor. Te sugerimos agendar una **Reparación Técnica** urgente.";
    } else if (lowerMsg.includes("olor") || lowerMsg.includes("huele")) {
      reply += "🤢 **Mal Olor:** La acumulación de humedad en la bandeja de condensado y el serpentín evaporador fomenta la aparición de bacterias, hongos y moho. \n\n🛠️ **Recomendación:** Se requiere de una desinfección química profunda. Reserva un servicio de **Mantenimiento Preventivo** en la pestaña de **Citas**.";
    } else {
      reply += "🔧 **Consulta General:** La mayoría de los fabricantes recomiendan realizar un servicio de mantenimiento preventivo y limpieza profunda de serpentines cada 6 meses para hogares y cada 3 meses para oficinas y comercio. Esto reduce el consumo eléctrico hasta en un 30% y prolonga la vida útil del equipo.\n\n¿En qué otra cosa te puedo asistir hoy? ¿Te gustaría cotizar un servicio técnico o calcular los BTUs ideales para una habitación?";
    }
    
    return res.json({ text: reply });
  }

  try {
    // Format messages for the @google/genai SDK
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: `Eres "ClimaSoporte AI", un asistente virtual especializado en sistemas de aire acondicionado y climatización para una empresa líder de servicios técnicos ("Servicio Técnico ClimaExpert").
Tu rol es diagnosticar de forma inteligente las fallas de los usuarios, brindar consejos de mantenimiento básico (como lavado de filtros) e indicar la capacidad en BTU adecuada.
Reglas estrictas de comportamiento:
1. Responde de forma amable, clara y estructurada en español. Usa emojis de forma prudente y profesional.
2. Si la falla reportada involucra electricidad (falla eléctrica, salta la llave térmica, chispazos), fugas de refrigerante/gas, ruidos metálicos fuertes del motor, o alturas elevadas, advierte del peligro de electrocución o daño mayor y recomiéndales encarecidamente que NO manipulen el equipo y que agenden un servicio técnico profesional en la pestaña de 'Citas' de esta aplicación de inmediato.
3. No des procedimientos peligrosos de reparación (como recarga casera de refrigerante o soldaduras de cobre), explica que esto debe ser realizado por técnicos certificados con manómetros y bombas de vacío.
4. Mantén las respuestas fluidas y scannables.`
      }
    });

    return res.json({ text: response.text || "No se pudo obtener una respuesta estructurada." });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Error de comunicación con el motor de IA. Por favor, intente más tarde." });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
