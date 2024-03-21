function addNextMonth() {
    now = new Date();
  
    var year = now.getFullYear();
    var month = now.getMonth() + 2;
    if (ss.getSheetByName(Enviroment.getLogSheetName()).getLastColumn() < 10) month--;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (month == 13) {
      month = 1;
      year++;
    }
    var numberOfDays = getDaysFromMonth(month, year);
  
    const width = numberOfDays * 24 * 4
    const END_OF_LOG = Enviroment.getEndOfLog()
  
    logSheet.insertColumnsBefore(END_OF_LOG, width)
    logSheet.getRange(5, END_OF_LOG, NUMBER_OF_TRACKED, width)
      .setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
      .setBorder(null, true, null, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
    const monthRange = logSheet.getRange(1, END_OF_LOG, 1, width)
  
    monthRange.getCell(1, 1)
      .setValue(`${month} [${months[month - 1]}]`)
      .setBorder(true, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
  
    monthRange.merge()
    // Making the column group
    logSheet.getRange(1, END_OF_LOG + 1, 1, width - 1).activate().shiftColumnGroupDepth(1);
  
    const DAILY_FORMAT = ss.getSheetByName("CopyPaste").getRange(Enviroment.dayFormat())
  
    for (var i = 1; i <= numberOfDays; i++) {
      var dayRange = logSheet.getRange(2, END_OF_LOG + (i - 1) * 24 * 4, 1, 24 * 4)
      dayRange.getCell(1, 1).setValue(i)
      dayRange.setBorder(null, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
      dayRange.merge()
      hourRange = logSheet.getRange(3, END_OF_LOG + (i - 1) * 24 * 4, 2, 24 * 4)
      DAILY_FORMAT.copyTo(hourRange, SpreadsheetApp.CopyPasteType.PASTE_NORMAL);
    }
  }
  
  function getNextColumn() {
    const timeNowSeconds = Math.floor(new Date().getTime() / 1000)
    const logStartSeconds = Enviroment.getLogStartSeconds() || renewLogStartDate()
    return Math.ceil((timeNowSeconds - logStartSeconds) / (60 * 15)) + 1;
  }
  
  function renewLogStartDate() {
    var dateTemplate = new Date()
    const logStartRange = ss.getSheetByName("Log").getRange(1, 2, 4, 1);
  
    var year = dateTemplate.getFullYear()
    var month = parseInt(logStartRange.getCell(1, 1).getValue().split(' ')[0]) - 1
    var day = logStartRange.getCell(2, 1).getValue()
    var hour = logStartRange.getCell(3, 1).getValue()
    var minute = logStartRange.getCell(4, 1).getValue()
  
    hour = typeof hour == "object" ? hour.getHours() : hour;
  
    dateTemplate.setFullYear(year, month, day)
    dateTemplate.setHours(hour, minute, 0, 0)
  
    scriptProperties.setProperty("LOG_START_SECONDS", String(Math.floor(dateTemplate.getTime() / 1000)))
  
    return dateTemplate;
  }
  
  function updateSubmissionsCount() {
    const submissionsRange = ss.getSheetByName(Enviroment.getInfoSheetName()).getRange(2, 8, NUMBER_OF_TRACKED, 1)
  
    var submissionsCountList = Enviroment.getHandles()
  
    submissionsCountList = submissionsCountList.map(handle => {
      Utilities.sleep(100)
      return [Fetch.submissionsCount(handle)];
    });
    l(submissionsCountList)
    submissionsRange.setValues(submissionsCountList)
  }
  
  function logAlternatingColors(numberOfHandles = 5) {
    const copyPasteSheet = ss.getSheetByName("CopyPaste")
    const firstColor = copyPasteSheet.getRange("B9").getBackground()
    const secondColor = copyPasteSheet.getRange("B10").getBackground()
    var backgroundColors = Array.from({ length: numberOfHandles }, (_, index) => ([index % 2 === 0 ? firstColor : secondColor]))
  
    return backgroundColors;
  }
  /*
  function changeAvatar() {
    const infoSheet = ss.getSheetByName(Enviroment.getInfoSheetName())
    const currentRow = infoSheet.getCurrentCell().getRow();
    const image = infoSheet.getImages()[0]
    l (infoSheet.getImages())
    const link = extractLinkFromInfo(currentRow)
    l(link)
    
    infoSheet.insertImage(link, 12, currentRow)
    const image2 = infoSheet.getImages()[0]
    image2.setHeight(1000).setWidth(1000)
  
  }
  */