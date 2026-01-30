# Implementation Phase Plan

## Overview

This document outlines the step-by-step implementation plan for the sales page, including dependencies, validation checkpoints, and rollback strategies.

---

## Phase Summary

| Phase | Focus | Components | Est. Complexity |
|-------|-------|------------|-----------------|
| 0 | Planning & Documentation | Docs, constants | Low |
| 1 | Foundation Components | Shared components | Medium |
| 2 | Hero Section | HeroSection | Medium |
| 3 | Features & Social Proof | Features, Testimonials | Medium |
| 4 | Pricing Section | Pricing cards | Medium |
| 5 | FAQ & Footer | FAQ accordion, footer | Medium |
| 6 | Final Integration | Polish, testing | Low |

---

## Phase 0: Planning & Documentation (Current)

### Tasks
- [x] Create `/docs/sales-page/ARCHITECTURE.md`
- [x] Create `/docs/sales-page/COMPONENTS.md`
- [x] Create `/docs/sales-page/DESIGN-TOKENS.md`
- [x] Create `/docs/sales-page/SALES-COPY.md`
- [x] Create `/docs/sales-page/PHASE-PLAN.md`
- [x] Create `/src/constants/salesPageCopy.ts`

### Validation Checkpoint 0
**Question to user:**
1. Does the proposed architecture make sense?
2. Do the component breakdowns look correct?
3. Does the sales copy match your vision?
4. Approved to proceed to Phase 1?

### Rollback Strategy
- Delete `/docs/sales-page/` directory
- Delete `/src/constants/salesPageCopy.ts`

---

## Phase 1: Foundation Components

### Objective
Create the shared/reusable components that all section components will depend on.

### Tasks
1. Create `/src/components/sales/` directory structure
2. Implement `SalesButton.tsx`
   - Props: variant, size, href, to, onClick, fullWidth, disabled
   - Variants: primary, secondary, outline
   - Sizes: sm, md, lg
3. Implement `SalesSection.tsx`
   - Props: id, background, className, children
   - Backgrounds: white, gray, dark
4. Implement `SalesBadge.tsx`
   - Props: variant, children
   - Variants: primary, success, warning
5. Add base CSS classes to `index.css`
   - `.sales-btn-*` classes
   - `.sales-section-*` classes
   - `.sales-badge-*` classes

### Files to Create
```
/src/components/sales/
├── shared/
│   ├── SalesButton.tsx
│   ├── SalesSection.tsx
│   ├── SalesBadge.tsx
│   └── index.ts (exports)
└── index.ts (main exports)
```

### Files to Modify
- `/src/index.css` - Add foundation styles

### Dependencies
- None (foundation layer)

### Validation Checkpoint 1
- [ ] All shared components render correctly
- [ ] Button variants look correct
- [ ] Section backgrounds work
- [ ] Badge styles match design tokens
- [ ] No TypeScript errors
- [ ] Styles match existing app design

### Rollback Strategy
- Delete `/src/components/sales/` directory
- Revert changes to `index.css`

---

## Phase 2: Hero Section

### Objective
Create the hero section that appears at the top of the sales page.

### Tasks
1. Implement `HeroSection.tsx`
   - Headline, subheadline from salesPageCopy
   - Benefits list with checkmarks
   - Two CTA buttons (primary + outline)
   - Responsive layout (2-col desktop, 1-col mobile)
2. Add hero-specific CSS
3. Create placeholder `SalesPage.tsx` with just hero
4. Wire up routing in `App.tsx` (temporarily)

### Files to Create
```
/src/components/sales/
└── HeroSection.tsx

/src/pages/
└── SalesPage.tsx (basic structure with hero only)
```

### Files to Modify
- `/src/index.css` - Add hero styles
- `/src/App.tsx` - Add temporary route for testing

### Dependencies
- Phase 1: SalesButton, SalesSection

### Validation Checkpoint 2
- [ ] Hero displays correctly at `/sales` (temp route)
- [ ] Headline and subheadline render
- [ ] Benefits show with checkmarks
- [ ] CTAs work (primary goes to /learn, secondary scrolls)
- [ ] Responsive on mobile
- [ ] Matches design tokens (colors, spacing)

