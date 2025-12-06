# GlobalShelf — Internationalization MVP Plan

> Turn any product into a worldwide product in minutes, not months.

## 🎯 Core Value Proposition

Ecommerce businesses expanding internationally face a painful bottleneck: adapting product packaging, labels, and marketing materials for each target market. This involves:

- Translation
- Regulatory compliance (CE marks, barcodes, allergen warnings, recycling symbols)
- Cultural adaptation
- Design localization

**GlobalShelf** automates this entire workflow using Gemini 3 Pro for intelligent analysis and Nano Banana Pro for generating publication-ready localized assets.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Astro + React)                │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
│  │   Upload    │  │   3D Globe +     │  │   Results Panel   │  │
│  │   Zone      │  │   Region Select  │  │   + Comparison    │  │
│  └─────────────┘  └──────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Python + uv)                      │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
│  │  FastAPI    │  │  Gemini 3 Pro    │  │  Nano Banana Pro  │  │
│  │  Server     │──│  Text Analysis   │──│  Image Gen        │  │
│  └─────────────┘  └──────────────────┘  └───────────────────┘  │
│                              │                                  │
│                   ┌──────────────────┐                         │
│                   │  Regulatory DB   │                         │
│                   │  (JSON/Static)   │                         │
│                   └──────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
/cavendishes
├── /frontend                    # Astro + React
│   ├── /src
│   │   ├── /components
│   │   │   ├── UploadZone.tsx       # Drag & drop, URL input
│   │   │   ├── Globe.tsx            # Three.js 3D globe
│   │   │   ├── RegionSelector.tsx   # Dropdown + sidebar
│   │   │   ├── RequirementsSidebar.tsx
│   │   │   ├── ResultsGallery.tsx   # Satellite mockups
│   │   │   ├── ComparisonView.tsx   # Side-by-side
│   │   │   └── ExportPanel.tsx      # Download zip
│   │   ├── /pages
│   │   │   └── index.astro
│   │   ├── /layouts
│   │   │   └── Layout.astro
│   │   └── /lib
│   │       ├── api.ts               # Backend API calls
│   │       └── regions.ts           # Region data + requirements
│   ├── astro.config.mjs
│   ├── tailwind.config.mjs
│   └── package.json
│
├── /backend                     # Python + uv
│   ├── /app
│   │   ├── main.py                  # FastAPI app
│   │   ├── /routes
│   │   │   ├── analyze.py           # Product analysis
│   │   │   ├── generate.py          # Image generation
│   │   │   └── export.py            # Zip creation
│   │   ├── /services
│   │   │   ├── gemini.py            # Gemini 3 Pro integration
│   │   │   ├── imagen.py            # Nano Banana Pro integration
│   │   │   └── scraper.py           # URL product scraping
│   │   ├── /models
│   │   │   └── schemas.py           # Pydantic models
│   │   └── /data
│   │       └── regulations.json     # Regulatory requirements DB
│   ├── pyproject.toml
│   └── .python-version
│
├── plan.md
└── README.md
```

---

## 🌍 Supported Regions (MVP)

| Region            | Code | Glow Color          | Key Requirements                                          |
| ----------------- | ---- | ------------------- | --------------------------------------------------------- |
| 🇺🇸 United States  | US   | `#3B82F6` (blue)    | UPC barcode, FDA compliance, English required             |
| 🇪🇺 European Union | EU   | `#6366F1` (indigo)  | CE marking, allergens in bold, metric units, multilingual |
| 🇬🇧 United Kingdom | UK   | `#EF4444` (red)     | UKCA marking, recycling symbols, UK importer info         |
| 🇯🇵 Japan          | JP   | `#F43F5E` (rose)    | JAN barcode, recycling codes, specific fonts              |
| 🇨🇳 China          | CN   | `#F59E0B` (amber)   | CCC mark, Mandarin required, specific claims rules        |
| 🇰🇷 South Korea    | KR   | `#10B981` (emerald) | KC mark, Korean labeling, country of origin               |
| 🇧🇷 Brazil         | BR   | `#22C55E` (green)   | INMETRO seal, Portuguese required, ANVISA for cosmetics   |
| 🇦🇺 Australia      | AU   | `#8B5CF6` (violet)  | Australian Made logo option, metric, recycling codes      |

---

## 🔄 User Flow

### Step 1: Upload Product

```
┌────────────────────────────────────────────┐
│                                            │
│   ┌──────────────────────────────────┐    │
│   │                                  │    │
│   │     📦 Drop product images       │    │
│   │        or paste URL              │    │
│   │                                  │    │
│   └──────────────────────────────────┘    │
│                                            │
│   [Browse Files]  [Paste URL]             │
│                                            │
└────────────────────────────────────────────┘
```

