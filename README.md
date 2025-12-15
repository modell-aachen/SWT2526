# Whiteboard v2 App

Our SWT 2025 application.

## Setup

Make sure you have `NodeJS v24` and `yarn v1` installed

## Start

Run `yarn install` once.
`yarn dev` to start the development server

Navigate to: http://localhost:5173/view or http://localhost:5173/edit

## Features

### Refactor

### Required

- Detail Popup (Per Shape - Settings) Elisabeth & Laura
- Duplicate Button (Strg + C, V, Z, X etc) Jakob & Sam
- Rotation by 90 degrees only Elisabeth & Laura
- Sidebar with visible Shapes (drag and drop) Jan & Wiem
- Responsive
- Shape Link
- Zoom-Button
- Text Advanced (Text Color, Fontsize, Font Family, Extra: Render Markdown?, FA-Icons)
- Text Upside, disregarding rotation -> Text speparated from Shapes
- Shape Groups (Shapewrapper for multiple Ids?)
- Arrow Shape / More shapes
- View Page
- JSON Export
- JSON Import (Validate JSON)

### Optional

- Templates
- Connect Shapes in Datastructure
- Guiding Lines on Resize
- Predefined Colors, ColorPallets?
- Legend
- Versioning of a Diagram
- Polygons as Shape (Hexagon -> Movable Points, new Page?)

### Highly Optional

- Edit Page and View Page as Webcomponent?
- "Reshaping" of svgs
- Custom Shape Drawer? (~ 100 Story Points)

## Considerations

- Refactor to save Grid Span Values instead of Absolutely Positioned Pixels
