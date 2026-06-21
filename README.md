# Job Finding AI Agent

A production-ready Python starter for job discovery, filtering, proposal
generation, local storage, and reporting.

## What It Does

- Fetches live jobs from free public sources:
  - We Work Remotely RSS
  - RemoteOK RSS
  - Remotive API
- Imports LinkedIn or other portal jobs from CSV.
- Optionally runs Apify actors for LinkedIn, Naukri, Indeed, and other portals
  when you configure an Apify token.
- Filters jobs by keywords and minimum INR budget.
- Generates a personalized proposal draft for every matching job.
- Saves jobs and proposals in SQLite.
- Exports every matching job to CSV or Google Sheets.
- Ranks Chrome/job automation tools by ROI.

## Final Project Structure

```text
main.py
tools_roi.py
requirements.txt
README.md
config/
    apify_actors.json
    apify_actors.example.json
    automation_tools.json
    job_agent.env.example
db/
    database.py
models/
    job.py
services/
    apify_provider.py
    automation_tools.py
    fetch_jobs.py
    filter_jobs.py
    proposal_generator.py
    report_generator.py
```

## Run The Job Agent

```powershell
cd C:\Users\niles\Downloads\LearnSkills
python main.py
```

Equivalent explicit command:

```powershell
python main.py run
```

Custom filters:

```powershell
python main.py run --keywords "AWS,DevOps,Cloud" --min-budget-inr 5000
```

The app prints every matching job and writes the report to:

```text
reports/jobs_report.csv
```

## LinkedIn And Indian Portals

Free-friendly options:

- LinkedIn: CSV export, job-alert email data, or approved API/partner access.
- Naukri, Foundit, Shine, Hirist, Instahyre, Internshala: CSV/manual export or
  job-alert email parsing.
- Chrome extensions such as Fillix/Fylla can do portal-side autofill, then you
  feed exported/pasted job data back into this agent.

CSV import:

```powershell
$env:LINKEDIN_EXPORT_CSV = "C:\path\to\linkedin_jobs.csv"
python main.py
```

The CSV can contain common columns such as `Title`, `Company`, `Job URL`,
`Description`, and `Salary`.

## Optional Apify Integration

Apify is optional because it may cost money after free credits. If you still
want to use it:

```powershell
$env:APIFY_TOKEN = "your-apify-token"
$env:APIFY_ACTORS_CONFIG = "config\apify_actors.json"
python main.py
```

Default enabled actors in `config\apify_actors.json`:

- LinkedIn Jobs
- Naukri
- Indeed India

Review portal terms and actor requirements before running login/session-cookie
automation.

## Google Sheets Export

CSV export works by default. For direct Google Sheets export:

```powershell
pip install -r requirements.txt
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"
$env:GOOGLE_SHEET_ID = "your-google-sheet-id"
python main.py
```

The spreadsheet must be shared with the Google service account email.

## Chrome Tool ROI Ranking

```powershell
python main.py tools
```

Or:

```powershell
python tools_roi.py
```

## Free Resources Only

```powershell
python main.py free
```

This shows only free/free-tier resources such as public RSS/API sources,
LinkedIn/Naukri/Indeed job alerts, CSV import, Google Sheets, and limited free
Chrome-extension workflows. It excludes paid scraper platforms as the default
path.

Best ROI stack for your current goal:

1. Free public sources and CSV/email alerts through this Python app.
2. Fillix for Indian portals: LinkedIn, Naukri, Internshala, Instahyre.
3. Fylla for resume/proposal quality and Naukri/LinkedIn autofill.
4. Swooped or JobWizard for global portals and ATS forms.
5. This app for final filtering, SQLite storage, proposals, and reports.
