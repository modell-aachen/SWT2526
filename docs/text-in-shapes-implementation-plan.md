# Implementation Plan: Text in Shapes Feature

## Overview

Add the ability for shapes to display text (title + paragraph) that stays upright even when the shape rotates. Additionally, introduce a new "Text" shape type for standalone text without a visible shape boundary.

---

## Requirements

| #   | Requirement             | Details                                                             |
| --- | ----------------------- | ------------------------------------------------------------------- |
| 1   | No placeholder text     | `text` property is `undefined` by default                           |
| 2   | Sidebar editing         | Text is edited in `RightSidebar.vue`, not inline                    |
| 3   | Title + Paragraph       | Two text fields: a header and a description                         |
| 4   | Non-rotating text       | Text stays upright; shape rotation does not affect text orientation |
| 5   | Generic polygon support | Algorithm works with any SVG polygon, not hardcoded per shape       |
| 6   | Standalone Text element | New `text` shape type (invisible rectangle)                         |
| 7   | Overflow handling       | Truncate with `...` when text exceeds available space               |

---

## Technical Approach

### Counter-Rotating Text Strategy

Instead of recalculating text bounds based on rotated vertices, we use a simpler approach:

1. **Inscribed rectangle** is calculated for the **unrotated** shape (simpler geometry)
2. **Text container** (SVG `<foreignObject>`) rotates **with** the shape polygon
3. **Text content** inside counter-rotates by `-rotation` degrees to stay upright

```
┌─────────────────────────────────────────────────────────────┐
│  Shape rotates 45°                                          │
│                                                              │
│       ◇                    ◇                                 │
│      ╱ ╲    text box      ╱ ╲                                │
│     ╱   ╲   rotates      ╱───╲  ← text content               │
│    ╱─────╲  with shape  ╱     ╲   counter-rotates -45°       │
│   ╱───────╲            ╱───────╲  to stay upright            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Benefits:**

- Uses existing `useShapeBasePoints` for inscribed rect calculation
- Container stays aligned with shape boundaries during rotation
- Only a CSS transform is needed for the text content

---

## File Changes

### New Files

| File                                               | Description                                 |
| -------------------------------------------------- | ------------------------------------------- |
| `src/composables/useTextBounds.ts`                 | Calculate inscribed rectangle for text area |
| `src/composables/useTextBounds.spec.ts`            | Unit tests for text bounds calculation      |
| `src/components/shapes/Text/TextComponent.vue`     | Invisible rectangle for standalone text     |
| `src/components/shapes/Text/TextComponent.spec.ts` | Tests for text shape component              |

### Modified Files

| File                                                   | Changes                                         |
| ------------------------------------------------------ | ----------------------------------------------- |
| `src/types/Shape.ts`                                   | Add `ShapeText` interface and `text` property   |
| `src/types/ShapeType.ts`                               | Add `'text'` to union type                      |
| `src/stores/shapes/shapes.ts`                          | Add `updateShapeText`, `clearShapeText` actions |
| `src/stores/shapes/shapes.spec.ts`                     | Tests for new store actions                     |
| `src/composables/useShapeBasePoints.ts`                | Add inscribed rect data for each shape type     |
| `src/components/ShapeWrapper/ShapeWrapper.vue`         | Render text overlay with counter-rotation       |
| `src/components/ShapeWrapper/ShapeWrapper.spec.ts`     | Tests for text rendering                        |
| `src/components/Sidebar/rightBar/RightSidebar.vue`     | Add title/paragraph input fields                |
| `src/components/Sidebar/rightBar/RightSidebar.spec.ts` | Tests for text editing UI                       |
| `src/components/Sidebar/leftBar/LeftSidebar.vue`       | Add "Text" shape to toolbar                     |

---

## Implementation Phases

### Phase 1: Data Model

**Goal:** Extend type system and store to support text properties.

#### 1.1 Extend `Shape.ts`

```typescript
export interface ShapeText {
  title?: string
  paragraph?: string
}

export interface Shape {
  // ... existing properties
  text?: ShapeText // undefined = no text
}
```

#### 1.2 Extend `ShapeType.ts`

```typescript
export type ShapeType = 'rectangle' | 'triangle' | 'trapezoid' | 'text'
```

#### 1.3 Add store actions in `shapes.ts`

```typescript
updateShapeText(id: string, text: ShapeText | undefined) {
  const shape = this.shapes.find((s) => s.id === id)
  if (shape) {
    shape.text = text
    this.saveSnapshot()
  }
},

clearShapeText(id: string) {
  this.updateShapeText(id, undefined)
}
```

---

### Phase 2: Text Bounds Calculation

**Goal:** Create composable to calculate inscribed rectangle for any shape.

#### 2.1 Create `useTextBounds.ts`

```typescript
import type { ShapeType } from '@/types/ShapeType'
import type { Shape } from '@/types/Shape'

