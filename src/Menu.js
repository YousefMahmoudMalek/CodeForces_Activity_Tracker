function onOpen() {
    var doc = SpreadsheetApp.getUi();
    var menu = doc.createMenu('Scripts');
  
    menu.addItem('Jump To Log', 'jumpToLog');
    menu.addItem('Update Info', 'updateInfoTableMenu');
    menu.addItem('Update Summary', 'updateSummaryData');
    menu.addItem('Update Starting Date', 'renewLogStartDate');
    menu.addItem('Retract Log Groups', 'retractAllGroups');
  
    menu.addToUi();
  }
  
  function jumpToLog() {
    ss.getSheetByName('log').getRange(4, getNextColumn(), 1, 1).activateAsCurrentCell()
    ss.toast('Jumped to the current timestamp in the log');
  }
  
  
  function updateInfoTableMenu() {
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('Update submissions?', 'Do you want to also update the submissions? (Warning: this might take some time)', ui.ButtonSet.YES_NO);
  
    if (response == ui.Button.YES) {
      var friendsInfo = Fetch.userInfo(Fetch.allFriends().join(';'));
      const infoTableRange = ss.getSheetByName(Enviroment.getInfoSheetName()).getRange(2, 1, NUMBER_OF_TRACKED, 12);
      updateInfoTable(friendsInfo, infoTableRange)
      updateSubmissionsCount()
    } else if (response == ui.Button.NO) {
      var friendsInfo = Fetch.userInfo(Fetch.allFriends().join(';'));
      const infoTableRange = ss.getSheetByName(Enviroment.getInfoSheetName()).getRange(2, 1, NUMBER_OF_TRACKED, 12);
      updateInfoTable(friendsInfo, infoTableRange)
    } else {
      // Do nothing lol
    }
  }
  
  function retractAllGroups() {
    const logSheet = ss.getSheetByName(Enviroment.getLogSheetName()).collapseAllColumnGroups()
    ss.getSheetByName(Enviroment.getLogSheetName()).expandColumnGroupsUpToDepth()
  }