# Design Enhancement Plan: Windows 11 Style 🎨

Based on the analysis of the user-provided reference image (Windows 11 Photos/Media Player style), here is the plan to elevate Kenichi Lite's design.

## Visual Analysis

| Element | Reference Style | Kenichi Lite Current | Target Change |
| :--- | :--- | :--- | :--- |
| **Theme** | Deep Charcoal / Black | Pro Gray (`#09090b`) | Retain Pro Gray, but check contrast. |
| **Top Action Bar** | Left-aligned tools (Trim, Rotate) with a "Primary Action" pill button. Center filename. | Custom Title Bar (Window controls only). | **Add**: Media Actions Row below/inside title bar. **Style**: "Trim" button style for primary actions. |
| **Bottom Bar** | **Left**: Metadata (Res, Size). **Right**: Zoom/Layout controls. | **Left**: Filmstrip Toggle. **Center**: Metadata. **Right**: Resolution. | **Refactor**: Move Metadata to specific "Info" area. Add generic "Zoom/View" controls placeholder. |
| **Accent Color** | Purple/Pink Gradient on "Trim" button. | Brand Yellow. | Consider a customizable accent or a subtler primary action color. |
| **Iconography** | Thin, linear, rounded (Segoe Fluid). | Lucide React. | Lucide is perfect. Ensure stroke width is consistent (1.5px or 2px). |

## Proposed Implementation Steps

### 1. Refine Title Bar (Top Area)
- Incorporate a "Media Actions" toolbar.
- Add a prominent "Edit/Trim" button styling (even if non-functional initially, or maps to nothing).
- Ensure filename is centered and elegant.

### 2. Refine Bottom Footer
- Adopt the **Three-Section Layout**:
  - **Left**: Quick Actions (Filmstrip Toggle, Favorite/Heart, Info).
  - **Center**: (Empty or Playback focus).
  - **Right**: View Controls (Zoom slider, Fit/Fill toggle).
- Move technical metadata (Resolution, Size) to the "Info" hover or a subtle text element next to the left icons.

### 3. Visual Polish
- **Pill Buttons**: Implement the "Pill" shape for primary actions (like the "Trim" button in the reference).
- **Tooltips**: Add high-quality tooltips to these new icons (as per roadmap).

## CSS Variables Update
Review `index.css` to ensure we have a palette for:
- `--color-surface-hover`
- `--color-primary-action`
