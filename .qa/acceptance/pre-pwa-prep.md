# Feature: Pre-PWA Vorbereitung (Docs, Tutor, Mobile-Zugriff)

<!-- @implement 2026-06-24 -->

## Intent
Before PWA: sync PRD/README with shipped state, document tutor smoke test and mobile access options, open GitHub issue for PWA minimal.

## Happy Path
- [ ] PRD reflects Phase 3 shipped items (Supabase scaffold, feed virtualization, Ollama tutor)
- [ ] README feature table + personal-use section (tutor + mobile HTTPS options)
- [ ] `docs/personal-use.md` with tutor verify steps and phone access matrix
- [ ] `scripts/smoke-tutor.sh` documents/runs API smoke test
- [ ] GitHub issue „PWA minimal“ with acceptance criteria
- [ ] `npm run checks` passes

## Edge Cases
- [ ] Tutor smoke skips gracefully when Ollama not running

## Implementation Notes
- PRD: Phase 3 split (shipped vs planned), personal-use doc link, deploy/PWA open questions
- README: feature table updated, `docs/personal-use.md`, `npm run smoke:tutor`
- `scripts/smoke-tutor.sh` + `docs/personal-use.md` (mobile access matrix)
- GitHub **#33** PWA minimal + `.qa/acceptance/pwa-minimal.md`
- Tutor smoke: Ollama ✅ lokal erreichbar; voller API-Test blockiert wenn Port 3000 fremdbelegt (in Doku vermerkt)
