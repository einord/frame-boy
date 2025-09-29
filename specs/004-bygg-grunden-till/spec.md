# Feature Specification: Home Hub Display Foundation

**Feature Branch**: `004-bygg-grunden-till`  
**Created**: 2025-09-29  
**Status**: Draft  
**Input**: User description: "Bygg grunden till en applikation som kommer visas på en skärm i ett hem som alltid är igång och visa information för de som bor där. Den ska användas för att snabbt se kalendern, status över ett hem, påminnelser och listor kring saker som behöver göras. Fokus ska vara att skapa en applikationsgrund med flera paneler. En huvudpanel med olika widgets/komponenter som kan läggas ut i ett rutnät, en huvudmeny, samt ett halvstort block i botten som kan visa något lite större underst. Applikationen ska därefter kunna ladda in moduler som själva kan registrera vilka delar av skärmen de har möjlighet att visa information på. Om de t.ex. implementerar möjlighet för en widget på huvudytan av skärmen, så kan användaren placera ut den någonstans om hen vill. Eller om den har möjlighet att visa något stort i botten, så kan användaren välja att visa den. Modulerna ska även kunna säga att de kan visa en helskärm (hela widget-rutnätet), och om användaren väljer att lägga till den vyn, så läggs det som en egen knapp i huvudmenyn.

Små widgets på huvudytan är tänkt till komponenter med mindre information så som att visa klockan, väder, dagens temperaturer, kontroller för mediasperare, status på någon smart lampa i huset och liknande. Varje widget kan registrera deras min- och maxstorlek på rutnätet (i antalet rutor), medan helskärmsvyer ska t.ex. kunna vara diagram över energianvändning, bläddra i mediabibliotek, etc.

Underdelen av skärmen kan användas för halvstora saker som t.ex. kalender över veckan, osv.

Till sist ska en modul också kunna registrera icke-grafiska funktioner som kan köras med intervall och/eller vid start av applikationen. Det kan t.ex. handlar om att den behöver kunna polla efter data från t.ex. en kalendertjänst, eller prenumerera på en socket eller ström av data från extern källa.

Skärmen kommer vara touch-baserad och ha inställningsmöjligheten att dölja muspekaren, ska aldrig scrolla huvudvyn (endast om enskilda widgets eller paneler implementerar det lokalt). Den kommer alltid visa hela applikationen i fullskärm."

## User Scenarios & Testing *(mandatory)*

### Primary User Story
Familjemedlemmar kan snabbt få överblick över dagens händelser, hemstatus och påminnelser via en alltid-på touchskärm i hallen utan att navigera i mobilappar.

### Acceptance Scenarios
1. **Given** att skärmen är i viloläge med huvudpanelen synlig, **When** en användare väljer modulens knapp i huvudmenyn, **Then** växlar applikationen till modulens helskärmsvy utan att störa övriga paneler.
2. **Given** att en modul registrerar en ny widget för huvudytan, **When** administratören aktiverar den i layouteditorn, **Then** visas widgeten i valt rutnätsområde med respekt för dess min/max-storlek och utan att kollidera med andra komponenter.
3. **Given** Raspberry Pi 4 (2GB) som kör applikationen i fullskärm, **When** alla paneler och bakgrundsmoduler kör sina uppdateringsintervall, **Then** håller systemet <150MB RSS och <40% CPU samt bibehåller 60 Hz touchrespons utan att huvudytan scrollar.

### Edge Cases
- Vad händer när en modul försöker registrera en widgetstorlek som överskrider tillgängligt rutnät?
- Hur hanteras nätverksbortfall när bakgrundsjobb misslyckas med att hämta data?
- Hur hanteras situationen när flera helskärmsvyer registrerar samma menyposition eller prioritet?
- Hur fungerar uppdateringar när skärmen är inställd på att dölja muspekaren och användaren förlitar sig på geststyrning?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Systemet MUST rendera en huvudpanel med ett dynamiskt rutnät där widgets kan placeras utifrån definierade min/max-dimensioner (kolumner × rader).
- **FR-002**: Systemet MUST tillhandahålla en huvudmeny som visar knappar för helskärmsvyer registrerade av moduler och möjliggör snabb växling mellan dem.
- **FR-003**: Systemet MUST rendera ett halvstort nederblock som moduler kan använda för innehåll med större informationsbehov än en standardwidget.
- **FR-004**: Moduler MUST registrera komponenter genom att välja från den fasta tjänsteuppsättningen {widget, bottom_panel, fullscreen_view, background_job} och ange metadata (ID, namn, stödda ytor, storleksgränser, uppdateringsintervall).
- **FR-005**: Moduler MUST kunna registrera icke-grafiska funktioner (jobb) med konfigurerbara intervall och startkörning, inklusive felhantering och statusrapportering.
- **FR-006**: Systemet MUST operera inom RESOURCE BUDGET: <150MB RAM, <40% CPU på Raspberry Pi 4 (2GB) i normaldrift och initiera under 5 sekunder.
- **FR-007**: Upplevelsen MUST uppfylla ACCESSIBILITY / UX kriterier som: läsbar typografi på 2 m avstånd, WCAG 2.1 AA-kontrast, fullt navigerbar via touch utan muspekarindikering.
- **FR-008**: Systemet MUST tillhandahålla ett layout-konfigurationsgränssnitt för administratörer med stöd för att aktivera/inaktivera registrerade moduler och placera deras komponenter.
- **FR-009**: Systemet MUST köra i borderless fullskärm på primär display och förhindra global scroll på huvudvyn; endast interna paneler får scrolla lokalt vid behov.
- **FR-010**: Systemet MUST exponera ett modul-API (manifest) som definierar modulinitiering, registrering av vyer och bakgrundsjobb samt deklaration av behörigheter.
- **FR-011**: Systemet MUST logga modulhändelser, jobbutfall och prestandametrik för att möjliggöra observabilitet och TDD.
- **FR-012**: Systemet MUST exponera ett inställningsläge där administratören kan aktivera/inaktivera moduler samt välja vilka widgets, nederpaneler och helskärmsvyer som ska visas.
- **FR-013**: Inställningsläget MUST tillåta att widgets i rutnätet flyttas och skalas genom drag-gest med bibehållande av deklarerade min/max-storlekar.
- **FR-014**: Systemet MUST persistera widgetlayout inklusive rutnätsposition (rad, kolumn) och utbredning (bredd, höjd).
- **FR-015**: När en widget hamnar delvis utanför rutnätets gränser eller bryter mot minsta storlek ska systemet automatiskt justera position och/eller storlek för att uppfylla begränsningarna.
- **FR-016**: Inställningsläget MUST exponera åtgärder för att lägga till nya widgets från aktiva moduler och ta bort befintliga.
- **FR-017**: Inställningsläget MUST låta administratören välja rutnätscellstorlek (`small`, `medium`, `large`) vilket påverkar widgeternas positions- och storleksgranularitet.

