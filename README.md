# CodeForces_Activity_Tracker
### CodeForces API-based online status tracker that runs for free using google sheets and Google Apps Script (GAS)

This project only tracks the `online` status on the CodeForces website along with some other basic info from the API about each user, it relies on google sheets as front end & database and google apps script triggers meaning no hosting costs

Features are 
+ Log sheet stores whether each person has been online throughout 15 minute intervals of the day.
+ Info sheet for general account info: `rating info, contribution, friends, submissions, registration date and location info`
+ Summary sheet for better overview of the log: `Activity percentage by hour and day plus daily activity`
+ Graphs to display info and activity better 

This is my first big project in a bit of an unusual language, so if you have some advice to drop, I'd be more than glad.

# Setup
To set up your own spreadsheet, you'll first need a throwaway CodeForces account with every person you want to track followed, after which you need to generate an **API key** and **API secret** from [this page](https://codeforces.com/settings/api)

First step is to make a copy of [this spreadsheet](https://docs.google.com/spreadsheets/d/1W3XTmMHAS3upssMy-xqlS8rm-NPkGmnV-RtQhmZ6ztE/edit#gid=39384800)

Now from the resulting spreadsheep open `Extensions > Apps Script` and pick `Project Settings` from the left (Gear icon)

Scroll down to `Script Properties` and click on *Edit script properties*

Click on *add script property* and add both **API key** and **API secret** in `Value` the property for both should be `API_KEY` and `SECRET` respectively.
