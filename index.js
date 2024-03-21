const scriptProperties = PropertiesService.getScriptProperties();
const ss = SpreadsheetApp.getActiveSpreadsheet();
const logSheet = ss.getSheetByName("Log");

var NUMBER_OF_TRACKED = parseInt(scriptProperties.getProperty("NUMBER_OF_TRACKED"));
var numberOfCatches = 0;
function log() {
  var LATEST_LOGGED = getNextColumn()
  if(LATEST_LOGGED < 0) return;

  try {
    var onlineFriends = Fetch.onlineFriends()
    var allFriends = scriptProperties.getProperty("HANDLES").split(';')
  } catch (error) {
    console.warn("Number of API fails:", ++numberOfCatches)
    console.log("Reason:", error)
    Utilities.sleep(10000)

    if (numberOfCatches >= 30) {
      console.warn("Ran out of catches, cancelling this call")
      console.log(throwErrorLol)
      return;
    }
    log()
    return;
  }

  var j = 0;
  allFriends = allFriends.map((friend) => {
    const isOnline = friend === onlineFriends[j];
    if (isOnline) j++;

    return [friend, isOnline];
  });

  const currentTimeRange = logSheet.getRange(5, LATEST_LOGGED, NUMBER_OF_TRACKED, 1);

  var currentTimeColors = new Array(NUMBER_OF_TRACKED)

  allFriends.forEach((friend, index) => {
    if (friend[1]) {
      currentTimeColors[index] = [Enviroment.getOnlineColor()]
    }
    else {
      currentTimeColors[index] = [Enviroment.getOfflineColor()]
    }
  });
  currentTimeRange.setBackgrounds(currentTimeColors)
}


