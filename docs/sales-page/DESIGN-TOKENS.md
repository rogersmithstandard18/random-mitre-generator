# Design Tokens

## Overview

This document defines the design system tokens for the sales page, extending the existing app design for visual consistency.

---

## Existing Color Palette (from colors.ts)

```typescript
// Current colors - DO NOT MODIFY
const colors = {
  primary: "#FF5252",      // Red - main accent
  background: "#FFFFFF",   // White
  card: "#F5F5F5",         // Light gray
  text: "#222222",         // Near black
  textSecondary: "#666666", // Medium gray
  border: "#EEEEEE",       // Very light gray
  accent: "#1565C0",       // Blue
  success: "#4CAF50",      // Green
  warning: "#FF9800",      // Orange
};
```

---

## Extended Sales Page Colors

```typescript
// Sales page additions (to add to colors.ts or use directly)
const salesColors = {
  // Backgrounds
  bgWhite: "#FFFFFF",
  bgLight: "#F5F5F5",      // Matches existing card color
  bgDark: "#222222",       // Matches navbar
  bgDarkAlt: "#1A1A1A",    // Slightly darker for contrast

  // Text on dark backgrounds
  textOnDark: "#FFFFFF",
  textOnDarkMuted: "#AAAAAA",

  // Pricing highlights
  pricingHighlight: "#FFF8E1",  // Light yellow for popular tier
  pricingBorder: "#FFD54F",     // Gold border for popular tier

  // Gradients (optional)
  gradientStart: "#FF5252",
  gradientEnd: "#FF8A80",

  // Shadows
  shadowLight: "rgba(0, 0, 0, 0.06)",
  shadowMedium: "rgba(0, 0, 0, 0.12)",
  shadowHeavy: "rgba(0, 0, 0, 0.2)",
};
```

---

## Typography

### Font Family (Matches existing app)

```css
/* System font stack - already in use */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `hero-title` | 48px | 700 | 1.1 | Hero headline |
| `section-title` | 36px | 700 | 1.2 | Section headlines |
| `card-title` | 20px | 600 | 1.3 | Feature/pricing card titles |
| `body-large` | 18px | 400 | 1.6 | Hero subheadline, key descriptions |
| `body` | 16px | 400 | 1.5 | Default body text |
| `body-small` | 14px | 400 | 1.5 | Secondary text, captions |
| `label` | 12px | 600 | 1.4 | Badges, labels |

### Mobile Adjustments

```css
@media (max-width: 600px) {
  .hero-title { font-size: 32px; }
  .section-title { font-size: 28px; }
  .body-large { font-size: 16px; }
}
```

---

## Spacing System

### Base Unit: 8px

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Tight spacing, icon gaps |
| `space-sm` | 8px | Small gaps, padding |
| `space-md` | 16px | Default padding, margins |
| `space-lg` | 24px | Section padding, card gaps |
| `space-xl` | 32px | Large sections |
| `space-2xl` | 48px | Hero padding |
| `space-3xl` | 64px | Section vertical padding |
| `space-4xl` | 96px | Hero vertical padding |

### Section Spacing

```css
/* Vertical rhythm for sections */
.sales-section {
  padding-top: 64px;     /* space-3xl */
  padding-bottom: 64px;
  padding-left: 24px;    /* space-lg */
  padding-right: 24px;
}

.hero-section {
  padding-top: 96px;     /* space-4xl */
  padding-bottom: 96px;
}

