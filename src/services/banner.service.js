const fs = require('fs');
const path = require('path');
const { default: satori } = require('satori');
const { html } = require('satori-html');
const { Resvg } = require('@resvg/resvg-js');
const QRCode = require('qrcode');
const { callGemini } = require('./gemini');

let fontRegularBuffer = null;
let fontBoldBuffer = null;

async function loadFonts() {
  if (!fontRegularBuffer) {
    const resReg = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf');
    fontRegularBuffer = await resReg.arrayBuffer();
  }
  if (!fontBoldBuffer) {
    const resBold = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf');
    fontBoldBuffer = await resBold.arrayBuffer();
  }
  return { regular: fontRegularBuffer, bold: fontBoldBuffer };
}

async function generateTrainerBanner(trainerId, name, topic, photoFilename) {
  try {
    console.log(`[AI-Banner] Starting generation for ${name}...`);
    
    // 1. Generate AI Copy
    let aiData;
    try {
      const textResponse = await callGemini({
        caller: "generateTrainerBanner",
        instructions: `You are a marketing expert writing a promotional banner for a volunteer trainer. Return ONLY a raw JSON object (no markdown formatting, no code blocks) with keys "title" (string) and "points" (array of 3 strings). Write a 3-5 word exciting event title and 3 short, punchy bullet points (max 6 words each) detailing what they will learn.`,
        contents: [
          { role: "user", parts: [{ text: `Name: ${name}\nTopic: ${topic}` }] }
        ]
      });
      let text = textResponse.trim();
      if (text.startsWith("\`\`\`json")) {
        text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      }
      aiData = JSON.parse(text);
    } catch (e) {
      console.warn("[AI-Banner] Gemini failed, using fallback copy mode:", e.message);
      aiData = {
        title: `Master ${topic.slice(0, 20)} with ${name.split(" ")[0]}!`,
        points: ["Hands-on practical learning", "Live interactive sessions", "Real-world project building"]
      };
    }

    // 2. Load Fonts
    const fonts = await loadFonts();

    // 3. Generate WhatsApp QR Code (using a simulated static URL)
    const whatsappLink = `https://chat.whatsapp.com/invite/VIDYAOPS_GRP_${trainerId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(whatsappLink, { errorCorrectionLevel: 'H', margin: 1 });

    // 4. Load Photo (skip banner if file missing)
    const photoPath = path.join(__dirname, "../../data/uploads", photoFilename);
    if (!fs.existsSync(photoPath)) {
      console.warn(`[AI-Banner] Photo file not found: ${photoPath} — skipping banner generation`);
      return null;
    }
    const photoExt = path.extname(photoFilename).replace('.', '');
    const photoBase64 = fs.readFileSync(photoPath).toString('base64');
    const photoMime = (photoExt === 'jpg' || photoExt === 'jpeg') ? 'image/jpeg' : 'image/png';
    const photoUri = `data:${photoMime};base64,${photoBase64}`;

    // 5. Construct HTML for Satori
    const rawHtml = `
      <div style="display: flex; width: 1200px; height: 630px; background-color: #0f172a; padding: 44px 50px; font-family: 'Roboto'; color: #f8fafc;">
        <div style="display: flex; flex-direction: column; width: 65%; justify-content: space-between;">
          <div style="display: flex; flex-direction: column;">
            <div style="display: flex; color: #3b82f6; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
              VidyaOps Masterclass
            </div>
            <div style="display: flex; font-size: 62px; font-weight: 700; line-height: 1.1; margin-bottom: 24px; color: #ffffff;">
              ${aiData.title}
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${aiData.points.map(p => `
                <div style="display: flex; align-items: center; font-size: 28px; color: #cbd5e1;">
                  <div style="display: flex; background: #3b82f6; width: 14px; height: 14px; border-radius: 7px; margin-right: 16px;"></div>
                  ${p}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; margin-top: auto;">
            <div style="display: flex; font-size: 32px; font-weight: 700; color: #3b82f6;">${name}</div>
            <div style="display: flex; font-size: 20px; color: #94a3b8; margin-top: 4px;">Volunteer Trainer</div>
            
            <div style="display: flex; gap: 16px; margin-top: 16px;">
              <div style="display: flex; align-items: center; background: #059669; color: #ffffff; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 20px; letter-spacing: 1px;">
                <div style="display: flex; text-decoration: line-through; opacity: 0.65; margin-right: 10px; font-weight: 400;">₹999</div>
                <div style="display: flex;">FREE</div>
              </div>
              <div style="display: flex; background: #334155; color: #f8fafc; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 20px; letter-spacing: 1px;">
                DATE & TIME: TBA
              </div>
            </div>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; width: 35%; align-items: center; justify-content: center; gap: 32px;">
          <img src="${photoUri}" style="width: 280px; height: 280px; border-radius: 140px; border: 8px solid #3b82f6; object-fit: cover;" />
          
          <div style="display: flex; flex-direction: column; background: #ffffff; padding: 16px; border-radius: 20px; align-items: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <img src="${qrCodeDataUrl}" style="width: 130px; height: 130px;" />
            <div style="display: flex; color: #0f172a; font-size: 14px; font-weight: 700; margin-top: 8px;">Scan to Join Class</div>
          </div>
        </div>
      </div>
    `;

    const template = html(rawHtml);

    // 6. Convert to SVG using Satori
    const svg = await satori(template, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Roboto', data: fonts.regular, weight: 400, style: 'normal' },
        { name: 'Roboto', data: fonts.bold, weight: 700, style: 'normal' },
      ],
    });

    // 7. Convert SVG to high-res PNG using Resvg
    const resvg = new Resvg(svg, {
      background: '#0f172a',
      fitTo: { mode: 'original' },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // 8. Save output
    const bannerDir = path.join(__dirname, "../../data/banners");
    if (!fs.existsSync(bannerDir)) fs.mkdirSync(bannerDir, { recursive: true });
    const bannerFilename = `banner_trainer_${trainerId}_${Date.now()}.png`;
    const bannerPath = path.join(bannerDir, bannerFilename);
    fs.writeFileSync(bannerPath, pngBuffer);
    
    console.log(`[AI-Banner] Successfully generated: ${bannerPath}`);
    return bannerFilename;

  } catch (error) {
    console.error("[AI-Banner] Fatal Generation Error:", error);
    // Silent fail in background so it doesn't crash the server
    return null;
  }
}

module.exports = {
  generateTrainerBanner
};
