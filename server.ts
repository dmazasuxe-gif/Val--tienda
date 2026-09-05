import express from "express";
import path from "path";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Setup multer for in-memory storage, but wait, the prompt says "asegurando que la capacidad de memoria se gestione correctamente"
// It's better to store on disk to save RAM when processing many files.
const upload = multer({ dest: 'uploads/' });

app.post("/api/extract-products", upload.array("files", 50), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const products = [];

    // Process files in batches to avoid rate limits and memory issues
    for (const file of files) {
      const mimeType = file.mimetype;
      const uploadedFile = await ai.files.upload({
        file: file.path,
        config: {
          mimeType: mimeType
        }
      });

      const prompt = `Analiza esta imagen de un catálogo de productos de Aura Moda & Calzado. Extrae todos los productos visibles y devuelve un array JSON de productos. 
      Por cada producto, extrae y/o genera:
      - name: Nombre del producto (ej: "Zapatillas Urbanas Nike")
      - description: Escribe una descripción muy atractiva, persuasiva y detallada para ventas. Resalta sus beneficios, estilo y comodidad.
      - price: Número (el precio exacto que aparece en el catálogo)
      - category: "calzado" o "ropa"
      - gender: "varones", "mujeres", "ninos", o "unisex" (según corresponda)
      - brand: Marca (si es visible, si no usa "Aura")
      - sizes: Array de tallas en string (ej: ["38", "39", "40"])
      - colors: Array de colores {name: "NombreColor", hex: "#HexColor"}
      Solo debes devolver un array JSON válido, sin bloques de código markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          uploadedFile,
          prompt
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      const text = response.text;
      if (text) {
        try {
          const extracted = JSON.parse(text);
          if (Array.isArray(extracted)) {
            products.push(...extracted);
          }
        } catch (e) {
          console.error("Error parsing JSON from Gemini", e);
        }
      }

      // Cleanup local file
      fs.unlinkSync(file.path);
    }

    res.json({ products });
  } catch (error) {
    console.error("Error processing products:", error);
    res.status(500).json({ error: "Failed to extract products" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
