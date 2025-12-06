export const MAX_FILES = 5
export const MAX_URLS = 5
export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export const IMAGE_GENERATION_PROMPT = (
  targetRegion: string,
  requirements: readonly string[] = []
) => `You are an expert International Art Director and Regulatory Compliance Officer for GlobalShelf.
Your task is to "localize" the attached image for the [${targetRegion}] market.

### 1. CRITICAL: PRESERVE THE ORIGINAL COMPOSITION
**DO NOT crop, zoom, or reframe the image.** Keep the EXACT same:
- Camera angle and perspective
- Full scene framing (wide shot stays wide, storefront stays storefront)
- Layout and arrangement of all products/elements
- Background, environment, and setting

You are ONLY modifying text, labels, signage, and product imagery IN-PLACE within the existing composition.

### 2. WHAT TO LOCALIZE (in-place only)
Apply the following adaptations WITHOUT changing the overall scene composition:

**A. Text & Translation (CRITICAL):**
- Translate **all** visible text: Product Names, Labels, Signage, Price Tags, Banners
- Translate any Taglines, Descriptions, or Promotional text
- Use locally appropriate fonts and scripts for [${targetRegion}]
- Keep text in the SAME positions and relative sizes

**B. Regulatory Compliance:**
${requirements.map((req) => `- ${req}`).join('\n')}
- Add required regulatory symbols in standard locations (e.g., CE Mark for EU)
- Include mandatory warnings in the local language
- Convert units to local standard (metric vs. imperial)

**C. Cultural Adaptation (subtle):**
- Adjust imagery on packaging/signage to be culturally appropriate for [${targetRegion}]
- Adapt color symbolism only where necessary for local preferences
- Keep the same overall aesthetic and lighting

### 3. OUTPUT REQUIREMENTS
- **MUST maintain identical framing and composition as the input image**
- High-fidelity, photorealistic result
- 4k resolution, sharp focus
- If input is a storefront/shelf scene, output MUST be the same storefront/shelf scene
- Do NOT generate closeups or cropped versions`

export const EXTRACTION_PROMPT = `Analyze the attached localized product image and extract the following information into a structured JSON format.

Focus ONLY on the most critical text elements that were adapted for the target market. Do not list every minor label or graphical element.

1.  **Key Localized Text**: Identify the most important visible text in the image (e.g., Main Product Name, Primary Slogan, Critical Regulatory Warnings).
    -   Provide the new localized text found in the image.
    -   Categorize each text element (e.g., "Product Name", "Tagline", "Regulatory Warning").
    -   Identify the location/context of the text (e.g., "Front Label", "Bottom Right Sticker").

Output ONLY valid JSON with the following structure:
{
  "localized_text": [
    {
      "category": "string",
      "text_content": "string",
      "location": "string"
    }
  ]
}`
