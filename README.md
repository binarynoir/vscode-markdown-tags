# Markdown Tags: Enhanced Tag Styling for Markdown

Add visual flair to your Markdown documents with custom tag styles! **Markdown Tags** lets you highlight and style labels within Markdown using intuitive syntax, customizable colors, and optional arrow indicators—all in the native Visual Studio Code preview.

## Features

### 🎨 Styled Tags

Effortlessly add tags with various styles to convey status or priority in your notes, docs, and project files.

- **Built-in Labels**: Predefined labels for common statuses, such as `todo`, `in-progress`, `done`, `error`, and more.
- **Custom Labels**: Create any label you need with customizable colors and styling.

### 🎯 Arrowed Tags

Add arrow indicators to tags for even more clarity in task lists or progress tracking.

### 🖌️ Customizable Colors

Use predefined colors or specify custom hex codes for both background and foreground colors, enabling unlimited styling options.

### 📄 Flexible Syntax

Simple, flexible syntax options:

```markdown
[[tag|label]]
[[tag|label|background-color]]
[[tag|label|background-color|foreground-color]]
[[<tag|label]] <!-- Adds an arrow to the left -->
```

### 🌈 Supports a Variety of Colors

Choose from predefined colors (`grey`, `green`, `orange`, etc.) or use custom hex codes to suit your design preferences.

---

## Getting Started

1. **Install** the extension from the Visual Studio Code Marketplace.
2. **Add Tags** in your Markdown files using the syntax below.
3. **Open Preview** (Right-click the Markdown file → "Open Preview" or `Ctrl+Shift+V`) to view styled tags in action.

### Basic Syntax Examples

#### Status Tags

```markdown
[[tag|todo]] [[tag|in-progress|#ffcc00]] [[tag|done|#28a745|#ffffff]]
```

#### Arrowed Tags

```markdown
[[<tag|planned]] [[<tag|custom test]]
```

#### Customizing Colors

```markdown
[[tag|background|#ff4500]] [[tag|foreground||#ff6347]] [[tag|both colors|#32cd32|#ffffff]]
```

---

## Advanced Options

### CSS Integration

Add custom styles by modifying the `style.css` file in the extension folder to match your preferences.

### Error Handling

The extension defaults to `grey` when invalid colors are detected to ensure a consistent and polished look.

---

## Contributing

Feel free to submit issues, feature requests, or contribute code on [GitHub](https://github.com/kryptonianson/markdown-tags).

## License

MIT License

---

## Support

If you encounter any issues or have questions, please open an issue on [GitHub](https://github.com/kryptonianson/markdown-tags/issues).

---

**Enjoy enhanced styling for your Markdown documents with Markdown Tags!** Transform your plain text notes with visual tags that bring clarity, color, and customization.
