# Course Finder Website

A lightweight static website for adding courses through an admin form and searching courses from a public catalog page.

## Pages

- `admin.html` — add courses with course name, image URL, category, institute, start date, end date, days length, male/female availability, and male instructor name.
- `index.html` — search courses by keyword, category, and gender availability.

## Run locally

```bash
python3 -m http.server 8000
```

Then open:

- Search page: <http://127.0.0.1:8000/index.html>
- Admin page: <http://127.0.0.1:8000/admin.html>

Courses are stored in the browser with `localStorage`, so no backend or database setup is required for local use.