*Example of marking unclear requirements:*
- **FR-018**: Inställningsläget kräver ingen autentisering i V1 eftersom skärmen används i kontrollerad hemmiljö.
- **FR-019**: Bakgrundsjobb registrerar egna intervall i heltalsminuter (>=1); varje modul ansvarar för caching och refresh-policy.
- **FR-020**: Systemet MUST levereras med kärnmoduler bundlade och stödja fjärrdistribution via godkänd modulkatalog/paketrepo.

### Key Entities *(include if feature involves data)*
- **ModuleManifest**: Beskriver en modul (ID, namn, version, stödda ytor, deklarerade jobb, konfigurerbara parametrar) och vilka tjänstetyper från {widget, bottom_panel, fullscreen_view, background_job} den exponerar.
- **WidgetDefinition**: Metadata för en widget (modulreferens, rutnätsmin/max, standardstorlek, uppdateringsintervall, dataendpoints).
- **ViewLayout**: Sparar användarens layoutval (widgetpositioner, aktiverade moduler, helskärmsmenyordning) inklusive varje widgets rutnätsposition (rad, kolumn), utbredning (bredd, höjd) och vald rutnätscellstorlek (`small`/`medium`/`large`).
- **BackgroundJob**: Schemalagd process (typ, intervall, senast körd tid, felstatus, modulägare).
- **DeviceProfile**: Specificerar hårdvara och UI-inställningar (skärmupplösning, touch-inställningar, muspekarpolicy, energisparläge) inklusive standardvärde för rutnätscellstorlek.

## Hardware & Performance Constraints *(mandatory)*
- **Target Hardware**: Raspberry Pi 4 (2GB RAM) med 1080p pekskärm; sekundärt stöd för andra enkortsdatorer med liknande kapacitet.
- **Resource Budgets**: <150MB RSS, <40% total CPU under steady state, max 5 s uppstart till interaktiv huvudpanel, <16ms touch-latens.
- **Graceful Degradation Strategy**: När budgets överskrids ska systemet throttle bakgrundsjobb, pausa lågprioriterade widgets eller visa degraderingsnotiser utan att krascha huvudvyn.
- **Instrumentation Plan**: Inbyggd metriksamling för minne/CPU per modul, jobbkörningstider, widgetrenderingstider samt loggning av UI-lag vid touchhändelser.

## Clarifications
### Session 2025-09-29
- Q: Ska specifikationen beskriva vad som händer när en widget klickas? → A: Nej, respektive widget ansvarar för sitt klickbeteende
- Q: Ska manifestet låsa tjänstetyperna till kärnuppsättningen `widget`, `bottom_panel`, `fullscreen_view`, `background_job`? → A: Ja, använd den fasta listan
- Q: Hur ska inställningsläget hantera layoutredigering av widgets och modulaktivering? → A: Via menyval för inställningar med dragbar layout och autojustering
- Q: Vilka storlekar ska rutnätsceller stödja? → A: Inställningar väljer mellan small/medium/large
- Q: Vilken autentisering krävs för inställningsläget i V1? → A: Ingen autentisering (familjeintern användning)
- Q: Hur ska caching och pollingintervall styras? → A: Modulregistrerat intervall (>=1 min) och egen cache
- Q: Hur distribueras moduler i V1? → A: Bundlade kärnmoduler + fjärrkatalog

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality

### Requirement Completeness

---

## Execution Status
*Updated by main() during processing*

- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Hardware & performance constraints captured
- [ ] Review checklist passed

---