**Backend Process:**

1. If URL → scrape product page for images + text
2. If images → use Gemini 3 Pro to extract:
   - Product name
   - Description
   - Ingredients/materials (if applicable)
   - Current language
   - Product category

### Step 2: Select Target Regions

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     ┌───────────────────────┐    ┌───────────────────────┐ │
│     │                       │    │ 📋 EU Requirements    │ │
│     │       🌍              │    │                       │ │
│     │    [3D Globe]         │    │ ✓ CE marking          │ │
│     │                       │    │ ✓ Allergens in bold   │ │
│     │   ✨ EU (selected)    │    │ ✓ Metric units        │ │
│     │                       │    │ ✓ 24 official langs   │ │
│     └───────────────────────┘    │ ✓ WEEE symbol         │ │
│                                   │                       │ │
│     [▼ Select regions...]        │ Est. cost: €0.40      │ │
│     ☑ EU  ☑ Japan  ☐ US         └───────────────────────┘ │
│                                                             │
│                    [🚀 Generate Variants]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Interactions:**

- Click globe to rotate/select regions
- Dropdown for precise multi-select
- Sidebar updates with requirements for hovered/selected region
- Show estimated generation cost

### Step 3: Generate & Review

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     ┌───────────────────────┐                              │
│     │       🌍              │    🛰️ Generated Variants     │
│     │                       │                              │
│     │   [Original in       │    ┌─────┐  ┌─────┐          │
│     │    center]            │    │ 🇪🇺  │  │ 🇯🇵  │          │
│     │                       │    │ EU  │  │ JP  │          │
│     │  🛰️    🛰️    🛰️      │    └─────┘  └─────┘          │
│     │   EU   JP   UK       │                              │
│     │                       │    Click to expand           │
│     └───────────────────────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Backend Process:**

1. For each selected region:
   - Use Gemini 3 Pro to generate localized text
   - Identify required regulatory elements
   - Create generation prompt with requirements
2. Use Nano Banana Pro to generate localized product images
3. Return all variants with metadata

### Step 4: Compare & Export

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────┐  ⟺  ┌─────────────────┐              │
│  │                 │     │                 │              │
│  │   [Original]    │     │   [EU Version]  │              │
│  │                 │     │                 │              │
│  │   🇺🇸 English    │     │   🇪🇺 German     │              │
│  │                 │     │                 │              │
│  └─────────────────┘     └─────────────────┘              │
│                                                             │
│  Differences:                                               │
│  • Added CE mark (top right)                               │
│  • Allergens now in BOLD                                   │
│  • Units converted to metric                               │
│  • Added recycling symbol                                  │
│                                                             │
│  [📝 Edit]  [🔄 Regenerate]  [📥 Download ZIP]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Export ZIP Contents:**

```
/globalshelf-export-2024-01-15/
├── /original/
│   └── product.png
├── /EU/
│   ├── product-eu.png (2K or 4K)
│   ├── product-eu-print.pdf
│   ├── translations.json
│   └── requirements-checklist.md
├── /JP/
│   ├── product-jp.png
│   ├── product-jp-print.pdf
│   ├── translations.json
│   └── requirements-checklist.md
└── manifest.json
```

---

## 🧠 AI Integration Details

### Gemini 3 Pro — Text Analysis & Generation

**1. Product Analysis Prompt:**

```
Analyze this product image and extract:
1. Product name
2. All visible text (preserve hierarchy)
3. Product category (food, electronics, cosmetics, etc.)
4. Current market/language
5. Any existing compliance marks visible
6. Ingredients or materials list if present

Output as structured JSON.
```

**2. Localization Prompt (per region):**

```
You are an expert in international product compliance and localization.

Original product: {product_data}
Target market: {region} ({country_name})

Generate localized content including:
1. Translated product name (culturally appropriate)
2. Translated description
3. Required regulatory text for {region}
4. Required symbols/marks: {required_marks}
5. Any mandatory warnings
6. Suggested text placement

Consider:
- {region_specific_rules}
- Cultural nuances
- Legal requirements

Output as structured JSON with clear sections.
```

### Nano Banana Pro — Image Generation

**Generation Prompt Template:**

```
Product packaging for {product_name}, {region} market version.

Requirements:
- Language: {target_language}
- Include regulatory marks: {marks_list}
- Text to display: {localized_text}
- Style: Clean, professional product photography
- Maintain brand colors: {extracted_colors}

The packaging should look authentic and market-ready for {country_name}.
High quality, 4K resolution, commercial photography style.
```

**Image Edit Prompt (for modifications):**

```
Edit this product packaging image:
- Replace text "{original_text}" with "{new_text}"
- Add {regulatory_mark} in the {position}
- Keep all other elements identical
```

