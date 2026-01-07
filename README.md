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
- Rotation by 90 degrees only Elisabeth & Laura
- Sidebar with visible Shapes (drag and drop) Jan & Wiem
- View Page/Zoombutton Elisabeth & Laura
- Shape Link Sam & Jan
- Text Advanced (Text Color, Fontsize, Font Family, Extra: Render Markdown?, FA-Icons, Text dynamic Size) Sam & Jan

### Text Advanced Umsetzung

- Eigenständiges Textelement über unsichtbare Recheck Shape
- Text Color, Fontsize, Font Family, ... selection option in right sidebar
- Jede shape bekommt eine eigen Objekt mit informationen über die Text anordnung
- es wird alogithmisch in jede shape eine maximal große Box gezeichnet, die dann wiederum den Text enthält
- ein Text besteht aus einem Titel und einem Klartext
- FA-Icons werden als eigene Shapes in der Left sidebar hinzugefügt
- Text dynamic Size?

- Text Upside, disregarding rotation -> Text speparated from Shapes
- Shape Groups (Shapewrapper for multiple Ids?) Jakob & Wiem
- Responsive
- Arrow Shape / More shapes
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
- Visual History Snapshots

### Highly Optional

- Edit Page and View Page as Webcomponent?
- "Reshaping" of svgs
- Custom Shape Drawer? (~ 100 Story Points)

## Considerations

- Refactor to save Grid Span Values instead of Absolutely Positioned Pixels
