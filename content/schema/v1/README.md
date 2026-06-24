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
| `code_read` | ✅ | Code lesen |
| `code_fix` | ✅ | Code reparieren (Auswahl) |
| `mastery_check` | ✅ | Selbstcheck: Woran erkenne ich, dass ich es verstanden habe? |
| `mini_task` | ✅ | Offene Mini-Aufgabe mit optionaler Lösung |

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

### code_read

```json
{
  "body": "...",
  "subtitle": "optional",
  "code": "git status",
  "language": "optional"
}
```

### code_fix

```json
{
  "body": "...",
  "brokenCode": "git add .\\n???",
  "options": ["git commit -m \"...\"", "..."],
  "correctAnswer": "git commit -m \"...\"",
  "feedbackCorrect": "...",
  "feedbackWrong": "..."
}
```

### mastery_check

```json
{
  "body": "Du kannst erklären, welche Daten vom Frontend ans Backend gehen, was das Backend prüft und was es zurückgibt.",
  "subtitle": "optional",
  "checklist": [
    "Ich kann Frontend vs. Backend unterscheiden",
    "Ich kenne mindestens zwei HTTP-Methoden",
    "Ich kann ein einfaches API-Szenario beschreiben"
  ]
}
```

### mini_task

```json
{
  "body": "Entwirf eine API für 'Kunde erstellen'.",
  "hint": "Denke an POST, Payload und Rückgabe.",
  "solution": "POST /customers mit Body { name, email } → 201 Created { id, name, email }"
}
```

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

## Levels

Levels ordnen Topics einem Skill-Level zu und treiben die Freischaltung:

```
content/levels/de/level-0.json
```

```json
{
  "schemaVersion": 1,
  "id": "level-0",
  "index": 0,
  "title": "Level 0 — Erste Schritte",
  "description": "...",
  "locale": "de",
  "topicIds": ["api", "http", "client-server"]
}
```

- `topicIds` müssen existieren
- Topics können optional `level`/`testBlockId` enthalten
- Fortschritt: Level gilt als geschafft, wenn alle zugeordneten Topics abgeschlossen sind

Validierung: `npm run validate:content` prüft Topics, Collections und Levels.
