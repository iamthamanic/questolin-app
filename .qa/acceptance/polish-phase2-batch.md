# Feature batch: A11y, Markdown, Unit tests, Code slides

<!-- issues #8, #9, #10, #11 -->

## #8 Accessibility
- [x] Progress dots ≥ 44px touch target
- [x] prefers-reduced-motion in feedViewport CSS
- [x] Focus-visible on dots
- [x] E2E touch target check

## #9 Markdown
- [x] SlideBody renders **bold** and `code`
- [x] No dangerouslySetInnerHTML
- [x] React text nodes only (XSS-safe)

## #10 Unit tests
- [x] Vitest bootstrap
- [x] Tests parseTopic, isValidTopicId, markdown
- [x] Integrated in npm run checks + CI

## #11 Code slides
- [x] Zod schemas code_read / code_fix
- [x] CodeReadSlide, CodeFixSlide + registry
- [x] Example slides in git.json
