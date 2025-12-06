export const MAX_FILES = 5
export const MAX_URLS = 5
export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export const IMAGE_GENERATION_PROMPT = (
  targetRegion: string,
  requirements: readonly string[] = []
) => `You are an expert International Art Director and Regulatory Compliance Officer for GlobalShelf.
Your task is to "localize" the attached image, which may contain one or multiple products, for the [${targetRegion}] market.

### 1. CONTEXT & GOAL
Transform the visual presentation to look native, authentic, and legally compliant for a consumer in [${targetRegion}].
- If multiple products are visible, adapt *all* of them consistent with the target market.
- Maintain visual coherence across the entire collection or shelf.

### 2. REQUIREMENTS CHECKLIST
Based on the target region, apply the following adaptations:

**A. Specific Region Requirements:**
${requirements.map((req) => `- ${req}`).join('\n')}

**B. Visual Language & Culture:**
- **[${targetRegion}] Aesthetic:** Apply culturally relevant styling (e.g., lighting, background, propping).
- Adjust the color palette if necessary to align with local color symbolism and preferences.
- Ensure any human models, environments, or lifestyle elements look locally appropriate.

**C. Text & Translation:**
- Translate **all** visible Product Names, Labels, and Packaging text.
- Translate any Taglines, Descriptions, or Price Tags.
- Ensure typography uses locally popular fonts and scripts (e.g., correct writing systems for the region).

**D. Regulatory Compliance (CRITICAL):**
- **Marks:** Add required regulatory symbols in visible, standard locations for *each* applicable product (e.g., CE Mark for EU, recycling codes).
- **Warnings:** Include mandatory text warnings in the local language (e.g., allergen warnings).
- **Formatting:** Convert all units to the local standard (e.g., metric vs. imperial).

### 3. EXECUTION INSTRUCTIONS
- **Input:** The attached image (single product or multi-item scene).
- **Output:** A high-fidelity, photorealistic edited image.
- **Style:** Commercial product photography, 4k resolution, sharp focus.
- **Constraint:** Maintain the original brand identity and logo recognition, but adapt all surrounding context, packaging details, and secondary text.`

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
