# HAYSTAC Dashboard: Visualizing Noisy GPS Trajectories

Welcome to the **HAYSTAC Dashboard**, an interactive web application designed to explore and analyze temporal gaps in GPS tracking data, enriched with geographic context. This dashboard was adapted from this [Observable notebook](https://observablehq.com/@cmps-3360-6360/haystac-dashboard) to provide a polished, easily shareable interface via GitHub Pages without requiring code execution.

---
## Report and Additional Materials

All visualizations, code, and data files that are permissible for public sharing are included in this repository. Any additional materials that cannot be shared directly have been discussed and illustrated with images in the accompanying report, which is also available here.

---

## Live Demo

Explore the live, hosted version of the dashboard here:

🔗 **GitHub Pages:** https://Mauryanx.github.io/DataVisGradProject

> **Note**: The interactive map component can be slow when loading a large number of markers. If you experience performance issues, you can view and interact with the original notebook directly on Observable:
> 🔗 **Observable Notebook:** https://observablehq.com/@cmps-3360-6360/haystac-dashboard

---


## Project Overview

The live project visualizes:
1. **Missing-Interval Map** — A combined calendar heatmap and Leaflet map showing when and where data gaps occur.
2. **Gap Duration Analysis** — Box plots, histograms, and statistical summaries of temporal gaps in GPS data.

This repository contains:
- The exported and customized `index.html` dashboard
- All supporting JavaScript and CSS files (`runtime.js`, `inspector.css`, etc.)
- Precomputed JSON data files (`agent142_calendar.json` and `agent142_gaps.json`)
- The adapted Observable runtime and plot libraries
- Contains code for the Calender Plot not allowed to be visualized publicly on the dashboard.

---

## How It Works

1. **Selection**: Use the dropdown to select an agent (currently only **Agent 1** is supported; future database integration will unlock additional agents).
2. **Temporal Patterns**: The calendar component highlights available (green) vs. missing (black) intervals by week and hour.
3. **Geographic Context**: Clicking any missing interval centers the map on the pre- and post-gap coordinates, visualizing each gap's spatial footprint.
4. **Statistical Insights**: The bottom section presents a statistical summary, interactive histogram, and boxplot of gap durations.

---

## Getting Started Locally

To preview the dashboard on your local machine:

```bash
# Clone the repository
git clone https://github.com/Mauryanx/DataVisGradProject.git
cd DataVisGradProject

# Serve with a simple HTTP server
python -m http.server 8000
# or
gnpx http-server .
```

Then open `http://localhost:8000` in your browser.

---

## Project Structure

```
/                # Project root
├─ index.html     # Main dashboard page
├─ inspector.css  # Custom styles for Observable outputs
├─ runtime.js     # Observable runtime engine
├─ package.json   # Project metadata
├─ files/         # Data folder
│   ├─ agent142_calendar.json
│   └─ agent142_gaps.json
└─ README.md      # (this file)
```

---



---

## Future Work

- **Live database integration**:Hooking the dashboard to a DuckDB or PostgreSQL backend (e.g. via Supabase) would allow on-demand loading of all agents, dynamic filtering by time or region, and scalable queries across millions of records.
- **User authentication & permissions**: Embedding role-based access control would permit confidential visualizations (QGIS overlays, stay-point semantics) to be shown only to authorized researchers
- **Anomaly annotation & feedback**: Enabling users to tag gaps or trajectories as “anomalous” and feeding those labels back into the database would support active learning for our transformer-based detection models.

---

## Acknowledgments

 Special thanks to the Dr.Faust & Dr.Wenk.

---

**Thanks for checking out the HAYSTAC Dashboard!**

*Mauryan Uppalapati*
