# Exercise Detailed View UX Template Proposals

## Design Intent
Create an Exercise detailed view that feels native to the current FlexIt design language used in the Workout page:
- Main title row at top
- Bootstrap grid-based structure (`row`, `col-12`, `col-lg-*`)
- Sectioned cards via `ContentSection`
- Loading, error, and empty states via `EventMessage`
- CRUD actions triggered by popups/drawers

The view should support:
- Exercise details and metadata
- Progression charts (strength, cardio, flexibility, etc.)
- Past logs list and filtering
- Associated workouts and quick navigation
- Update and delete actions with confirmation flow

---

## Shared Information Architecture (All Alternatives)

### Core Sections
1. Header
- Exercise name
- Category, difficulty, focus area badges
- Primary actions: `Edit`, `Delete`, `Add log`

2. Detail Summary
- Description, recommendations, and category-specific fields
- Last updated and creation timestamps

3. Progression Analytics
- Strength example: weight trend, total volume, series/reps over time
- Cardio example: duration, distance, pace trends
- Window controls: 7d / 30d / 90d / all

4. Logs Table
- Search, sort, filter by date range
- Pagination or infinite scroll

5. Associated Workouts
- List/cards of workouts containing this exercise
- CTA: `Open workout`

### CRUD Behavior Pattern
- Edit: open popup with prefilled form
- Delete: confirmation popup with explicit warning and optional dependency message
- Create log: quick-add popup from the same page

### State Handling
- Loading: section-level placeholders or `EventMessage style="loading"`
- Error: recoverable `EventMessage style="error"` + retry CTA
- Empty logs: `EventMessage style="warning"`

---

## Alternative A: Balanced Two-Column (Most Similar to Workout.tsx)

### Layout
Desktop:
- Left column (`col-12 col-lg-5`): Details + Associated Workouts
- Right column (`col-12 col-lg-7`): Charts + Logs

Mobile:
- Single column stack with order:
  1) Header
  2) Details
  3) Charts
  4) Logs
  5) Associated Workouts

### Wireframe

```text
[Exercise Name]

| Left (5)                              | Right (7)                                  |
|---------------------------------------|---------------------------------------------|
| ContentSection: Exercise Details      | ContentSection: Progression Charts          |
| - Description                         | - Weight / Series / Reps trend             |
| - Category + Focus Area + Difficulty  | - Range tabs (7d/30d/90d/all)              |
| - Recommendations                     |                                             |
|                                       | ContentSection: Exercise Logs               |
| ContentSection: Associated Workouts   | - Search + Filter + Sort                    |
| - Horizontal cards/list               | - Table (latest first)                      |
| - Open workout button                 | - Add log button                            |
```

### Why it fits
- Mirrors the Workout details visual rhythm
- Keeps analytical area dominant without hiding metadata
- Easy to build with current components and CSS patterns

---

## Alternative B: Analytics-First Hero

### Layout
Desktop:
- Top hero section (`col-12`): key KPIs and primary chart
- Bottom split:
  - Left (`col-12 col-lg-4`): Details + actions
  - Right (`col-12 col-lg-8`): Logs + secondary charts

Mobile:
- Hero KPIs first, then chart, then details, then logs

### Wireframe

```text
[Exercise Name] [Edit] [Delete] [Add log]

[Hero KPI Strip]
- Last logged weight
- 30-day average
- PR / Best value
- Total logs

[Hero Chart]
- Main progression timeline

| Left (4)                              | Right (8)                                  |
|---------------------------------------|---------------------------------------------|
| ContentSection: Details               | ContentSection: Logs                        |
| ContentSection: Associated Workouts   | ContentSection: Secondary Metrics           |
```

### Why it fits
- Best for users focused on progression outcomes
- Highlights value immediately
- Works well when logs are abundant

---

## Alternative C: Timeline-Centric Journal View

### Layout
Desktop:
- Left (`col-12 col-lg-8`): chronological timeline of logs with inline mini-charts
- Right (`col-12 col-lg-4`): sticky exercise summary + actions + associated workouts

Mobile:
- Summary card first, timeline second

### Wireframe

```text
| Main (8)                                  | Side (4, sticky on desktop)             |
|-------------------------------------------|-----------------------------------------|
| ContentSection: Activity Timeline         | ContentSection: Exercise Summary        |
| - Date group headers                      | - Key metadata                          |
| - Log entries with metric chips           | - Edit / Delete / Add log               |
| - Inline trend sparkline per week         |                                         |
|                                           | ContentSection: Associated Workouts     |
| ContentSection: Full Logs Table           |                                         |
```

### Why it fits
- Feels like a training journal
- Great for users reviewing history session-by-session
- Strong narrative flow for progression

---

## Alternative D: CRUD-First Admin Surface

### Layout
Desktop:
- Top action bar with segmented controls (`Overview`, `Logs`, `Analytics`, `Relations`)
- One main content panel swapping sections
- Persistent danger zone at bottom for delete/archive

Mobile:
- Segment tabs convert to horizontal scroll chips

### Wireframe

```text
[Exercise Name]
[Overview] [Logs] [Analytics] [Relations]

[Main Content Panel]
- Active tab content only

[Danger Zone]
- Delete exercise
- Impact message (affected logs/workout links)
```

### Why it fits
- Better for power users and dense data sets
- Reduces vertical scrolling overload
- Very clear action model for update/delete lifecycle

---

## Component Mapping to Existing FlexIt UI

- Header and title:
  - Reuse `template-title` style pattern from workout page
- Section containers:
  - `ContentSection`
- Feedback states:
  - `EventMessage`
- Related items list:
  - `HorizontalCard` (for associated workouts)
- Logs list:
  - `Table`
- CRUD interactions:
  - `Popup` for edit/delete confirmation/add log

---

## Recommended Option
Alternative A (Balanced Two-Column) is the safest and most consistent with the current app language.

Reason:
1. Directly mirrors existing Workout page hierarchy
2. Minimal cognitive shift for users
3. Predictable responsive behavior with current grid setup
4. Easy incremental expansion toward Alternative B features (hero KPIs/charts)

---

## Proposed Interaction Flows

### Edit Exercise
1. User clicks `Edit`
2. Popup opens with current values
3. Save triggers update mutation
4. On success: invalidate exercise, logs, workouts relations queries

### Delete Exercise
1. User clicks `Delete`
2. Confirmation popup with warning and impact statement
3. Confirm triggers delete mutation
4. On success: close view or navigate to parent workout/exercise list

### Add Log
1. User clicks `Add log`
2. Quick log popup opens
3. Submit refreshes logs table and charts

---

## Data Requirements (Design-Level)
- Exercise metadata: name, description, category, focus area, difficulty
- Progression datasets by category type
- Logs list with sortable timestamps and metric columns
- Associated workouts list and link targets
- Dependency count for safe deletion messaging

---

## Responsive Rules
- Keep action buttons visible at top on all breakpoints
- Prefer stacked sections under `lg`
- Avoid side-by-side charts on narrow screens
- Logs table should support horizontal overflow on mobile

---

## Next Design Step
Pick one of these paths for implementation planning:
1. Build Alternative A exactly as baseline
2. Build Alternative A + hero KPI strip from Alternative B
3. Build Alternative C for a journal-style experience
4. Build Alternative D for admin/power-user workflows
