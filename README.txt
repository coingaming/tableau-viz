TABLEAU KPI TABLE VIZ EXTENSION — PROTOTYPE 0.1

What this is
------------
A small Tableau Viz Extension that renders worksheet summary data as a custom HTML table.
It is deliberately a first prototype: it proves custom rendering and styling, not feature parity
with Tableau's native crosstab.

Files
-----
KpiTable.trex        Tableau extension manifest
KpiTable.html        Web page and styling
KpiTable.js          Tableau API integration and table renderer
lib/                 Put Tableau's Extensions API JavaScript library here

IMPORTANT: Tableau API library
-------------------------------
Download/clone Tableau's official Extensions API repository:
https://github.com/tableau/extensions-api

Copy this file from its lib folder into this package's lib folder:
tableau.extensions.1.latest.js

The HTML expects:
lib/tableau.extensions.1.latest.js

Local setup (Windows)
---------------------
1. Install Node.js LTS if it is not already installed:
   https://nodejs.org/

2. Open Command Prompt in this extracted folder.

3. Start a local web server. Easiest option:
   npx http-server . -p 8765 -c-1

   If prompted to install http-server, answer y.

4. Keep that Command Prompt window open.

5. In your browser, test:
   http://localhost:8765/KpiTable.html

   You should see the demo table. The page will show a message that it is waiting for Tableau;
   that is normal when opened outside Tableau.

6. In Tableau Cloud, open a workbook in Edit mode and create a NEW worksheet.
   Marks card > mark type dropdown > Viz Extensions > Add Extension >
   Access Local Viz Extensions.

7. Select KpiTable.trex from this extracted folder.

8. If Tableau asks for permission to access data, review the prompt and allow it for this test.

9. Drag fields onto the extension's "Data" tile on the Marks card.
   The extension reads the worksheet's aggregated/summary data and renders it.

If the extension is blocked
---------------------------
Your Tableau Cloud site may need the local URL allowed by its administrator.
Tableau's developer guide describes localhost allow-list setup:
https://tableau.github.io/extensions-api/docs/vizext/trex_viz_getstarted/

How to use the first test
-------------------------
For a simple first test, use a small worksheet with:
- one date/dimension field
- two or three measures
- a manageable number of rows

This prototype displays the summary data supplied by the worksheet. It does not yet
recreate Tableau's native grand-total semantics, sorting, selection, tooltips, or filters.
A Tableau grand total may be returned as an ordinary row depending on the worksheet and API
data response. We will inspect the actual result and then add deliberate total-row handling.

Troubleshooting
---------------
- Blank page / 404: make sure the server is running and the URL in the .trex matches.
- Script error: confirm the Tableau API JS file exists in lib/.
- Extension blocked: ask the Tableau Cloud site admin to allow the localhost URL.
- No data: drag fields onto the Data tile and check the browser developer console (F12).

Security
--------
This prototype requests summary data only. It does not request underlying/full data permission.
Do not use sensitive production data for the first test. Use a test workbook or non-sensitive
sample data until your organization's extension policies are confirmed.
