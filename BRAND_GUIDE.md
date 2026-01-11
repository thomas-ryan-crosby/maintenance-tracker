# proppli — Brand Style Guide

**Property Operations Software**

---

## Table of Contents

1. [Brand Positioning](#1-brand-positioning)
2. [Logo System](#2-logo-system)
3. [Color Palette](#3-color-palette)
4. [Typography](#4-typography)
5. [Iconography Style](#5-iconography-style)
6. [UI & Product Design Language](#6-ui--product-design-language)
7. [Apparel & Merch Usage](#7-apparel--merch-usage)
8. [Voice & Tone](#8-voice--tone)
9. [What proppli is NOT](#9-what-proppli-is-not)
10. [Logo Files Reference](#10-logo-files-reference)

---

## 1. Brand Positioning

### Brand Essence

**A modern operating system for real estate.**

### What proppli stands for

- **Operational clarity**
- **Calm, confident control**
- **Tech-forward but human**
- **Built for scale** (HOAs, property managers, owners, operators)

### Brand Personality

- **Clean**
- **Smart**
- **Quietly powerful**
- **Trustworthy**
- **Not flashy, not corporate, not gimmicky**

---

## 2. Logo System

### Primary Logo

- **Rounded hex-style mark** with softened edges
- **Abstract building form** (not a house, not a pin)
- **Balanced geometry** → communicates structure + systems
- **Wordmark in lowercase:** proppli

### Logo Principles

✅ **DO:**
- Always lowercase (reinforces modern SaaS tone)
- Keep generous whitespace around it

❌ **DON'T:**
- Never outline the logo
- Never add shadows, glows, or textures
- Never rotate or skew

### Minimum Clear Space

**Clear space = height of the letter "o" in proppli**

No text, icons, or edges inside this zone.

### Minimum Size

- **Digital:** 24px height (icon), 80px width (full logo)
- **Print:** 0.75 in wide minimum

### Logo Files

All logo files are stored in `assets/images/logos/`:

- `LogoOnly.png` - Icon only (rounded hex-style mark)
- `WordOnly.png` - Wordmark only (lowercase "proppli")
- `Logo+Word.png` - Full logo (icon + wordmark)

---

## 3. Color Palette

### Primary Colors

#### Proppli Blue (Primary)

- **HEX:** `#2563EB`
- **RGB:** `37, 99, 235`

**Use for:**
- Primary buttons
- Logo icon
- Active states

#### Deep Slate (Text / UI)

- **HEX:** `#1F2937`
- **RGB:** `31, 41, 55`

**Use for:**
- Wordmark
- Headlines
- Body text

### Secondary / Support Colors

#### Soft Blue

- **HEX:** `#60A5FA`

**Use for:**
- Hover states
- Secondary icons
- Highlights

#### Cloud White

- **HEX:** `#FFFFFF`

**Use for:**
- Backgrounds
- Logo knockouts
- Apparel prints

#### Mist Gray

- **HEX:** `#E5E7EB`

**Use for:**
- Dividers
- UI borders
- Subtle backgrounds

### Color Usage Notes

⚠️ **Avoid gradients in most applications. Flat color wins for apparel and UI longevity.**

---

## 4. Typography

### Primary Typeface (Recommended)

**Inter**

- Free, modern, extremely readable
- Designed for software interfaces

**Weights:**
- Regular (400)
- Medium (500)
- SemiBold (600)

**Use:**
- **Headlines:** SemiBold
- **UI labels:** Medium
- **Body copy:** Regular

### Alternate (More Brand-Heavy Option)

**Sora**

- Slightly more personality
- Good for marketing pages & merch

### Implementation

```css
/* Primary Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Headlines */
font-weight: 600; /* SemiBold */

/* UI Labels */
font-weight: 500; /* Medium */

/* Body Copy */
font-weight: 400; /* Regular */
```

---

## 5. Iconography Style

### Icon Principles

- **Rounded corners**
- **1.5px or 2px stroke**
- **No fills** unless used sparingly
- **Simple geometric shapes**
- **Consistent visual weight**

**Think:** Lucide / Phosphor Icons, not Material or FontAwesome heavy sets.

### Recommended Icon Libraries

- [Lucide Icons](https://lucide.dev/)
- [Phosphor Icons](https://phosphoricons.com/)

---

## 6. UI & Product Design Language

### Design Principles

- **White space > decoration**
- **Soft corners** (6–12px radius)
- **Calm layouts**
- **Fewer lines, more spacing**

### Buttons

- **Rounded** (8–10px)
- **Solid blue primary** (`#2563EB`)
- **Subtle hover** (darken 5–8%)

**Example:**
```css
.button-primary {
  background-color: #2563EB;
  border-radius: 8px;
  padding: 10px 20px;
  transition: background-color 0.2s;
}

.button-primary:hover {
  background-color: #1d4ed8; /* ~8% darker */
}
```

### Cards

- **White background**
- **Light gray border** OR **soft shadow** (never both)
- **Radius matches buttons** (8–10px)

**Example:**
```css
.card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 20px;
  /* OR use shadow instead of border */
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); */
}
```

---

## 7. Apparel & Merch Usage

This is where your instinct is right — it needs to feel good on a shirt.

### Best Applications

- **White tee** with blue icon only (no wordmark)
- **Navy tee** with white wordmark
- **Hat:** icon centered, small
- **Sticker:** icon-only or stacked logo

### Apparel Rules

- ✅ Prefer icon-only on merch
- ✅ No taglines on shirts
- ✅ No gradients on fabric
- ✅ 1-color prints preferred

---

## 8. Voice & Tone

### How proppli sounds

- **Clear**
- **Direct**
- **Confident**
- **No fluff**

### Good Example

> "Everything you need to run your properties, in one system."

### Avoid

- ❌ Buzzwords
- ❌ Overly clever copy
- ❌ Corporate jargon

### Writing Guidelines

**DO:**
- Use active voice
- Be specific and concrete
- Write for clarity first
- Use "you" to address users directly

**DON'T:**
- Use marketing fluff ("revolutionary", "game-changing")
- Be overly casual or playful
- Use unnecessary jargon
- Make claims without substance

---

## 9. What proppli is NOT

- ❌ Not a real estate marketplace
- ❌ Not a landlord gimmick app
- ❌ Not cute or playful
- ❌ Not enterprise-boring

---

## 10. Logo Files Reference

### File Locations

All logo files are located in: `assets/images/logos/`

### Available Files

1. **LogoOnly.png**
   - Icon only (rounded hex-style mark)
   - Use for: Favicons, app icons, merch (icon-only)

2. **WordOnly.png**
   - Wordmark only (lowercase "proppli")
   - Use for: Horizontal layouts, wordmark-only applications

3. **Logo+Word.png**
   - Full logo (icon + wordmark)
   - Use for: Primary branding, headers, marketing materials

### Usage in Code

```html
<!-- Full Logo -->
<img src="assets/images/logos/Logo+Word.png" alt="proppli" height="40">

<!-- Icon Only -->
<img src="assets/images/logos/LogoOnly.png" alt="proppli" height="24">

<!-- Wordmark Only -->
<img src="assets/images/logos/WordOnly.png" alt="proppli" height="24">
```

### Favicon Implementation

```html
<link rel="icon" type="image/png" href="assets/images/logos/LogoOnly.png">
```

---

## Quick Reference

### Primary Colors
- **Proppli Blue:** `#2563EB`
- **Deep Slate:** `#1F2937`

### Typography
- **Font:** Inter
- **Headlines:** 600 (SemiBold)
- **Labels:** 500 (Medium)
- **Body:** 400 (Regular)

### Border Radius
- **Buttons:** 8–10px
- **Cards:** 8–10px
- **General UI:** 6–12px

### Spacing
- **Generous whitespace** is key
- **Minimum clear space** around logo = height of "o"

---

## Brand Checklist

When implementing proppli branding:

- [ ] Logo is always lowercase
- [ ] Using Proppli Blue (`#2563EB`) for primary actions
- [ ] Inter font family is loaded
- [ ] Buttons have 8–10px border radius
- [ ] Cards use white background with subtle border or shadow
- [ ] Generous whitespace around elements
- [ ] No gradients (flat colors only)
- [ ] Icons use rounded corners and consistent stroke weight
- [ ] Copy is clear, direct, and confident
- [ ] No shadows, glows, or textures on logo

---

**Last Updated:** 2024

**Version:** 1.0

---

*This brand guide is a living document. As proppli evolves, this guide will be updated to reflect new brand standards and best practices.*
