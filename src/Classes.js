class User {
    constructor(handle, onlineStatus) {
      this.handle = handle;
      this.onlineStatus = onlineStatus;
    }
  }
  
  class UserOnlineInfo {
    constructor() {
      this.total = new Color(0, 0, 0)
      
      this.hourlyStatus = new Array(24)
      for (var h = 0; h < 24; h++) {
        this.hourlyStatus[h] = new Color(0, 0, 0)
      }
  
      this.weeklyStatus = new Array(7)
      for (var w = 0; w < 7; w++) {
        this.weeklyStatus[w] = new Color(0, 0, 0)
      }
  
      this.dailyStatus = new Array(0)
    }
  
    getHourlyAverage() {
      var hourlyAverage = this.hourlyStatus
      hourlyAverage.forEach(hour => {
        hour.green /= this.total.green
        hour.red /= this.total.red
        hour.white /= this.total.white
      })
      return hourlyAverage;
    }
  
    getWeeklyAverage() {
      var weeklyAverage = this.hourlyStatus
      weeklyAverage.forEach(week => {
        week.green /= this.total.green
        week.red /= this.total.red
        week.white /= this.total.white
      })
      return weeklyAverage;
    }
  }
  
  // Green = online
  // Red = offline
  // white = missing data
  class Color {
    constructor(green, red, white) {
      this.green = green;
      this.red = red;
      this.white = white;
    }
  
    addColors(online, offline, missing) {
      this.green += online;
      this.red += offline;
      this.white += missing;
    }
  
    addRed() { this.red++ }
    addGreen() { this.green++ }
    addWhite() { this.white++ }
  }