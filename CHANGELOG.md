# Change Log

All notable changes to the "markdown-tag" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.1] - 2026-10-08

### Changed

- Add a link to the documentation site in README

## [1.3.0] - 2026-10-06

### Fixed

- Text surrounding a tag is now HTML-escaped (previously it was emitted raw)
- Custom hex colors now apply to arrow tags
- An explicit background color now always wins over the label's default color
- Named foreground colors are no longer accepted (they were validated but had no effect); use hex codes
- Removed the `markdown.previewScripts` contribution, which loaded the extension-host bundle into the preview
- Removed the unregistered `markdown-tag.preview` command

### Changed

- Default tag colors darkened to meet WCAG AA contrast; yellow tags use dark text
- Tag sizes now scale with the preview font size
- The extension no longer forces `html: true` on the Markdown renderer
- Added unit tests (`npm test`), stricter TypeScript and ESLint settings, and workspace trust / virtual workspace capabilities
- Replaced the `publish` script with `release`; removed unused test dev dependencies

## [1.2.0] - 2025-08-18

- Added support for both `|` and `/` as separators in tag syntax (e.g., ((tag|label)) and ((tag/label)))
- Updated documentation and examples to reflect this change

## [1.1.2] - 2024-12-04

### Changed

- Updated product name for clarity and accuracy

## [1.1.1] - 2024-11-27

### Added

- Installation instructions to README.md

### Changed

- Arrow tag styling is now matches normal pill tags in size

## [1.1.0] - 2024-11-15

### Changed

- Tags are now formatted using `((tag|label|bgcolor|fgcolor))` format so as not to conflict with other common markdown
- CSS class is now bn-tags amd bn-arrow-tags so as not to conflict with other common classes
- README.md reflects new tag format
- All example documents now contain the updated tag format

## [1.0.5] - 2024-11-10

### Changed

- Added a screenshot to README.md

## [1.0.4] - 2024-11-09

### Changed

- Project logo update

## [1.0.2] - 2024-11-08

### Changed

- Project renamed to vscode-markdown-tags

## [1.0.1] - 2024-11-07

### Changed

- Minor chagelog update

## [1.0.0] - 2024-11-07

### Added

- Changelog

### Changed

- Version number changed to 1.0.0