### Rollback Strategy
- Revert `App.tsx` to remove temp route
- Delete `HeroSection.tsx`
- Delete `SalesPage.tsx`
- Revert hero styles in `index.css`

---

## Phase 3: Features & Social Proof

### Objective
Create the features grid and testimonials section.

### Tasks
1. Implement `FeatureCard.tsx`
   - Icon, title, description
   - Hover state
2. Implement `FeaturesSection.tsx`
   - 3-column grid
   - Maps over salesPageCopy.features
3. Implement `TestimonialCard.tsx`
   - Quote, author, role, company
   - Decorative quote mark
4. Implement `TestimonialsSection.tsx`
   - 3-column grid
   - Maps over salesPageCopy.testimonials
5. Add to SalesPage.tsx

### Files to Create
```
/src/components/sales/
├── FeatureCard.tsx
├── FeaturesSection.tsx
├── TestimonialCard.tsx
└── TestimonialsSection.tsx
```

### Files to Modify
- `/src/pages/SalesPage.tsx` - Add sections
- `/src/index.css` - Add feature/testimonial styles

### Dependencies
- Phase 1: SalesSection
- Phase 2: SalesPage exists

### Validation Checkpoint 3
- [ ] Feature cards display in grid
- [ ] Icons render correctly (from lucide-react)
- [ ] Grid is responsive (3 → 2 → 1 columns)
- [ ] Testimonials display
- [ ] Quote styling looks professional
- [ ] Hover states work

### Rollback Strategy
- Remove sections from `SalesPage.tsx`
- Delete feature/testimonial components
- Revert related styles in `index.css`

---

## Phase 4: Pricing Section

### Objective
Create the pricing comparison section with three tiers.

### Tasks
1. Implement `PricingCard.tsx`
   - Tier name, price, period
   - Features list with checkmarks
   - CTA button
   - Highlighted state with badge
2. Implement `PricingSection.tsx`
   - 3-column grid
   - Maps over salesPageCopy.pricing.tiers
   - Optional monthly/annual toggle (future)
3. Add to SalesPage.tsx with id="pricing" for anchor

### Files to Create
```
/src/components/sales/
├── PricingCard.tsx
└── PricingSection.tsx
```

### Files to Modify
- `/src/pages/SalesPage.tsx` - Add pricing section
- `/src/index.css` - Add pricing styles

### Dependencies
- Phase 1: SalesButton, SalesSection, SalesBadge

### Validation Checkpoint 4
- [ ] Three pricing tiers display
- [ ] Core tier is highlighted with badge
- [ ] Feature lists show checkmarks
- [ ] Prices display correctly ($9, $29, $79)
- [ ] CTA buttons work
- [ ] "View Pricing" from hero scrolls to section
- [ ] Responsive on mobile

### Rollback Strategy
- Remove pricing section from `SalesPage.tsx`
- Delete pricing components
- Revert related styles in `index.css`

---

## Phase 5: FAQ & Footer

### Objective
Create the FAQ accordion and footer with final CTA.

### Tasks
1. Implement `FAQItem.tsx`
   - Question, answer
   - Expand/collapse with animation
   - Chevron rotation
2. Implement `FAQSection.tsx`
   - Maps over salesPageCopy.faq
   - Manages open/closed state
3. Implement `SalesFooter.tsx`
   - Final CTA section
   - Footer links
   - Copyright notice
4. Add to SalesPage.tsx

### Files to Create
```
/src/components/sales/
├── FAQItem.tsx
├── FAQSection.tsx
└── SalesFooter.tsx
```

### Files to Modify
- `/src/pages/SalesPage.tsx` - Add FAQ and footer
- `/src/index.css` - Add FAQ/footer styles

### Dependencies
- Phase 1: SalesButton, SalesSection

### Validation Checkpoint 5
- [ ] FAQ accordion works (click to expand/collapse)
- [ ] Only one FAQ open at a time (or all can be open - decide)
- [ ] Animation is smooth
- [ ] Footer displays with links
- [ ] Final CTA is prominent
- [ ] Copyright shows

### Rollback Strategy
- Remove FAQ/footer from `SalesPage.tsx`
- Delete FAQ and footer components
- Revert related styles in `index.css`

---

## Phase 6: Final Integration & Polish

