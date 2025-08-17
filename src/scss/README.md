# Color Token System

This document describes the color token system implemented for the Sky template.

## Overview

The color token system centralizes all color definitions in `src/scss/_tokens.scss` to provide:
- Consistent color usage across components
- Easy theme management
- Semantic naming for better maintainability

## Token Categories

### Brand Colors
- `$color-primary` - Main brand accent color (#ff5252)
- `$color-primary-accent` - Active states and highlights (rgba(243, 92, 88, 0.99))

### Background Colors
- `$color-bg-primary` - Main body background (#f8f9fb)
- `$color-bg-secondary` - Header/footer background (#f1f2fa)
- `$color-bg-tertiary` - Button/control backgrounds (#fafaff)
- `$color-bg-surface` - Cards and content surfaces (#ffffff)

### Text Colors
- `$color-text-primary` - Primary text (rgba(0, 0, 0, 0.87))
- `$color-text-secondary` - Secondary text (rgba(0, 0, 0, 0.6))
- `$color-text-muted` - Muted text (#6c757d)
- `$color-text-hover` - Hover states (rgba(0, 0, 0, 0.8))
- `$color-text-menu` - Menu text (rgb(96, 96, 100))

### Shadow Colors
- `$color-shadow-light` - Light shadows (rgba(0, 0, 0, 0.08))
- `$color-shadow-medium` - Medium shadows (rgba(0, 0, 0, 0.12))
- `$color-shadow-dark` - Dark shadows (rgba(0, 0, 0, 0.15))
- `$color-shadow-heavy` - Heavy shadows (rgba(0, 0, 0, 0.38))

### Interactive States
- `$color-hover-bg` - Hover background (rgba(0, 0, 0, 0.04))
- `$color-active-indicator` - Active indicators (rgba(243, 92, 88, 0.99))

## Usage

Import the tokens file first in your SCSS:

```scss
@import "tokens";
@import "components/header";
// ... other imports
```

Use semantic tokens instead of hardcoded colors:

```scss
// Good ✅
.my-component {
  background: $color-bg-surface;
  color: $color-text-primary;
  box-shadow: 0 4px 8px $color-shadow-medium;
}

// Avoid ❌
.my-component {
  background: #ffffff;
  color: rgba(0, 0, 0, 0.87);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}
```

## Backward Compatibility

Legacy variables are maintained for backward compatibility:
- `$bg` → `$color-bg-primary`
- `$card-bg` → `$color-bg-surface`
- `$muted` → `$color-text-muted`
- `$accent` → `$color-primary`

## Benefits

1. **Centralized Management**: All colors defined in one place
2. **Semantic Naming**: Token names reflect their purpose
3. **Easy Theming**: Change token values to update entire theme
4. **Consistency**: Eliminates color variations across components
5. **Maintainability**: Easier to update and maintain color schemes