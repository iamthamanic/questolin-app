# Feature: Content Collections

<!-- issue #16 -->

## Intent
Local topic collections (LearnHouse-inspired) without CMS.

## Happy Path
- [x] JSON schema v1 for collections
- [x] `loadCollections()` + validation in `npm run validate:content`
- [x] `listTopics(locale, collectionId?)` filters feed
- [x] Example collection `grundlagen`
- [x] Docs in `content/schema/v1/README.md`

## Implementation Notes
- `/?collection=grundlagen` on feed route
- Unknown collection id falls back to all topics