---

## 🗓️ MVP Development Timeline (24 hours)

### Hour 0-2: Setup & Foundation

- [x] Create plan.md
- [ ] Initialize frontend (Astro + React + Tailwind)
- [ ] Initialize backend (uv + FastAPI)
- [ ] Set up API keys and environment
- [ ] Create basic project structure

### Hour 2-6: Core Backend

- [ ] Implement Gemini 3 Pro integration
  - [ ] Product image analysis
  - [ ] Text extraction
  - [ ] Localization generation
- [ ] Implement Nano Banana Pro integration
  - [ ] Image generation endpoint
  - [ ] Image editing endpoint
- [ ] Create regulatory requirements database (JSON)
- [ ] Build ZIP export functionality

### Hour 6-12: Frontend Shell

- [ ] Layout and navigation
- [ ] Upload zone component (drag & drop + URL)
- [ ] Region selector dropdown
- [ ] Requirements sidebar
- [ ] Loading states and progress indicators

### Hour 12-16: 3D Globe

- [ ] Three.js globe setup
- [ ] Region highlighting on hover/select
- [ ] Glow effects for selected regions
- [ ] Satellite orbit animation for results
- [ ] Smooth transitions

### Hour 16-20: Results & Comparison

- [ ] Results gallery component
- [ ] Side-by-side comparison view
- [ ] Diff highlighting
- [ ] Export panel with options
- [ ] Download ZIP functionality

### Hour 20-24: Polish & Demo

- [ ] Error handling
- [ ] Loading animations
- [ ] Mobile responsiveness (basic)
- [ ] Demo video recording
- [ ] Deploy (Vercel + Railway/Fly.io)
- [ ] Update README with submission

---

## 🎨 UI Design Direction

### Color Palette

```css
:root {
  /* Background - Deep space feel */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-elevated: #1a1a24;

  /* Accent - Vibrant globe glow */
  --accent-primary: #6366f1; /* Indigo */
  --accent-secondary: #8b5cf6; /* Violet */
  --accent-success: #10b981; /* Emerald */

  /* Text */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* Region glows */
  --glow-us: #3b82f6;
  --glow-eu: #6366f1;
  --glow-uk: #ef4444;
  --glow-jp: #f43f5e;
  --glow-cn: #f59e0b;
}
```

### Typography

- **Headings:** Space Mono (technical, global feel)
- **Body:** Outfit (clean, modern, excellent intl support)
- **Monospace/Data:** JetBrains Mono

### Visual Style

- Dark mode primary (space/globe aesthetic)
- Glassmorphism panels
- Subtle grid background
- Animated gradient accents
- Region-specific color coding
- Smooth micro-interactions

---

## 📦 Dependencies

### Frontend

```json
{
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/react": "^3.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "framer-motion": "^10.16.0",
    "react-dropzone": "^14.2.0",
    "zustand": "^4.4.0",
    "lucide-react": "^0.300.0"
  }
}
```

### Backend

```toml
[project]
dependencies = [
    "fastapi>=0.109.0",
    "uvicorn>=0.27.0",
    "python-multipart>=0.0.6",
    "google-generativeai>=0.3.0",
    "httpx>=0.26.0",
    "beautifulsoup4>=4.12.0",
    "Pillow>=10.2.0",
    "python-dotenv>=1.0.0",
    "pydantic>=2.5.0",
]
```

---

## ✅ MVP Success Criteria

1. **Upload works** — Can upload image or paste URL, product is analyzed
2. **Globe interaction** — Can select at least 3 regions, see requirements
3. **Generation works** — Can generate at least one localized variant
4. **Comparison works** — Can see original vs localized side-by-side
5. **Export works** — Can download ZIP with assets
6. **Looks polished** — Globe animation, smooth transitions, professional UI

---

## 🚀 Stretch Goals (if time permits)

- [ ] Real-time collaborative editing
- [ ] Batch processing (multiple products)
- [ ] PDF label export with bleed marks
- [ ] Barcode generation (UPC, EAN, JAN)
- [ ] A/B variant generation
- [ ] Cost estimation before generation
- [ ] History/saved projects

---

## 💡 Why This Wins

1. **Solves a real problem** — International expansion is expensive and slow. This reduces weeks of agency work to minutes.

2. **Creative use of both models** — Gemini 3 Pro for deep regulatory understanding and translation, Nano Banana Pro for photorealistic localized packaging.

3. **Novel form factor** — The 3D globe with satellite mockups is memorable and intuitive. It makes a complex workflow feel simple.

4. **Polished execution** — Dark space aesthetic, smooth animations, comprehensive export. Not just functional, but delightful.

5. **Practical value** — The output is actually usable: print-ready files, translation JSON, compliance checklists.
