function initialize() {
    var allFriends = Fetch.allFriends();
    var friendsInfo = Fetch.userInfo(allFriends.join(';'));
  
    // Initialize sheets
    const infoSheet = ss.getSheetByName(Enviroment.getInfoSheetName());
    const logSheet = ss.getSheetByName(Enviroment.getLogSheetName());
    const summarySheet = ss.getSheetByName(Enviroment.getSummarySheetName());
  
    // Handles adding/removing tracked handles upon change while keeping the order lexicographical
    if (scriptProperties.getProperty("HANDLES") != null) {
      var previousHandles = scriptProperties.getProperty("HANDLES").split(';')
      var previousIndex = 0;
  
      previousHandles.forEach((friend, index) => {
        var currentIndex = allFriends.indexOf(friend) + 1;
        previousHandles[index] = [friend, currentIndex - previousIndex - 1]
        previousIndex = currentIndex != 0 ? currentIndex : previousIndex;
      });
  
      var alreadyInserted = 0;
      previousHandles.forEach((handle, index) => {
        index++
        if (handle[1] < 0) {
          l(index + 4)
          infoSheet.deleteRow(index + 1 + alreadyInserted)
          logSheet.deleteRow(index + 4 + alreadyInserted)
          summarySheet.deleteRow(index + 2 + alreadyInserted)
          alreadyInserted--;
        }
        else if (handle[1] > 0) {
          infoSheet.insertRowsBefore(index + 1 + alreadyInserted, handle[1])
          logSheet.insertRowsBefore(index + 4 + alreadyInserted, handle[1])
          summarySheet.insertRowsBefore(index + 2 + alreadyInserted, handle[1])
          alreadyInserted += handle[1];
        }
      });
    }
  
    var NUMBER_OF_TRACKED = allFriends.length
  
    scriptProperties.setProperty("NUMBER_OF_TRACKED", NUMBER_OF_TRACKED)
    scriptProperties.setProperty("HANDLES", allFriends.join(';'))
  
  
    // Get ranges
    const infoTableRange = infoSheet.getRange(2, 1, NUMBER_OF_TRACKED, 12);
    const logNamesRange = logSheet.getRange(5, 1, NUMBER_OF_TRACKED);
    const summaryNamesRange = summarySheet.getRange(3, 2, NUMBER_OF_TRACKED + 1);
  
    // Transposes the handles array to become a single row (1D to 2D array)
    allFriends = allFriends.map(handle => {
      return [`=HYPERLINK("codeforces.com/profile/${handle}","${handle}")`];
    });
  
    // Sets up the initial data for the info
    updateInfoTable(friendsInfo, infoTableRange)
  
    logNamesRange.setValues(allFriends);
    summaryNamesRange.setValues(allFriends.concat([['Overall']]));
    summaryNamesRange.offset(0, -1).insertCheckboxes()
      .setFontColor('red')
      .setFontSize(10)
      .setBorder(null, null, null, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID);
  
    /** Trim the excess rows **/
    [infoSheet, logSheet, summarySheet].forEach(sheet => {
  
      var lastOccupiedRow = sheet.getLastRow();
  
      if (lastOccupiedRow > 1 && lastOccupiedRow != sheet.getMaxRows()) {
        sheet.deleteRows(lastOccupiedRow + 1, logSheet.getMaxRows() - lastOccupiedRow)
      }
    });
  
    // Format all the name columns
    [infoTableRange, logNamesRange, summaryNamesRange].forEach(range => {
      range.setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_THICK)
        .setBorder(null, null, null, null, null, true, "black", SpreadsheetApp.BorderStyle.SOLID);
      range.setFontSize(11)
      range.setFontWeight('normal')
    });
    /**  Info Reformatting **/
    // Border
    infoTableRange.setBorder(true, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_THICK)
      .setBorder(null, null, null, null, true, null, "black", SpreadsheetApp.BorderStyle.SOLID)
    infoTableRange.setFontSize(10).setFontWeight('normal')
  
    /** Log Reformatting **/
    if (Enviroment.getEndOfLog() > 2) {
      logSheet.getRange(5, 2, NUMBER_OF_TRACKED, Enviroment.getEndOfLog() - 2)
        .setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_THICK);
    }
  
    logSheet.getRange(5, 1, NUMBER_OF_TRACKED, 1).setBackgrounds(logAlternatingColors(NUMBER_OF_TRACKED))
  
    /** Graph Reformatting **/
    //Overall
    summarySheet.getRangeList([R1C1(3, 3, NUMBER_OF_TRACKED + 1, 3), R1C1(3, 6, NUMBER_OF_TRACKED + 1, 24), R1C1(3, 30, NUMBER_OF_TRACKED + 1, 7)])
      .setBorder(true, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
      .setFontSize(11)
      .setFontWeight(null)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
  
    // Percentage number format
    summarySheet.getRange(3, 6, NUMBER_OF_TRACKED, 31).setNumberFormat("0%")
  
    // Number of handles
    summarySheet.getRange("B1").getCell(1, 1).setValue(`${NUMBER_OF_TRACKED} Handles`)
      .setBorder(null, true, null, true, null, null, 'black', SpreadsheetApp.BorderStyle.SOLID)
  
    // Row size for handles
    summarySheet.setRowHeightsForced(3, NUMBER_OF_TRACKED, 21);
  
    // Inner border
    summarySheet.getRange(NUMBER_OF_TRACKED + 3, 1, 1, Enviroment.getEndOfLog() - 1)
      .setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_THICK)
      .setBorder(true, null, null, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
    // Footer formatting
    summarySheet.getRange(NUMBER_OF_TRACKED + 3, 1, 1, summarySheet.getLastColumn())
      .setFontSize(14)
      .setFontWeight('bold')
      .setBorder(true, false, true, false, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_THICK);
  
    // Hour formula
    summarySheet.getRange(NUMBER_OF_TRACKED + 3, 3, 1, 34)
      .setFormulaR1C1(`=SUM(R[-${NUMBER_OF_TRACKED}]C[0]:R[-1]C[0])`);
    
    // Hour formula
    summarySheet.getRange(NUMBER_OF_TRACKED + 3, 6, 1, 34)
      .setFormulaR1C1(`=SUM(R[-${NUMBER_OF_TRACKED}]C[0]:R[-1]C[0])/${NUMBER_OF_TRACKED}`)
  
    summarySheet.setRowHeight(NUMBER_OF_TRACKED + 3, 45)
    // More formulas
    summarySheet.getRange(3, 4, NUMBER_OF_TRACKED + 1, 1) // Hours
      .setFormulaR1C1(`=SUM(R[0]C[-1]:R[0]C[-1])/60`);
    summarySheet.getRange(3, 5, NUMBER_OF_TRACKED + 1, 1) // Days
      .setFormulaR1C1(`=SUM(R[0]C[-1]:R[0]C[-1])/24`);
    // Changing chart posision
    var offsetX = 0;
    summarySheet.getCharts().forEach(graph => {
  
      graph = graph.modify()
        .setPosition(NUMBER_OF_TRACKED + 4, 6, offsetX, (summarySheet.getRowHeight(summarySheet.getLastRow()) - graph.getOptions().get("height")) / 2)
        .build();
  
      summarySheet.updateChart(graph);
  
      offsetX += graph.getOptions().get("width")
    });
  
  }
  
  function createTriggers() {
    ScriptApp.newTrigger('log')
      .timeBased().everyMinutes(15)
      .create();
  
    ScriptApp.newTrigger('addNextMonth')
      .timeBased().onMonthDay(25)
      .create();
  }
  
  function updateInfoTable(friendsInfo, infoTableRange) {
    var tableData = friendsInfo.map((friendInfo, index) => {
      return [`=HYPERLINK("codeforces.com/profile/${friendInfo.handle}","${friendInfo.handle}")`
        , `${friendInfo.rating || "0"}`
        , `${calculateRank(friendInfo.rating)}`
        , `${friendInfo.maxRating || "0"}`
        , `${calculateRank(friendInfo.maxRating)}`
        , `${friendInfo.contribution}`
        , `${friendInfo.friendOfCount - 1}`
        , `${infoTableRange.getCell(index + 1, 8).getValue()}`
        , `${msToDate(friendInfo.registrationTimeSeconds)}`
        , `${friendInfo.country || ""}`
        , `${friendInfo.city || ""}`
        , `${friendInfo.titlePhoto.indexOf("no-title.jpg") > -1 ? `=HYPERLINK("${friendInfo.titlePhoto}","Default")` : `=HYPERLINK("${friendInfo.titlePhoto}","Custom")`}`];
    });
  
    infoTableRange.setValues(tableData);
  }