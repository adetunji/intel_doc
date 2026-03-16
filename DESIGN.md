# Design System: The Architectural Intelligence (AI) Framework

## 1. Overview & Creative North Star: "The Digital Lithograph"
This design system moves away from the "SaaS-in-a-box" aesthetic to embrace a "Digital Lithograph" philosophy. Just as a fine lithograph uses weight, paper quality, and ink density to convey value, this system uses **Tonal Depth** and **Asymmetric Balance** to create an environment of extreme trust and surgical efficiency.

We are not building a generic tool; we are building a professional workstation for PDF intelligence. The layout avoids rigid, centered grids in favor of intentional "weighted" whitespace. By utilizing the `16` (5.5rem) and `20` (7rem) spacing tokens for outer margins, we create an editorial breathing room that signals high-end authority.

## 2. Colors: Tonal Architecture
The palette is a sophisticated interplay of deep blues (`primary`) and structural grays. We move beyond "flat" design by treating the screen as a series of physical planes.

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited for layout sectioning.** To separate a sidebar from a main content area, use a shift from `surface` (#f9f9fd) to `surface-container-low` (#f2f3f8). Boundaries are felt through color shifts, not drawn with lines.

### Surface Hierarchy & Nesting
Depth is achieved through logical nesting of the Material tiers:
*   **Base Layer:** `surface` (#f9f9fd)
*   **Secondary Content Areas:** `surface-container-low` (#f2f3f8)
*   **Floating Interactive Elements:** `surface-container-lowest` (#ffffff)
*   **Modal/Overlay Layers:** `surface-bright` (#f9f9fd) with 80% opacity and a 20px backdrop-blur.

### The "Glass & Gradient" Rule
To inject "visual soul," primary CTAs and AI-active states should not be flat. Use a subtle linear gradient from `primary` (#1e5ac2) to `primary_container` (#5f90fb) at a 135-degree angle. This mimics the slight sheen of a premium physical document.

## 3. Typography: Editorial Authority
We utilize **Inter** not as a utility font, but as an editorial typeface. 

*   **The Display Scale:** Use `display-lg` (3.5rem) with a negative letter-spacing of `-0.02em` for hero statements. This creates a "tight" professional look.
*   **Information Density:** For the PDF interface, the "Workhorse" is `body-md` (0.875rem). It provides the necessary density for technical documents while remaining legible.
*   **Labeling:** `label-sm` (0.6875rem) should always be in `all-caps` with a `+0.05em` letter-spacing when used for metadata or category tags, using the `on_surface_variant` (#5b5f65) color.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are "noisy." This system communicates hierarchy through **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card directly onto a `surface-container` (#ebeef3) background. The contrast alone provides sufficient "lift."
*   **Ambient Shadows:** If an element must float (like a context menu), use a shadow with a 32px blur, 0px offset-y, and 4% opacity of the `on_surface` color. It should feel like a soft glow rather than a drop shadow.
*   **The "Ghost Border" Fallback:** In high-density data views where distinction is critical, use the `outline_variant` (#aeb2b9) at **15% opacity**. This creates a "whisper" of a boundary that doesn't break the editorial flow.

## 5. Components: Precision Primitives

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. Radius: `md` (0.375rem). Text: `label-md` bold.
*   **Secondary:** `surface-container-highest` (#dfe3ea) background with `on_surface` text. No border.
*   **Tertiary:** Transparent background, `primary` text. Use for low-priority actions like "Cancel."

### Input Fields
*   **Visual Style:** Forgo the 4-sided box. Use a `surface-container-low` background with a 2px bottom-border of `outline_variant`. On focus, the bottom border transitions to `primary` (#1e5ac2).
*   **Error State:** Background shifts to `error_container` (#fa746f) at 10% opacity, with text in `error`.

### PDF Insight Cards
*   **Rule:** **No Dividers.** Separate the "Header," "Summary," and "Metadata" sections using vertical spacing tokens `3` (1rem) and `4` (1.4rem).
*   **Interaction:** On hover, a card should shift from `surface-container-lowest` to `surface-bright`.

### AI Floating Action Bar
*   **Style:** Glassmorphic. `surface-container-lowest` at 70% opacity with a `40px` backdrop-blur. Use `full` (9999px) roundedness to distinguish the AI "Assistant" space from the structural "Document" space.

## 6. Do's and Don'ts

### Do:
*   **Do** use `20` (7rem) spacing for top-of-page headers to create a "Gallery" feel.
*   **Do** use `primary_fixed_dim` (#5182ec) for icon accents to ensure they don't overpower the text.
*   **Do** embrace asymmetry. A sidebar might be `surface-container-low` while the rest of the page is `surface`.

### Don't:
*   **Don't** use black (#000000) for text. Always use `on_surface` (#2e3338) to maintain a soft, high-end contrast.
*   **Don't** use 1px dividers between list items. Use a `1.5` (0.5rem) spacing gap instead.
*   **Don't** use "Standard Blue" for links. Use the `primary` token to ensure brand alignment.
*   **Don't** use sharp corners. Avoid `none` or `sm` roundedness except for the actual PDF document edges. All UI elements should use `md` or `lg`.