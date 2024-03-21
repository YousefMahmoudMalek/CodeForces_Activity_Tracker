function getDaysFromMonth(month, year) {
    switch (month) {
      case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        return 31;
      case 4: case 6: case 9: case 11:
        return 30;
      case 2:
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }
  }
  
  function splitHandles(handlesString) {
    if (handlesString.length < 0) return [handlesString];
  
    var handlesArray = new Array()
  
    while (handlesString.length > 0) {
  
      var index = handlesString.indexOf(';', 2000);
      if (index == -1) index = handlesString.length;
  
      var slice = handlesString.substring(0, index);
  
      handlesString = handlesString.substring(index + 1);
  
      handlesArray.push(slice)
    }
    return handlesArray;
  }
  
  function msToDate(secondsEpoch) {
    const dateObj = new Date(secondsEpoch * 1000)
  
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  }
  
  function calculateRank(rating) {
    var rank;
    switch (true) {
      case rating >= 3000:
        rank = "Legendary Grandmaster"
        break;
      case rating >= 2600:
        rank = "International Grandmaster"
        break;
      case rating >= 2400:
        rank = "Grandmaster"
        break;
      case rating >= 2300:
        rank = "International Master"
        break;
      case rating >= 2100:
        rank = "Master"
        break;
      case rating >= 1900:
        rank = "Expert"
        break;
      case rating >= 1600:
        rank = "Specialist"
        break;
      case rating >= 1400:
        rank = "Apprentice"
        break;
      case rating >= 1200:
        rank = "Pupil"
        break;
      case rating > 0:
        rank = "Newbie"
        break;
      default:
        rank = "unrated"
        break;
    }
    return rank;
  }
  
  function extractLinkFromInfo(rowNumber) {
    if (rowNumber == NUMBER_OF_TRACKED + 1){
      return Enviroment.overallIcon();
    }
    const linkFormula = ss.getSheetByName(Enviroment.getInfoSheetName()).getRange(rowNumber + 1,12).getFormula();
  
    return linkFormula.substring(12, linkFormula.indexOf('"', 12))
  }
  
  function R1C1(row, column, numRows, numCols) {
    return `R${row}C${column}:R${row + numRows - 1}C${column + numCols - 1}`;
  }
  
  function l(something) {
    console.log(something)
  }