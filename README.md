# CodeForces_Activity_Tracker
### CodeForces API-based online status tracker that runs for free using google sheets through Google Apps Script (GAS)

This project only tracks the `online` status on the CodeForces website along with some other basic info from the API about each user, it relies on google sheets as front end & database and google apps script triggers meaning no hosting costs

This is my first big project in a bit of an unusual language, so if someone has some advice to drop, I'd be more than glad.

Features are 
+ Log sheet stores whether each person has been online throughout 15 minute intervals of the day.
+ Info sheet for general account info: `rating info, contribution, friends, submissions, registration date and location info`
+ Summary sheet for better overview of the log: `Activity percentage by hour and day plus daily activity in minutes`
+ Graphs to display info and activity better

Here's an [example sheet](https://docs.google.com/spreadsheets/d/17ZdobApD7tCM1NWZAPXOkWtVOpIqxQ-OTyRaUePFlLg/edit?usp=sharing) working in order tracking 370 people
# Setup
As a prerequisite: you'll first need a throwaway CodeForces account with every person you want to track followed, you can use [this script](https://github.com/YousefMahmoudMalek/CodeForces_Activity_Tracker/blob/main/add-friends.py) to follow all the handles automatically, after which you need to generate an **API key** and **API secret** from [this page](https://codeforces.com/settings/api)

First step is to make a copy of [this spreadsheet](https://docs.google.com/spreadsheets/d/1W3XTmMHAS3upssMy-xqlS8rm-NPkGmnV-RtQhmZ6ztE/edit#gid=39384800)

Now from the resulting spreadsheep open `Extensions > Apps Script` and pick `Project Settings` from the left (Gear icon)

Scroll down to `Script Properties` and click on *Edit script properties*

Click on *add script property* and add both the **API key** and **API secret** in `Value` the key for both should be called `API_KEY` and `SECRET` respectively.

Next just go to the Editor and run these functions in order:  
1- Scripts > initialize  
2- Utility > addNextMonth  
3- Scripts > createTriggers  
google will ask you for authorization just click on advanced > go to.. > allow
 
The sheet should be ready, you can use the quick scripts tab to run some useful scripts but it should work and expand on its own, if there's any issues with the sheet contact me

# Issue
The current code is only sustianable until 7 or so months of tracking and then it will stop either due to google sheet row limit or until updating the summary becomes impossible (it always starts the script from the beginning) so until the issue is fixed please keep in mind you might have to make a new sheet every 6 months
