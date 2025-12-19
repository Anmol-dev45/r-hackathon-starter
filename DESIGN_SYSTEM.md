# GunaasoNepal Design System

## 📖 Overview

This design system ensures visual and functional consistency across the GunaasoNepal application. All team members **MUST** use these components instead of creating custom styles or components.

## 🎯 Core Principles

1. **Consistency First**: Use design system components for all UI elements
2. **No Hard-Coded Values**: Always reference design tokens from `@/lib/design-system`
3. **Semantic Colors**: Use semantic color names (primary, success, destructive) not direct colors
4. **Accessible**: All components follow WCAG 2.1 AA standards
5. **Responsive**: Mobile-first approach with consistent breakpoints

## 🚀 Quick Start

### Import Components

```tsx
// ✅ CORRECT - Import from design system
import { Button, Card, Heading, Stack, FormField } from '@/components/design-system';

// ❌ WRONG - Don't import from individual files
import { Button } from '@/components/ui/button';
```

### Basic Usage

```tsx
import { Button, Card, Heading, Stack } from '@/components/design-system';

export function MyComponent() {
  return (
    <Card padding="base" hoverable>
      <Stack spacing={4}>
        <Heading level="h2">Welcome</Heading>
        <Button variant="primary" size="lg">
          Get Started
        </Button>
      </Stack>
    </Card>
  );
}
```

## 🎨 Design Tokens

Design tokens are the foundation of our design system. **Never use hard-coded values**.

### Spacing

```tsx
import { spacing } from '@/lib/design-system';

// ✅ CORRECT
<div style={{ padding: spacing[4] }}>Content</div>

// ❌ WRONG
<div style={{ padding: '16px' }}>Content</div>
```

Available spacing: `0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32`

### Colors

Use Tailwind's semantic color classes:

```tsx
// ✅ CORRECT - Semantic colors
<div className="bg-primary text-primary-foreground">
<div className="bg-success text-success-foreground">
<div className="bg-destructive text-destructive-foreground">

// ❌ WRONG - Hard-coded colors
<div className="bg-blue-500 text-white">
<div className="bg-green-600">
```

Available semantic colors:
- `primary` - Main brand color (blue for governance/trust)
- `secondary` - Secondary actions
- `success` - Positive actions/states
- `warning` - Warning messages
- `destructive` - Errors/delete actions
- `muted` - Subtle backgrounds
- `accent` - Highlighted content

## 📦 Component Library

### Layout Components

#### Container
Consistent page width with responsive padding.

```tsx
import { Container } from '@/components/design-system';

<Container maxWidth="xl">
  Your content here
</Container>
```

Props:
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
- `centered`: boolean (default: true)
- `padding`: boolean (default: true)

#### Stack
Vertical spacing between elements.

```tsx
import { Stack } from '@/components/design-system';

<Stack spacing={6}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>
```

Props:
- `spacing`: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20
- `align`: 'start' | 'center' | 'end' | 'stretch'
- `justify`: 'start' | 'center' | 'end' | 'between' | 'around'

#### Inline
Horizontal spacing between elements.

```tsx
import { Inline } from '@/components/design-system';

<Inline spacing={3} align="center">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</Inline>
```

Props: Same as Stack, plus `wrap: boolean`

#### Grid
Responsive grid layouts.

```tsx
import { Grid } from '@/components/design-system';

<Grid cols={3} gap={6} responsive={{ sm: 1, md: 2, lg: 3 }}>
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</Grid>
```

#### Section
Page sections with consistent vertical padding.

```tsx
import { Section } from '@/components/design-system';

<Section paddingY="lg" background="muted">
  <Container>
    Your section content
  </Container>
</Section>
```

Props:
- `paddingY`: 'none' | 'sm' | 'base' | 'lg' | 'xl'
- `background`: 'default' | 'muted' | 'accent'

### Typography Components

#### Heading
Use for all headings.

```tsx
import { Heading } from '@/components/design-system';

<Heading level="h1" size="4xl">Page Title</Heading>
<Heading level="h2" size="2xl">Section Title</Heading>
<Heading level="h3">Subsection Title</Heading>
```

Props:
- `level`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
- `size`: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold'

#### Text
Use for body text.

```tsx
import { Text } from '@/components/design-system';

<Text size="base">Regular paragraph text</Text>
<Text size="sm" variant="muted">Helper text</Text>
<Text weight="semibold">Emphasized text</Text>
```

Props:
- `size`: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
- `variant`: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'destructive'
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold'
- `as`: 'p' | 'span' | 'div' | 'label'

#### DisplayText
Large hero text.

```tsx
import { DisplayText } from '@/components/design-system';

<DisplayText size="lg" gradient>
  गुनासो नेपाल
</DisplayText>
```

