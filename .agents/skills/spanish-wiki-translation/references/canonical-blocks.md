# Canonical Spanish Blocks

Reusable, **paste-verbatim** Spanish boilerplate. Reuse these exact forms instead
of re-improvising them per page — consistency across the locale matters, and these
wordings were settled during the 2026-06 crisis-page sync. When the English uses
the equivalent standardized block, map it to the Spanish here.

---

## Crisis-page "Información importante" block (post-audit, hedged)

The 2026-06 Tier A audit replaced blanket safety claims ("all free / confidential
/ 24-7") with hedged, per-service wording. The Spanish mirrors that. Fill the
bracketed anchor with the page's actual toll-free lead line.

```
### Costo

La mayoría de los servicios son gratuitos, pero el costo y el horario varían según el servicio; consulta cada uno. [La línea X (NÚMERO) es gratuita.]

### Confidencialidad

Estas líneas son confidenciales. Los servicios de emergencia se contactan solo en casos de riesgo grave e inminente.

### Horario

Muchos servicios funcionan 24/7, pero algunos (por ejemplo, X) tienen horario limitado; consulta cada uno.
```

**Replaces these old blanket forms** (delete on sight when syncing):

| Old (delete) | New header |
|---|---|
| `### Es gratuito` / "Todos los servicios listados son completamente gratuitos." | `### Costo` |
| `### Es confidencial` / "Confidencial. La policía solo se involucra si hay peligro inmediato." | `### Confidencialidad` |
| `### Funciona 24/7` / "Todos los servicios principales funcionan 24/7." | `### Horario` |

Country pages that have no separate "Horario" header in English (e.g. Thailand)
keep only Costo + Confidencialidad — match the English structure, don't add a
header the source lacks.

---

## Crisis-page footer (3 lines)

```
*Confirma cada número con el servicio antes de llamar; los datos pueden cambiar.*

**¿Estás en crisis en este momento?** Llama a [SERVICIO]: [NÚMERO]. Todo lo demás puede esperar.

*El costo, la confidencialidad y el horario varían según el servicio; consulta cada uno.*
```

- Line 1 **replaces** the false "verified" claim
  `*Todos los números verificados a través de fuentes oficiales [país]*`.
- Line 3 **replaces** the blanket
  `**Todos los servicios son gratuitos, confidenciales y están disponibles 24/7.**`.
- Line 2's call-to-action names the page's **lead** service + number (e.g.
  "Llama a Tele-MANAS: 14416", "Llama a NCMH: 1553", "Llama a la Línea de la
  Vida: 800-911-2000").

Some older pages open line 2 with `**¿En crisis ahora mismo?**` instead of
`**¿Estás en crisis en este momento?**` — both are in use; keep whichever the page
already has rather than churning it.

**Local-language call-to-action:** some country pages keep line 2 in the country's
language (Indonesia: `**Sedang dalam krisis sekarang?** Hubungi 119, lalu tekan 8.
Semuanya bisa menunggu.`). Mirror the English source — if English localized that
line, the Spanish edition keeps it localized too; lines 1 and 3 stay Spanish.

---

## Contribute footer

The `## Contribuye a esta página` block + the "¿Tienes experiencia vivida…"
paragraph + `[Sugiere una edición o un agregado →](/es/start/contribute)` link
have fixed Spanish forms — copy them from any existing `es/` page so they stay
identical site-wide. (See also `glossary.md` → "Common footer blocks".)
