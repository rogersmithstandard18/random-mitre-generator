# Sales Page Architecture

## Overview

Transform the existing HomePage into a professional sales/landing page while preserving all existing learning tool functionality. The learning tool (CardPage, HistoryPage, FilterBar) becomes the authenticated/paid product accessed from the sales page.

---

## Component Structure

```
SalesPage/
├── Hero/
│   ├── HeroSection.tsx          # Main hero with headline, CTA buttons
│   └── HeroBenefits.tsx         # Bullet points of key benefits
├── Features/
│   ├── FeaturesSection.tsx      # Grid of feature cards
│   └── FeatureCard.tsx          # Individual feature with icon
├── Demo/
│   └── DemoSection.tsx          # Interactive FilterBar demo
├── SocialProof/
│   ├── TestimonialsSection.tsx  # Testimonial carousel/grid
│   └── TestimonialCard.tsx      # Individual testimonial
├── Pricing/
│   ├── PricingSection.tsx       # Pricing tier comparison
│   └── PricingCard.tsx          # Individual pricing tier
├── FAQ/
│   ├── FAQSection.tsx           # FAQ accordion
│   └── FAQItem.tsx              # Individual FAQ item
├── Footer/
│   └── SalesFooter.tsx          # CTA footer with links
└── Shared/
    ├── SalesButton.tsx          # Styled CTA buttons
    ├── SalesSection.tsx         # Consistent section wrapper
    ├── SalesBadge.tsx           # Badges (e.g., "Most Popular")
    └── SalesIcon.tsx            # Icon wrapper for Lucide icons
```

---

## Routing Strategy

### Option A: Transform HomePage (Recommended)

```tsx
// App.tsx - Updated routes
<Routes>
  <Route path="/" element={<SalesPage />} />      {/* NEW: Sales landing */}
  <Route path="/learn" element={<CardPage />} />   {/* Unchanged */}
  <Route path="/history" element={<HistoryPage />} /> {/* Unchanged */}
</Routes>
```

**Rationale:**
- Root path (`/`) becomes the marketing funnel entry point
- `/learn` becomes the "product" users access after conversion
- No new routes needed, just transform existing HomePage
- Clear separation: marketing vs. product

### Navbar Changes

```tsx
// Current navbar (for authenticated/converted users)
<NavLink to="/">Home</NavLink>
<NavLink to="/learn">Learn</NavLink>
<NavLink to="/history">History</NavLink>

// New navbar (conditional based on auth state in future)
// When on sales page: Show CTA button instead of full nav
// When in app: Show full nav as today
```

**Phase 1 Implementation:**
- Keep navbar as-is for now
- Add "Start Learning" CTA in hero that navigates to `/learn`
- Future: Conditionally render navbar based on auth state

---

## State Management

### Sales Page State Needs

| Feature | State Type | Location |
|---------|-----------|----------|
| FAQ accordion open/closed | Local React state | FAQSection.tsx |
| Pricing toggle (monthly/annual) | Local React state | PricingSection.tsx |
| Demo FilterBar | Existing Zustand store | topicStore.ts |
| Mobile menu open/close | Local React state | SalesPage.tsx |

**Decision: No new Zustand store needed**

The sales page is primarily presentational. All interactive state can be handled with local React state (`useState`). The only exception is the interactive demo section, which can reuse the existing `topicStore`.

### Future Auth State (Phase 8+)

```tsx
// Future: authStore.ts
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  subscription: 'free' | 'foundation' | 'core' | 'premium' | null;
}
```

This will be added in a future phase when implementing authentication gates.

---

## Integration Points

### 1. FilterBar Demo Section

The existing `FilterBar` component can be embedded in the sales page as an interactive demo:

```tsx
// DemoSection.tsx
import FilterBar from '@/components/FilterBar';
import { useTopicStore } from '@/store/topicStore';

export const DemoSection = () => {
  const currentCard = useTopicStore(s => s.currentCard);
  const generateRandomCard = useTopicStore(s => s.generateRandomCard);

  return (
    <section className="demo-section">
      <h2>Try It Now</h2>
      <FilterBar />
      <button onClick={generateRandomCard}>Generate Sample</button>
      {currentCard && <CardPreview card={currentCard} />}
    </section>
  );
};
```

