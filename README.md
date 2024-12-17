# Theme Font Switcher

VS Code extension that automatically switches fonts when you change between light and dark themes.
User defines a custom font family and font size depending on whether a light theme or a dark theme is loaded.

## Usage

1. Install the extension
2. Go to Settings (`Ctrl-,` or `Cmd-,`)
3. Search for "theme font switcher"
4. Set your preferred fonts and sizes for light and dark themes

## Requirements
- Node.js
- make

## Build and Install

Installation step assumes you have command-line access to VSC.

```bash
make clean package
make install-ext
```