### Objective
Replace HomePage with SalesPage, polish, and test.

### Tasks
1. Update `App.tsx` routing
   - Change `/` to render `SalesPage`
   - Keep `/learn` and `/history` unchanged
2. Update navbar logic (if needed)
   - Consider hiding full nav on sales page
   - Or keep as-is for now
3. Add smooth scroll behavior for anchor links
4. Test all interactive elements
5. Test responsive layouts at all breakpoints
6. Cross-browser testing (Chrome, Firefox, Safari)
7. Accessibility check
   - Keyboard navigation
   - Screen reader basics
   - Color contrast
8. Performance check
   - No layout shift
   - Fast load time

### Files to Modify
- `/src/App.tsx` - Update routing
- `/src/index.css` - Final polish styles
- `/src/pages/SalesPage.tsx` - Final adjustments

### Files to Preserve (No Changes)
- `/src/pages/CardPage.tsx`
- `/src/pages/HistoryPage.tsx`
- `/src/components/FilterBar.tsx`
- `/src/components/TranslationCardView.tsx`
- `/src/store/topicStore.ts`

### Validation Checkpoint 6 (Final)
- [ ] `/` shows sales page
- [ ] `/learn` still works exactly as before
- [ ] `/history` still works exactly as before
- [ ] All CTAs navigate correctly
- [ ] Anchor scrolling works (#pricing, #features)
- [ ] Mobile layout is correct
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds (`npm run build`)

### Rollback Strategy
- Revert `App.tsx` to point `/` to `HomePage`
- Sales page components remain but are not used
- Can be removed later if completely abandoning

---

## Optional: Phase 7 - Interactive Demo

### Objective
Add interactive FilterBar demo to sales page.

### Tasks
1. Implement `DemoSection.tsx`
   - Embed existing `FilterBar`
   - "Generate Sample" button
   - Preview of card (truncated)
2. Handle store state for demo
   - Consider demo mode flag
   - Or just use real store

### Dependencies
- All previous phases complete
- Existing `FilterBar` and `TranslationCardView`

### Note
This phase is optional and can be deferred. The sales page is complete and functional without an interactive demo.

---

## Future: Phase 8 - Authentication Gates

### Scope (Not in current implementation)
- Add authentication system
- Add payment integration (Stripe)
- Add protected routes
- Add user dashboard
- Conditionally render navbar

This phase requires backend integration and is outside the current sales page scope.

---

## Dependency Graph

```
Phase 0 (Planning)
    ↓
Phase 1 (Foundation: Button, Section, Badge)
    ↓
    ├── Phase 2 (Hero)
    │       ↓
    │   Phase 3 (Features, Testimonials)
    │       ↓
    │   Phase 4 (Pricing)
    │       ↓
    │   Phase 5 (FAQ, Footer)
    │       ↓
    └── Phase 6 (Integration)
            ↓
        Phase 7 (Demo - Optional)
            ↓
        Phase 8 (Auth - Future)
```

---

## Risk Mitigation

### Risk: Breaking Existing Functionality
**Mitigation:**
- Never modify CardPage, HistoryPage, FilterBar, TranslationCardView, or topicStore
- Test `/learn` and `/history` after each phase
- Keep backup of original HomePage

### Risk: Style Conflicts
**Mitigation:**
- Prefix all new classes with `sales-`
- Use specific selectors
- Test existing pages don't change visually

### Risk: Large CSS File
**Mitigation:**
- Consider splitting into `/styles/sales.css` if index.css gets too large
- Import from index.css or main.tsx

### Risk: Scope Creep
**Mitigation:**
- Stick to the defined phases
- No "just one more feature" during implementation
- Save ideas for future phases

---

## Success Criteria

The sales page is complete when:

1. **Functional Requirements**
   - All sections display correctly
   - All CTAs work and navigate properly
   - Anchor links scroll smoothly
   - Mobile responsive at all breakpoints

2. **Non-Functional Requirements**
   - Page loads in under 2 seconds
   - No console errors
   - TypeScript compiles without errors
   - Build succeeds

3. **Preservation Requirements**
   - `/learn` works identically to before
   - `/history` works identically to before
   - No visual changes to existing pages
   - Store behavior unchanged
