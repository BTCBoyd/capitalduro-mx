# Editorial Featured System - Capital Duro

## What Was Built

A reusable pattern for featuring editorial content (like "Carta del Editor") at the top of capitalduro.mx homepage — positioned like a magazine's cover letter, above all sections and categories.

## Files Created

1. **`/carta-del-editor.html`** - Full editorial article page
   - Clean, readable typography
   - Centered layout (720px max-width)
   - Editorial-specific styling (gold accents, signature section)
   
2. **Featured card on homepage** (`index.html`)
   - Positioned at top of feed, before "Lo Último" section
   - Gold gradient background for visual distinction
   - Card class: `.editorial-featured`

## How It Works

**Magazine model:** The editorial isn't filed under "Análisis," "Reportes," or "Perspectivas." It sits at the top like the first thing you see when opening a magazine — the editor's voice, setting the tone.

**Visual hierarchy:**
- Gold gradient background (more prominent than regular featured articles)
- Gold bordered label: "✍️ Carta del Editor · Número Inaugural"
- Larger title font (1.5rem vs 1.15rem for regular articles)
- Editorial byline with author, role, date

## How to Update for Future Editorials

### Option A: Replace Current Editorial

1. Edit `/carta-del-editor.html` with new content
2. Update the featured card in `index.html`:
   ```html
   <a href="/carta-del-editor.html" class="editorial-featured">
     <div class="editorial-label">✍️ Carta del Editor · [New Label]</div>
     <div class="article-title">[New Title]</div>
     <div class="article-excerpt">[New Excerpt]</div>
     <div class="editorial-byline">
       <strong>Boyd Cohen, Ph.D.</strong> · [Date]
     </div>
   </a>
   ```

### Option B: Add New Editorial (Keep Archive)

1. Create new file: `/carta-del-editor-feb-2026.html` (date it)
2. Update homepage card to point to new file
3. Original editorial stays accessible at old URL

### Option C: Remove Editorial Card Temporarily

If no active editorial priority:
- Comment out or delete the `<a href="/carta-del-editor.html" class="editorial-featured">...</a>` block
- Card disappears, "Lo Último" becomes top section again

## Use Cases for This Pattern

- **Major announcements:** "ArcadiaB añade Bitcoin a tesorería"
- **Market commentary:** "Banxico cambia política monetaria: qué significa para Bitcoin"
- **Editorial perspectives:** "Por qué family offices mexicanos están entrando ahora"
- **Guest editorials:** Feature prominent voices from the ecosystem

## Design Specs

**Colors:**
- Background: `linear-gradient(135deg, rgba(200, 168, 78, 0.08) 0%, rgba(20, 23, 32, 0.95) 100%)`
- Border: `rgba(200, 168, 78, 0.25)`
- Border on hover: `rgba(200, 168, 78, 0.5)`

**Typography:**
- Title: Playfair Display, 1.5rem, weight 600
- Excerpt: Source Sans 3, 1rem, line-height 1.65
- Byline: 0.85rem, muted color

**Spacing:**
- Padding: 2rem
- Margin-bottom: 2rem (creates gap before "Lo Último")

## Files Modified

- `index.html`:
  - Added `.editorial-featured` CSS (lines ~441-490)
  - Inserted editorial card HTML (after `<div class="feed">`, before `<div class="feed-header">`)

## Current Live Editorial

**Title:** El Dinero Más Duro Encuentra a las Máquinas Más Inteligentes  
**URL:** https://capitalduro.mx/carta-del-editor.html  
**Author:** Boyd Cohen, Ph.D.  
**Date:** 14 de febrero, 2026  
**Topic:** Introduction to Capital Duro, agentic economy thesis, Bitcoin + AI convergence

---

**Deployment:** Netlify auto-deploys from GitHub `master` branch. Changes pushed = live in ~1-2 minutes.

**Repository:** https://github.com/BTCBoyd/capitalduro-mx