interface TextBounds {
  x: number // Offset from shape left edge (in viewBox units 0-100)
  y: number // Offset from shape top edge
  width: number // Width in viewBox units
  height: number // Height in viewBox units
}

export function useTextBounds() {
  /**
   * Get inscribed rectangle for a shape type.
   * Values are in viewBox coordinates (0-100 scale).
   */
  const getInscribedRect = (shapeType: ShapeType): TextBounds => {
    switch (shapeType) {
      case 'rectangle':
      case 'text':
        return { x: 10, y: 10, width: 80, height: 80 }
      case 'triangle':
        // Triangle: inscribed rect is in lower-center area
        return { x: 25, y: 40, width: 50, height: 50 }
      case 'trapezoid':
        // Trapezoid: inscribed rect avoids sloped edges
        return { x: 20, y: 20, width: 60, height: 70 }
      default:
        return { x: 15, y: 15, width: 70, height: 70 }
    }
  }

  /**
   * Convert viewBox bounds to actual pixel values.
   */
  const getPixelBounds = (shape: Shape): TextBounds => {
    const viewBoxBounds = getInscribedRect(shape.type)
    return {
      x: (viewBoxBounds.x / 100) * shape.width,
      y: (viewBoxBounds.y / 100) * shape.height,
      width: (viewBoxBounds.width / 100) * shape.width,
      height: (viewBoxBounds.height / 100) * shape.height,
    }
  }

  return {
    getInscribedRect,
    getPixelBounds,
  }
}
```

---

### Phase 3: Text Rendering in ShapeWrapper

**Goal:** Render text overlay with counter-rotation.

#### 3.1 Modify `ShapeWrapper.vue`

Add after the shape component:

```vue
<!-- Text overlay (inside SVG, rotates with shape) -->
<foreignObject
  v-if="text?.title || text?.paragraph"
  :x="textBounds.x"
  :y="textBounds.y"
  :width="textBounds.width"
  :height="textBounds.height"
  class="pointer-events-none overflow-hidden"
>
  <div
    xmlns="http://www.w3.org/1999/xhtml"
    class="shape-text-content"
    :style="{
      transform: `rotate(${-rotation}deg)`,
      transformOrigin: 'center center',
      width: '100%',
      height: '100%',
    }"
  >
    <h3 v-if="text.title" class="shape-text-title">
      {{ text.title }}
    </h3>
    <p v-if="text.paragraph" class="shape-text-paragraph">
      {{ text.paragraph }}
    </p>
  </div>
</foreignObject>
```

#### 3.2 Add CSS styles

```css
.shape-text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 4px;
  overflow: hidden;
}

.shape-text-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.shape-text-paragraph {
  font-size: 0.75rem;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
```

---

### Phase 4: RightSidebar Text Editing

**Goal:** Add title and paragraph inputs to the properties panel.

#### 4.1 Modify `RightSidebar.vue`

Add after the Link section:

```vue
<!-- Text Section -->
<div class="flex flex-col gap-2 border-t border-ma-grey-300 pt-4">
  <Label for="shape-title" class="text-xs font-medium text-ma-text-01">
    Title
  </Label>
  <input
    id="shape-title"
    v-model="titleValue"
    data-testid="shape-title-input"
    class="h-8 px-2 text-sm border border-ma-grey-300 rounded-md bg-ma-grey-100 text-ma-text-01"
    placeholder="Enter title..."
    @input="debouncedUpdateText"
  />
</div>

<div class="flex flex-col gap-2">
  <Label for="shape-paragraph" class="text-xs font-medium text-ma-text-01">
    Description
  </Label>
  <textarea
    id="shape-paragraph"
    v-model="paragraphValue"
    data-testid="shape-paragraph-input"
    class="px-2 py-1 text-xs border border-ma-grey-300 rounded-md bg-ma-grey-100 text-ma-text-01 resize-none"
    rows="4"
    placeholder="Enter description..."
    @input="debouncedUpdateText"
  />
</div>
```

#### 4.2 Add script logic

```typescript
import { useDebounceFn } from '@vueuse/core'

const titleValue = ref('')
const paragraphValue = ref('')

// Sync with selected shape
watch(
  selectedShape,
  (newShape) => {
    if (newShape) {
      titleValue.value = newShape.text?.title ?? ''
      paragraphValue.value = newShape.text?.paragraph ?? ''
    } else {
      titleValue.value = ''
      paragraphValue.value = ''
    }
  },
  { immediate: true }
)

// Debounced update to avoid excessive store updates
const updateText = () => {
  if (selectedShape.value) {
    const text = {
      title: titleValue.value || undefined,
      paragraph: paragraphValue.value || undefined,
    }
    // Only set if at least one field has content
    if (text.title || text.paragraph) {
      shapesStore.updateShapeText(selectedShape.value.id, text)
    } else {
      shapesStore.clearShapeText(selectedShape.value.id)
    }
  }
}

const debouncedUpdateText = useDebounceFn(updateText, 300)
```

---

### Phase 5: Text Shape Type

**Goal:** Create standalone text element (invisible rectangle).

#### 5.1 Create `TextComponent.vue`

```vue
<template>
  <svg
    data-testid="text-shape"
    :width="width"
    :height="height"
    viewBox="0 0 100 100"
  >
    <!-- Dashed border only visible when selected -->
    <rect
      data-testid="text-boundary"
      x="5"
      y="5"
      width="90"
      height="90"
      :stroke="'var(--ma-primary-500)'"
      :stroke-dasharray="selected ? '4,4' : '0'"
      :stroke-opacity="selected ? 1 : 0"
      fill="transparent"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  rotation: { type: Number, default: 0 },
  outline: { type: String, default: 'transparent' },
  fill: { type: String, default: 'transparent' },
  selected: { type: Boolean, default: false },
})
</script>
```

#### 5.2 Update `useShapeBasePoints.ts`

```typescript
case 'text':
  return '5,5 95,5 95,95 5,95'  // Same as rectangle
