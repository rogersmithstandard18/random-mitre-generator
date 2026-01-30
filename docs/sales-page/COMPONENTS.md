# Sales Page Components

## Component Overview

This document defines all new components needed for the sales page, their props interfaces, dependencies, and whether they're reusable or single-use.

---

## Component Hierarchy

```
SalesPage
├── HeroSection
│   └── SalesButton (x2)
├── FeaturesSection
│   └── FeatureCard (x6)
├── DemoSection
│   ├── FilterBar (existing)
│   └── TranslationCardView (existing, preview mode)
├── TestimonialsSection
│   └── TestimonialCard (x3)
├── PricingSection
│   ├── PricingToggle
│   └── PricingCard (x3)
│       ├── SalesBadge
│       └── SalesButton
├── FAQSection
│   └── FAQItem (x5-8)
└── SalesFooter
    └── SalesButton
```

---

## Shared Components

### SalesButton

**Purpose:** Consistent CTA buttons across sales page
**Reusable:** Yes - used in Hero, Pricing, Footer

```typescript
interface SalesButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;           // For anchor links
  to?: string;             // For React Router links
  onClick?: () => void;    // For custom handlers
  fullWidth?: boolean;
  disabled?: boolean;
}
```

**Styling:**
- `primary`: Solid red (#FF5252) background, white text
- `secondary`: Solid blue (#1565C0) background, white text
- `outline`: Transparent with border, text color matches border

---

### SalesSection

**Purpose:** Consistent section wrapper with padding, max-width, optional background
**Reusable:** Yes - wraps every major section

```typescript
interface SalesSectionProps {
  children: React.ReactNode;
  id?: string;              // For anchor linking (e.g., "pricing")
  background?: 'white' | 'gray' | 'dark';
  className?: string;
}
```

**Styling:**
- `white`: #FFFFFF background
- `gray`: #F5F5F5 background (matches existing card color)
- `dark`: #222222 background, white text

---

### SalesBadge

**Purpose:** Highlight badges (e.g., "Most Popular", "New")
**Reusable:** Yes - used on pricing cards, features

```typescript
interface SalesBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning';
}
```

**Styling:**
- `primary`: Red background (#FF5252)
- `success`: Green background (#4CAF50)
- `warning`: Orange background (#FF9800)

---

### SalesIcon

**Purpose:** Wrapper for Lucide icons with consistent sizing/colors
**Reusable:** Yes - used in features, benefits lists

```typescript
interface SalesIconProps {
  name: LucideIcon;         // e.g., Shield, BookOpen, TrendingUp
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}
```

**Size mapping:**
- `sm`: 16px
- `md`: 24px (default)
- `lg`: 32px

---

## Section Components

### HeroSection

**Purpose:** Main hero with headline, subheadline, benefits, CTAs
**Reusable:** No - single use
**Dependencies:** SalesButton

```typescript
interface HeroSectionProps {
  headline: string;
  subheadline: string;
  benefits: string[];
  primaryCTA: {
    text: string;
    to: string;
  };
  secondaryCTA: {
    text: string;
    href: string;     // Anchor link to #pricing
  };
}
```

**Layout:**
- Two-column on desktop (content left, visual right)
- Single column on mobile
- Benefits as checkmark list
- Two CTA buttons side by side

---

### FeaturesSection

**Purpose:** Grid of feature cards
**Reusable:** No - single use
**Dependencies:** FeatureCard, SalesSection

```typescript
interface FeaturesSectionProps {
  headline: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;     // Lucide icon name
  }>;
}
```

**Layout:**
- 3-column grid on desktop
- 2-column on tablet
- 1-column on mobile

---

### FeatureCard

**Purpose:** Individual feature with icon, title, description
**Reusable:** Yes - used 6 times in FeaturesSection

```typescript
interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}
```

**Styling:**
- Card with subtle shadow (match existing `.card` style)
- Icon top, title below, description at bottom
- Hover state with slight lift

---

### DemoSection

**Purpose:** Interactive demo showing FilterBar and sample card
**Reusable:** No - single use
**Dependencies:** FilterBar (existing), TranslationCardView (existing)

```typescript
interface DemoSectionProps {
  headline: string;
  description: string;
}
```

**Behavior:**
- Shows FilterBar in interactive state
- "Generate Sample" button triggers `generateRandomCard()`
- Shows truncated/preview version of card
- CTA to try full experience at `/learn`

**Note:** Uses existing `topicStore` for state management

---

### TestimonialsSection

**Purpose:** Display customer testimonials
**Reusable:** No - single use
**Dependencies:** TestimonialCard, SalesSection

```typescript
interface TestimonialsSectionProps {
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>;
}
```

**Layout:**
- 3-column grid on desktop
- Carousel or stacked on mobile

---

### TestimonialCard

**Purpose:** Individual testimonial display
**Reusable:** Yes - used 3 times

```typescript
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;    // Optional avatar URL
}
```

**Styling:**
- Large quotation mark decorative element
- Quote text in italics
- Author info below with role and company

---

### PricingSection

**Purpose:** Pricing tier comparison
**Reusable:** No - single use
**Dependencies:** PricingCard, SalesSection, PricingToggle (optional)

```typescript
interface PricingSectionProps {
  headline: string;
  tiers: PricingTier[];
  showAnnualToggle?: boolean;
}

interface PricingTier {
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}
```

**Layout:**
- 3-column grid on desktop
- Highlighted tier slightly larger/elevated
- Stacked on mobile

---

### PricingCard

**Purpose:** Individual pricing tier card
**Reusable:** Yes - used 3 times

```typescript
interface PricingCardProps {
  tier: PricingTier;
  onSelect: (tierName: string) => void;
}
```

**Styling:**
- Highlighted card has border and badge
- Feature list with checkmarks
- CTA button at bottom

---

### FAQSection

**Purpose:** Frequently asked questions accordion
**Reusable:** No - single use
**Dependencies:** FAQItem, SalesSection

```typescript
interface FAQSectionProps {
  headline: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}
```

**State:** Tracks which FAQ item is open (local useState)

---

### FAQItem

**Purpose:** Single expandable FAQ question/answer
**Reusable:** Yes - used 5-8 times

```typescript
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}
```

**Styling:**
- Chevron icon rotates on open
- Answer slides in/out with animation
- Border between items

---

### SalesFooter

**Purpose:** Final CTA section and footer links
**Reusable:** No - single use
**Dependencies:** SalesButton, SalesSection

```typescript
interface SalesFooterProps {
  ctaHeadline: string;
  ctaButton: {
    text: string;
    to: string;
  };
  links: Array<{
    label: string;
    href: string;
  }>;
}
```

**Layout:**
- Full-width dark background
- Centered CTA section
- Footer links in row below

---

## Component Dependencies Matrix

| Component | SalesButton | SalesSection | SalesBadge | SalesIcon | Store |
|-----------|-------------|--------------|------------|-----------|-------|
| HeroSection | Yes | No | No | Yes | No |
| FeaturesSection | No | Yes | No | No | No |
| FeatureCard | No | No | No | Yes | No |
| DemoSection | Yes | Yes | No | No | Yes |
| TestimonialsSection | No | Yes | No | No | No |
| TestimonialCard | No | No | No | No | No |
| PricingSection | No | Yes | No | No | No |
| PricingCard | Yes | No | Yes | Yes | No |
| FAQSection | No | Yes | No | No | No |
| FAQItem | No | No | No | Yes | No |
| SalesFooter | Yes | Yes | No | No | No |

---

## Implementation Order

Based on dependencies, implement in this order:

1. **Shared components first:**
   - SalesButton
   - SalesSection
   - SalesBadge
   - SalesIcon

2. **Card components:**
   - FeatureCard
   - TestimonialCard
   - PricingCard
   - FAQItem

3. **Section components:**
   - HeroSection
   - FeaturesSection
   - TestimonialsSection
   - PricingSection
   - FAQSection
   - DemoSection
   - SalesFooter

4. **Main page:**
   - SalesPage (composes all sections)

---

## Existing Components to Reuse

| Component | Location | Usage in Sales Page |
|-----------|----------|---------------------|
| FilterBar | `/src/components/FilterBar.tsx` | Embed in DemoSection |
| TranslationCardView | `/src/components/TranslationCardView.tsx` | Preview in DemoSection |

**Note:** These components require the Zustand store to be initialized. The demo section will use real store state.

---

## Icons Needed (from lucide-react)

| Icon | Usage |
|------|-------|
| `BookOpen` | Plain English Translation feature |
| `TrendingUp` | Boardroom Pitch feature |
| `Building` | Industry Impact feature |
| `Filter` | Smart Filtering feature |
| `Shield` | Detection & Mitigation feature |
| `Route` | Learning Paths feature |
| `Check` | Feature list checkmarks |
| `ChevronDown` | FAQ accordion |
| `ArrowRight` | CTA buttons |
| `Quote` | Testimonial decoration |
| `Star` | Rating/highlight decoration |