**Note:** This demo uses real store state. Consider whether to:
- Use a separate "demo mode" in the store
- Reset filters when leaving sales page
- Show a limited preview of the card

### 2. CTA Navigation

All CTAs should navigate to appropriate destinations:

| CTA | Destination | Future Behavior |
|-----|-------------|-----------------|
| "Start Learning Now" | `/learn` | → Auth gate → `/learn` |
| "Get Started" (Foundation) | `/learn` | → Stripe → `/learn` |
| "Start Core" | `/learn` | → Stripe → `/learn` |
| "Contact Sales" | `mailto:` or `/contact` | Form or email |
| "View Pricing" | `#pricing` (anchor) | Scroll to section |

### 3. Existing Component Reuse

These existing components may be reused or referenced:

| Component | Reuse Strategy |
|-----------|----------------|
| `FilterBar` | Embed as demo (see above) |
| `TranslationCardView` | Show preview in demo section |
| `colors.ts` | Extend with sales-specific colors |
| CSS patterns | Follow existing `.card`, `.btn` styles |

---

## File Organization

### New Files to Create

```
/src
├── pages/
│   └── SalesPage.tsx            # Main sales page component
├── components/
│   └── sales/                   # NEW: Sales-specific components
│       ├── HeroSection.tsx
│       ├── FeaturesSection.tsx
│       ├── FeatureCard.tsx
│       ├── PricingSection.tsx
│       ├── PricingCard.tsx
│       ├── TestimonialsSection.tsx
│       ├── TestimonialCard.tsx
│       ├── FAQSection.tsx
│       ├── FAQItem.tsx
│       ├── DemoSection.tsx
│       ├── SalesFooter.tsx
│       └── shared/
│           ├── SalesButton.tsx
│           ├── SalesSection.tsx
│           └── SalesBadge.tsx
├── constants/
│   └── salesPageCopy.ts         # NEW: All sales copy in one place
└── index.css                    # Add sales page styles (bottom of file)
```

### Files to Modify

| File | Change |
|------|--------|
| `App.tsx` | Update `/` route to render `SalesPage` instead of `HomePage` |
| `index.css` | Add sales page CSS classes |
| `colors.ts` | Optionally extend with sales accent colors |

### Files to Preserve (No Changes)

- `CardPage.tsx`
- `HistoryPage.tsx`
- `FilterBar.tsx`
- `TranslationCardView.tsx`
- `topicStore.ts`
- `techniques.ts`
- `types/TranslationCard.ts`

---

## Future Auth Gates (Phase 8+)

When authentication is implemented, the architecture will support:

```tsx
// ProtectedRoute.tsx (future)
const ProtectedRoute = ({ children, requiredTier }) => {
  const { isAuthenticated, subscription } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredTier && !hasAccess(subscription, requiredTier)) {
    return <Navigate to="/pricing" />;
  }

  return children;
};

// App.tsx (future)
<Route
  path="/learn"
  element={
    <ProtectedRoute requiredTier="foundation">
      <CardPage />
    </ProtectedRoute>
  }
/>
```

---

## Performance Considerations

1. **Lazy Loading:** Consider lazy-loading sales components if bundle size grows
2. **Image Optimization:** Use WebP format for any testimonial avatars
3. **Font Loading:** Stick with system fonts (current approach) for faster load
4. **Anchor Scrolling:** Use smooth scroll behavior for in-page navigation

---

## Summary

- **Route:** HomePage (`/`) transforms into SalesPage
- **State:** Local React state only, reuse Zustand for demo
- **Components:** Create new `/components/sales/` directory
- **Styling:** Add to existing `index.css`, follow current patterns
- **Integration:** FilterBar demo, CTAs to `/learn`, future auth gates