```

#### 5.3 Update `ShapeWrapper.vue` component mapping

```typescript
import TextShape from '../shapes/Text/TextComponent.vue'

case 'text':
  return TextShape
```

#### 5.4 Add to LeftSidebar

Add "Text" button to the shape toolbar with a `Type` icon from lucide-vue-next.

---

## Verification Plan

### Automated Tests

Run all tests with:

```bash
yarn test:run
```

#### New Test Files

| File                    | Test Cases                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `useTextBounds.spec.ts` | - Returns correct bounds for each shape type<br>- Converts viewBox to pixel values correctly                 |
| `TextComponent.spec.ts` | - Renders with correct dimensions<br>- Shows dashed border when selected<br>- Hides border when not selected |

#### Modified Test Files

| File                   | Additional Test Cases                                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shapes.spec.ts`       | - `updateShapeText` sets text property<br>- `clearShapeText` removes text<br>- Text is preserved in undo/redo                                               |
| `RightSidebar.spec.ts` | - Title input displays shape title<br>- Paragraph input displays shape paragraph<br>- Inputs update store on change<br>- Inputs clear when shape deselected |
| `ShapeWrapper.spec.ts` | - Renders text when shape has title<br>- Renders paragraph when shape has paragraph<br>- Hides text when both are empty<br>- Text counter-rotates correctly |

### Manual Verification

| Step | Action                                         | Expected Result                                |
| ---- | ---------------------------------------------- | ---------------------------------------------- |
| 1    | Run `yarn dev` and open http://localhost:5173  | App loads without errors                       |
| 2    | Add a Rectangle shape                          | Rectangle appears, no text visible             |
| 3    | Select the rectangle, open RightSidebar        | Title and Description inputs are empty         |
| 4    | Enter "Hello" in Title, "World" in Description | Text appears inside rectangle, centered        |
| 5    | Rotate the shape (90°)                         | Shape rotates, text stays upright              |
| 6    | Resize the shape smaller                       | Text truncates with `...` if too long          |
| 7    | Add a Triangle and enter text                  | Text appears in center-bottom area of triangle |
| 8    | Add a "Text" element from toolbar              | Invisible element appears with dashed border   |
| 9    | Enter text in the Text element                 | Text displays without visible shape boundary   |
| 10   | Deselect the Text element                      | Dashed border disappears, only text visible    |
| 11   | Undo/Redo after editing text                   | Text changes are properly undone/redone        |
| 12   | Run `yarn test:run`                            | All tests pass                                 |

---

## Open Questions

1. **Font sizing**: Should text auto-scale to fit, or use fixed sizes?
   - **Recommendation**: Start with fixed sizes, add auto-scale later if needed.

2. **Text alignment options**: Should users be able to left/center/right align?
   - **Recommendation**: Start with center-aligned, add options in Phase 2.

3. **Rich text**: Should we support bold/italic/links in text?
   - **Recommendation**: Out of scope for initial implementation.

---

## Rollout Checklist

- [ ] Phase 1: Data Model complete, tests passing
- [ ] Phase 2: Text Bounds composable complete, tests passing
- [ ] Phase 3: Text rendering in ShapeWrapper complete, tests passing
- [ ] Phase 4: RightSidebar text editing complete, tests passing
- [ ] Phase 5: Text shape type complete, tests passing
- [ ] All manual verification steps pass
- [ ] `yarn format` and `yarn test:run` succeed
- [ ] PR created and reviewed