@media (max-width: 600px) {
  .sales-section {
    padding-top: 48px;
    padding-bottom: 48px;
    padding-left: 16px;
    padding-right: 16px;
  }
}
```

---

## Layout

### Max Widths

| Context | Max Width | Usage |
|---------|-----------|-------|
| Content | 900px | Match existing `.page` max-width |
| Wide | 1200px | Full-width sections like pricing |
| Full | 100% | Hero background, footer |

### Grid System

```css
/* Features grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

/* Pricing grid */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}
```

---

## Button Variants

### Primary Button

```css
.sales-btn-primary {
  background-color: #FF5252;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.sales-btn-primary:hover {
  background-color: #E64A4A;
  transform: translateY(-1px);
}
```

### Secondary Button

```css
.sales-btn-secondary {
  background-color: #1565C0;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sales-btn-secondary:hover {
  background-color: #0D47A1;
}
```

### Outline Button

```css
.sales-btn-outline {
  background-color: transparent;
  color: #222222;
  border: 2px solid #222222;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.sales-btn-outline:hover {
  background-color: #222222;
  color: white;
}
```

### Button Sizes

```css
.sales-btn-sm { padding: 8px 16px; font-size: 14px; }
.sales-btn-md { padding: 12px 24px; font-size: 16px; }
.sales-btn-lg { padding: 16px 32px; font-size: 18px; }
```

---

## Card Styles

### Base Card (matches existing)

```css
.sales-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}

.sales-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

### Highlighted Card (for pricing)

```css
.sales-card-highlighted {
  background-color: #FFFFFF;
  border: 2px solid #FF5252;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(255, 82, 82, 0.15);
  position: relative;
}
```

### Feature Card

```css
.feature-card {
  background-color: #F5F5F5;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.feature-card-icon {
  width: 48px;
  height: 48px;
  background-color: #FF5252;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
}
```

---

## Badge Styles

```css
.sales-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sales-badge-primary {
  background-color: #FF5252;
  color: white;
}

.sales-badge-success {
  background-color: #4CAF50;
  color: white;
}

.sales-badge-warning {
  background-color: #FF9800;
  color: white;
}
```

---

## Animation Standards

### Transitions

```css
/* Default transition for interactive elements */
transition: all 0.2s ease;

/* Specific transitions */
transition-property: background-color, color, border-color, box-shadow, transform;
transition-duration: 200ms;
transition-timing-function: ease;
```

### Hover Effects

```css
/* Lift effect for cards */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Button hover */
.button:hover {
  transform: translateY(-1px);
}

/* No transform on mobile (performance) */
@media (hover: none) {
  .card:hover,
  .button:hover {
    transform: none;
  }
}
```

### FAQ Accordion Animation

```css
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-answer.open {
  max-height: 500px;
}

.faq-chevron {
  transition: transform 0.3s ease;
}

.faq-chevron.open {
  transform: rotate(180deg);
}
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */

/* Small phones */
@media (min-width: 375px) { }

/* Large phones */
@media (min-width: 480px) { }

/* Tablets */
@media (min-width: 768px) { }

/* Desktops */
@media (min-width: 1024px) { }

/* Large desktops */
@media (min-width: 1200px) { }

/* Primary breakpoint (match existing app) */
@media (max-width: 600px) {
  /* Mobile styles */
}
```

---

## Icon Sizing

| Context | Size | Example |
|---------|------|---------|
| Feature card | 24px | Feature icons |
| Button inline | 16px | Arrow in CTA |
| Hero benefits | 20px | Checkmarks |
| FAQ chevron | 20px | Expand/collapse |
| Testimonial quote | 32px | Decorative quote mark |

---

## Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | 0 | Default content |
| Cards | 1 | Elevated cards |
| Dropdown | 10 | Filter dropdowns |
| Sticky | 100 | Sticky header |
| Modal | 1000 | Modal overlays |

---

## Summary

To maintain consistency with the existing app:

1. **Use existing colors** from `colors.ts` as primary palette
2. **Match existing spacing** - the app uses 24px padding, 16px gaps
3. **Match existing shadows** - subtle `0 2px 12px rgba(0,0,0,0.06)`
4. **Match existing border-radius** - 12px for cards, 8px for buttons
5. **Use system fonts** - no custom fonts to load
6. **Mobile breakpoint at 600px** - matches existing app

The sales page should feel like a natural extension of the app, not a separate design.
