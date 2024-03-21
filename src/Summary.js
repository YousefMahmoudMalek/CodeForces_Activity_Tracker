function updateSummaryDataNew() {
    const logStart = scriptProperties.getProperty("LAST_SUMMARY") || 2
    latestLoggedCol = getNextColumn()
    const logEnd = (latestLoggedCol - 1) - ((latestLoggedCol - 1) % ((24*4))) + 1
  
    const fullLogColors = logSheet.getRange(5, logStart, NUMBER_OF_TRACKED, logEnd).getBackgrounds()
    const numberOfDays = (logEnd - (logStart - 1)) / (24 * 4)
    if (numberOfDays == 0) return;
    l(logStart)
    l(logEnd)
    l(numberOfDays)
    const startDay = (new Date(Enviroment.getLogStartSeconds() * 1000).getDay() + numberOfDays) % 7
  
    var fullLogInfo = new Array(NUMBER_OF_TRACKED)
  
    for (var i = 0; i < fullLogInfo.length; i++) {
      fullLogInfo[i] = new UserOnlineInfo();
    }
  
    for (var i = 0; i < fullLogColors.length; i++) {
      var j = 0;
      for (var day = 0; day < numberOfDays; day++) {
  
        const totalBefore = new Color(fullLogInfo[i].total.green, fullLogInfo[i].total.red, fullLogInfo[i].total.white)
        for (var hour = 0; hour < 24; hour++) {
  
          for (var minute = 0; minute < 4; minute++) {
  
            if (fullLogColors[i][j] == Enviroment.getOnlineColor()) {
              fullLogInfo[i].total.addGreen();
              fullLogInfo[i].hourlyStatus[hour].addGreen();
              fullLogInfo[i].weeklyStatus[(startDay + day) % 7].addGreen();
            }
            else if (fullLogColors[i][j] == Enviroment.getOfflineColor()) {
              fullLogInfo[i].total.addRed();
              fullLogInfo[i].hourlyStatus[hour].addRed();
              fullLogInfo[i].weeklyStatus[(startDay + day) % 7].addRed();
            }
            else {
              fullLogInfo[i].total.addWhite();
              fullLogInfo[i].hourlyStatus[hour].addWhite();
              fullLogInfo[i].weeklyStatus[(startDay + day) % 7].addWhite();
            }
            j++;
          }
        }
        var dailyGreen = fullLogInfo[i].total.green - totalBefore.green;
        var dailyRed = fullLogInfo[i].total.red - totalBefore.red
        var dailyWhite = fullLogInfo[i].total.white - totalBefore.white;
        fullLogInfo[i].dailyStatus.push(new Color(dailyGreen, dailyRed, dailyWhite))
      }
    }
  
    scriptProperties.setProperty("LAST_SUMMARY", logEnd + 1)
  }
  function updateSummaryData() {
  
    const END_OF_LOG = Enviroment.getEndOfLog()
    const fullLogRange = logSheet.getRange(5, 2, NUMBER_OF_TRACKED, END_OF_LOG - 2)
    const fullLogColors = fullLogRange.getBackgrounds()
    const numberOfDays = (END_OF_LOG - 2) / (24 * 4)
    const startDay = new Date(Enviroment.getLogStartSeconds() * 1000).getDay()
    var fullLogInfo = new Array(NUMBER_OF_TRACKED)
  
    for (var i = 0; i < fullLogInfo.length; i++) {
      fullLogInfo[i] = new UserOnlineInfo();
    }
  
    for (var i = 0; i < fullLogColors.length; i++) {
      var j = 0;
      for (var day = 0; day < numberOfDays; day++) {
        const totalBefore = new Color(fullLogInfo[i].total.green, fullLogInfo[i].total.red, fullLogInfo[i].total.white)
        for (var hour = 0; hour < 24; hour++) {
  
          for (var minute = 0; minute < 4; minute++) {
  
            if (fullLogColors[i][j] == '#00ff00') {
              fullLogInfo[i].total.addGreen();
              fullLogInfo[i].hourlyStatus[hour].addGreen();
              fullLogInfo[i].weeklyStatus[(startDay + day) % 7].addGreen();
            }
            else if (fullLogColors[i][j] == '#ff0000') {
              fullLogInfo[i].total.addRed();
              fullLogInfo[i].hourlyStatus[hour].addRed();
              fullLogInfo[i].weeklyStatus[(startDay + day) % 7].addRed();
            }
            else {
              fullLogInfo[i].total.addWhite();
              fullLogInfo[i].hourlyStatus[hour].addWhite();
              fullLogInfo[i].weeklyStatus[(startDay + day) % 7].addWhite();
            }
            j++;
          }
        }
        var dailyGreen = fullLogInfo[i].total.green - totalBefore.green;
        var dailyRed = fullLogInfo[i].total.red - totalBefore.red
        var dailyWhite = fullLogInfo[i].total.white - totalBefore.white;
        fullLogInfo[i].dailyStatus.push(new Color(dailyGreen, dailyRed, dailyWhite))
      }
    }
  
    const summarySheet = ss.getSheetByName(Enviroment.getSummarySheetName())
  
    const totalMinutesRange = summarySheet.getRange(3, 3, NUMBER_OF_TRACKED)
    const graphHourlyAverageRange = summarySheet.getRange(3, 6, NUMBER_OF_TRACKED, 24)
    const graphWeeklyAverageRange = summarySheet.getRange(3, 30, NUMBER_OF_TRACKED, 7)
    const graphDailyAverageRange = summarySheet.getRange(3, 37, NUMBER_OF_TRACKED, numberOfDays)
  
    fullLogInfo.forEach((user, userIndex) => {
  
      if (user.total.green == 0) return;
  
      user.hourlyStatus.forEach((hour, hourIndex) => {
        var cell = graphHourlyAverageRange.getCell(userIndex + 1, hourIndex + 1)
        cell.setValue(hour.green / user.total.green)
      })
  
      user.weeklyStatus.forEach((week, weekIndex) => {
        var cell = graphWeeklyAverageRange.getCell(userIndex + 1, weekIndex + 1)
        cell.setValue(week.green / user.total.green)
      })
  
      updateActivityTrend(summarySheet, graphDailyAverageRange, numberOfDays)
      user.dailyStatus.forEach((day, dayIndex) => {
        var cell = graphDailyAverageRange.getCell(userIndex + 1, dayIndex + 1)
        cell.setValue(day.green * 15)
      })
  
      totalMinutesRange.getCell(userIndex + 1, 1).setValue(user.total.green * 15)
    })
  
    summarySheet.getRange("A1").setValue(`${numberOfDays} Days`)
  
    const activityTrendChart = summarySheet.getCharts()[2];
    const handle = activityTrendChart.getOptions().get('subtitle')
    var header = activityTrendChart.getRanges()[0]
    var oldSeries = activityTrendChart.getRanges()[1]
    var newHeader = summarySheet.getRange(header.getRow(), header.getColumn(), 1, summarySheet.getLastColumn() - header.getColumn())
    var newSeries = summarySheet.getRange(oldSeries.getRow(), oldSeries.getColumn(), 1, summarySheet.getLastColumn() - oldSeries.getColumn())
  
    var modifiedChart = activityTrendChart.modify()
      .clearRanges()
      .addRange(newHeader)
      .addRange(newSeries)
      .setOption('subtitle', handle)
      .build();
    summarySheet.updateChart(modifiedChart)
  }
  
  function onEdit(e) {
    if (e.source.getActiveSheet().getName() != Enviroment.getSummarySheetName()) return;
    if (!e.range.isChecked()) return;
  
    const summarySheet = ss.getSheetByName(Enviroment.getSummarySheetName())
  
    const checkBoxesRange = summarySheet.getRange(3, 1, NUMBER_OF_TRACKED + 1, 1)
    const row = e.range.getRow() - 2;
    modifyCharts(summarySheet, row)
  
    checkBoxesRange.uncheck()
    checkBoxesRange.getCell(row, 1).check()
    ss.toast(summarySheet.getRange(row + 2, 2, 1, 1).getCell(1, 1).getValue())
  }
  
  
  function modifyCharts(summarySheet, index) {
    const newCellImage = SpreadsheetApp.newCellImage()
      .setSourceUrl(extractLinkFromInfo(index))
      .build();
    summarySheet.getRange(Enviroment.getNumberOfTracked() + 4, 1).setValue(newCellImage)
  
    const charts = summarySheet.getCharts();
    const handle = summarySheet.getRange(index + 2, 2).getCell(1, 1).getValue()
    charts.forEach(chart => {
      var header = chart.getRanges()[0]
      var oldSeries = chart.getRanges()[1]
      var newSeries = summarySheet.getRange(index + 2, oldSeries.getColumn(), 1, oldSeries.getWidth())
  
      var newChart = chart.modify()
        .clearRanges()
        .addRange(header)
        .addRange(newSeries)
        .setOption('subtitle', handle)
        .build();
      summarySheet.updateChart(newChart)
    })
  }
  
  
  function updateActivityTrend(summarySheet, activityRange, numOfDays) {
    activityRange.setBorder(true, true, true, true, false, false)
    activityRange.setNumberFormat("0")
    const header = summarySheet.getRange(2, 37, 1, numOfDays)
    const footer = summarySheet.getRange(3 + NUMBER_OF_TRACKED, 37, 1, numOfDays)
    header.setBorder(true, true, true, true, true, true)
    footer.setBorder(true, true, true, true, false, false)
      .setBorder(true, null, true, null, false, false, 'black', SpreadsheetApp.BorderStyle.SOLID_THICK)
  
    header.setValues([Array.from({ length: numOfDays }, (_, index) => index + 1)]);
  
    footer.setFormulaR1C1(`=SUM(R[-${NUMBER_OF_TRACKED}]C[0]:R[-1]C[0])/${NUMBER_OF_TRACKED}`)
    //for (i = 1; i <= numOfDays; i++) {
    //  header.getCell(2, i).setValue(i)
    // }
  }