### Button Component

```tsx
import { Button } from '@/components/design-system';

// Variants
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Confirm</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Subtle</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// States & Features
<Button loading>Processing...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
<Button leftIcon={<Icon />}>With Icon</Button>
```

Props:
- `variant`: 'default' | 'destructive' | 'success' | 'warning' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg'
- `fullWidth`: boolean
- `loading`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

### Form Components

#### FormField
Complete form field with label, input, error, and helper text.

```tsx
import { FormField } from '@/components/design-system';

<FormField
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  required
  helperText="We'll never share your email"
  error={errors.email}
/>
```

#### TextareaField
Multi-line text input with label.

```tsx
import { TextareaField } from '@/components/design-system';

<TextareaField
  label="Description"
  placeholder="Enter details..."
  required
  rows={5}
  error={errors.description}
/>
```

#### SelectField
Dropdown with label.

```tsx
import { SelectField } from '@/components/design-system';

<SelectField
  label="Category"
  required
  options={[
    { value: 'corruption', label: 'Corruption' },
    { value: 'infrastructure', label: 'Infrastructure' },
  ]}
/>
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/design-system';

<Card variant="default" hoverable>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

Props:
- `variant`: 'default' | 'outline' | 'ghost'
- `padding`: 'none' | 'sm' | 'base' | 'lg'
- `hoverable`: boolean
- `clickable`: boolean

### Badge Component

```tsx
import { Badge } from '@/components/design-system';

<Badge variant="default">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

### Alert Component

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/design-system';

<Alert variant="success" dismissible>
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your complaint has been submitted successfully.
  </AlertDescription>
</Alert>
```

## 🔨 Common Patterns

### Form Layout

```tsx
import { Stack, FormField, TextareaField, SelectField, Button, Card, CardContent } from '@/components/design-system';

<Card>
  <CardContent>
    <form onSubmit={handleSubmit}>
      <Stack spacing={6}>
        <FormField
          label="Full Name"
          type="text"
          required
          error={errors.name}
        />
        
        <SelectField
          label="Category"
          required
          options={categories}
          error={errors.category}
        />
        
        <TextareaField
          label="Description"
          required
          rows={5}
          error={errors.description}
        />
        
        <Button type="submit" fullWidth loading={isSubmitting}>
          Submit Complaint
        </Button>
      </Stack>
    </form>
  </CardContent>
</Card>
```

### Page Layout

```tsx
import { Container, Section, Heading, Text, Stack } from '@/components/design-system';

<Section paddingY="xl">
  <Container maxWidth="lg">
    <Stack spacing={8}>
      <div className="text-center">
        <Heading level="h1" size="4xl">Page Title</Heading>
        <Text size="lg" variant="muted">Page description</Text>
      </div>
      
      {/* Page content */}
    </Stack>
  </Container>
</Section>
```

### Card Grid

```tsx
import { Grid, Card, CardHeader, CardTitle, CardDescription } from '@/components/design-system';

<Grid cols={3} gap={6} responsive={{ sm: 1, md: 2, lg: 3 }}>
  {items.map(item => (
    <Card key={item.id} hoverable clickable>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
    </Card>
  ))}
</Grid>
```

## ❌ Don't Do This

```tsx
// ❌ WRONG - Hard-coded colors
<div className="bg-blue-500 text-white">

// ❌ WRONG - Hard-coded spacing
<div className="mt-[23px] p-[15px]">

// ❌ WRONG - Inconsistent button styles
<button className="bg-blue-500 px-4 py-2 rounded">

// ❌ WRONG - Custom card without design system
<div className="border rounded-lg p-4 shadow">

// ❌ WRONG - Direct HTML headings
<h1 className="text-3xl font-bold">
```

## ✅ Do This Instead

```tsx
// ✅ CORRECT - Semantic colors
<div className="bg-primary text-primary-foreground">

// ✅ CORRECT - Design system spacing
<Stack spacing={6}>

// ✅ CORRECT - Design system button
<Button variant="primary">

// ✅ CORRECT - Design system card
<Card padding="base">

// ✅ CORRECT - Design system heading
<Heading level="h1" size="3xl">
```

## 🎭 Theming

The design system automatically supports light and dark modes through CSS variables. No additional code needed.

## 🤝 Contributing

When adding new components:

1. Create component in `/components/design-system/`
2. Use design tokens from `/lib/design-system/tokens.ts`
3. Export from `/components/design-system/index.ts`
4. Document usage in this file
5. Update existing components to use the new component

## 📞 Support

If you need a component that doesn't exist, please:
1. Check if it can be composed from existing components
2. If not, create an issue for the design system team
3. Don't create one-off custom components

---

**Remember**: Consistency is key to a professional application. Always use the design system!
