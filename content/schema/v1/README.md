# Content Schema v1

## Topic-Dateien

Lege neue Themen unter `content/topics/<locale>/<id>.json` an, z.B.:

```
content/topics/de/datenbanken.json
```

`loadTopics(locale)` lädt alle JSON-Dateien im Ordner und validiert mit Zod.

## Slide-Typen

| type | MVP | Beschreibung |
|------|-----|--------------|
| `hook` | ✅ | Einstiegsfrage |
| `explanation` | ✅ | Einfache Erklärung |
| `real_world` | ✅ | Alltagsvergleich |
| `scenario` | ✅ | Programmier-Szenario |
| `beginner_mistake` | ✅ | Typischer Fehler |
| `quiz` | ✅ | Interaktives Quiz |
| `code_read` | 🔜 | Code lesen (Phase 2) |
| `code_fix` | 🔜 | Code reparieren (Phase 2) |

## Slide `content` pro Typ

### hook / explanation / scenario / beginner_mistake

```json
{
  "body": "Markdown-fähiger Text",
  "subtitle": "optional"
}
```

### real_world

```json
{
  "body": "...",
  "analogy": "Restaurant-Kellner = API"
}
```

### beginner_mistake

```json
{
  "body": "...",
  "mistake": "Was Anfänger falsch machen",
  "whyDangerous": "Warum gefährlich",
  "codeExample": "optional string"
}
```

### quiz

```json
{
  "questions": [
    {
      "id": "q1",
      "kind": "multiple_choice",
      "question": "...",
      "options": ["A", "B", "C"],
      "correctAnswer": "A",
      "feedbackCorrect": "...",
      "feedbackWrong": "..."
    }
  ]
}
```

`kind`: `multiple_choice` | `true_false` (weitere später)

## Versionierung

`schemaVersion: 1` — bei Breaking Changes v2 einführen und Loader unterstützt beide.

## Collections

Sammlungen gruppieren Topics ohne App-Rewrite:

```
content/collections/de/grundlagen.json
```

```json
{
  "schemaVersion": 1,
  "id": "grundlagen",
  "title": "IT-Grundlagen",
  "description": "Kurzbeschreibung",
  "locale": "de",
  "topicIds": ["api", "http", "git"]
}
```

- `topicIds` müssen existierende Topic-IDs referenzieren
- Feed: `/?collection=grundlagen` filtert nach Sammlung (Reihenfolge aus `topicIds`)
- Ohne Parameter: alle Topics alphabetisch (wie bisher)

Validierung: `npm run validate:content` prüft Topics und Collections.
