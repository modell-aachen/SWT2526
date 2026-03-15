# Whiteboard-v2

A modern, Vue 3-based whiteboard and diagramming library for building interactive canvas applications.

## Installation

```bash
npm install whiteboard-v2
# or
yarn add whiteboard-v2
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install vue@^3.5 pinia@^3.0
```

## Quick Start

### 1. Import the styles

```ts
import 'whiteboard-v2/style.css'
```

### 2. Set up Pinia store

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

### 3. Use the components

```vue
<script setup lang="ts">
import { EditPage } from 'whiteboard-v2'
</script>

<template>
  <EditPage />
</template>
```

## Exports

### Components

| Component  | Description                                              |
| ---------- | -------------------------------------------------------- |
| `EditPage` | Full-featured editor with sidebars, toolbars, and canvas |

### Stores (Pinia)

| Store              | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `useElementsStore` | Manages canvas elements, selection, clipboard, and history |
| `useZoomStore`     | Controls zoom level                                        |
| `useDragStore`     | Manages drag state and ghost elements                      |

### Types

All TypeScript types are exported for type-safe integration:

- `Element` - Base element interface
- `GroupElement` - Grouped elements
- `ShapeType` - Available shape types
- `SnapLine` - Snapping guide types
- `ElementWrapperEvents` - Event interfaces
- `ResizeEvents` - Resize event interfaces

## Features

### Shape Types

- Rectangle, Triangle, Trapezoid, Chevron
- Hexagon, Ellipse, Diamond, Parallelogram
- Pentagon, Arrow, Line, Horizontal Line
- Custom shapes

### Editing Capabilities

- Drag and drop positioning
- 8-direction resize handles
- 90-degree rotation
- Multi-element selection
- Shape grouping and ungrouping
- Copy, paste, and duplicate
- Undo/redo history (up to 50 states)
- Smart snap alignment guides

### Canvas Features

- Grid-based canvas
- Zoom controls (in, out, fit to view)
- Dark mode support
- Save/load JSON files
- Template support

### Keyboard Shortcuts

| Shortcut               | Action                        |
| ---------------------- | ----------------------------- |
| `Arrow keys`           | Move selected elements (5px)  |
| `Shift + Arrow keys`   | Move selected elements (20px) |
| `Ctrl/Cmd + C`         | Copy                          |
| `Ctrl/Cmd + V`         | Paste                         |
| `Ctrl/Cmd + D`         | Duplicate                     |
| `Ctrl/Cmd + G`         | Group elements                |
| `Ctrl/Cmd + Shift + G` | Ungroup                       |
| `Ctrl/Cmd + S`         | Save                          |
| `Delete / Backspace`   | Delete selected               |

## Advanced Usage

### Using stores directly

```vue
<script setup lang="ts">
import { useElementsStore, useZoomStore } from 'whiteboard-v2'

const elementsStore = useElementsStore()
const zoomStore = useZoomStore()

// Add an element programmatically
elementsStore.addElement({
  type: 'shape',
  shapeType: 'rectangle',
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  fillColor: '#3b82f6',
  outlineColor: '#1e40af',
})

// Control zoom
zoomStore.setZoom(1.5)
</script>
```

### Save and load canvas state

```ts
import { useElementsStore } from 'whiteboard-v2'

const store = useElementsStore()

// Export canvas state
const canvasData = JSON.stringify(store.elements)

// Import canvas state
store.elements = JSON.parse(canvasData)
```

## Upcoming: Improved TypeScript Support

The `swt-export-ready` branch contains improvements for better TypeScript declaration bundling when using the library in other applications. These changes will be merged soon.

## Development

### Prerequisites

- Node.js v24
- Yarn v1

### Setup

```bash
yarn install
yarn dev
```

Navigate to:

- `http://localhost:5173/edit` - Full editor
- `http://localhost:5173/view` - Read-only viewer

### Scripts

| Script          | Description                  |
| --------------- | ---------------------------- |
| `yarn dev`      | Start development server     |
| `yarn build`    | Build library for production |
| `yarn test`     | Run tests in watch mode      |
| `yarn test:run` | Run tests once               |
| `yarn lint`     | Lint and fix code            |
| `yarn format`   | Format code with Prettier    |

## License

MIT License - Modell Aachen GmbH
