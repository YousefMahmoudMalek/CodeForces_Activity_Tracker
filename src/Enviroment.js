/**
 * Configuration file for none secretive info
 * Please set this up before initializing the script
 * This file is not secretive and can be seen by anyone with viewing access to the google sheet
 */

class Enviroment {
    // The color that represents an offline user in hexadecimal
    static getOnlineColor() {
      return "#00FF00";
    }
  
    // The color that represents an online user in hexadecimal
    static getOfflineColor() {
      return "#FF0000";
    }
  
    // The name of the sheet for info, if you change its name make sure to change it here too (case sensetive)
    static getInfoSheetName() {
      return "Info";
    }
  
    // The name of the sheet for the main log, if you change its name make sure to change it here too (case sensetive)
    static getLogSheetName() {
      return "Log";
    }
  
    // The name of the sheet for graphs, if you change its name make sure to change it here too (case sensetive)
    static getSummarySheetName() {
      return "Summary";
    }
  
    // The API key of your account, you can set it up here but you should set it up in secrets best (this file is not secretive to viewers)
    static getApiKey() {
      return scriptProperties.getProperty("API_KEY") || "NOT RECOMMENDED";
    }
  
    // The secret key of your account, you can set it up here but you should set it up in secrets best (this file is not secretive to viewers)
    static getSecret() {
      return scriptProperties.getProperty("SECRET") || "NOT RECOMMENDED";
    }
  
    // The number of times the logging script calls the API if it fails
    static getNumberOfCatches() {
      return 30;
    }
  
    // The number of millieseconds the script sleeps between API failured
    static getSleepTime() {
      return 10000;
    }
  
    // Choose between a 24 hour or a 12 hour format for the hour row, you can change how either's look or add new in the CopyPaste sheet
    static dayFormat(){
      const typeIs24 = false;
      
      if(typeIs24){
        return "day_template_24";
      }
      else{
        return "day_template_12";
      }
    }
  
    // What image will be used for "Overall" in the summary sheet
    static overallIcon (){
      return "https://eccoe.eu/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/default-group.png";
    }
    /** Don't change the following functions **/
  
    // The last column in the log, important for many functions, DON'T CHANGE THIS FUNCTION
    static getEndOfLog() {
      const logSheet = ss.getSheetByName(Enviroment.getLogSheetName());
      return logSheet.getLastColumn() + 1;
    }
    
    // Extract currently registed handles
    static getHandles() {
      return scriptProperties.getProperty("HANDLES").split(';');
    }
  
    static getNumberOfTracked() {
      return parseInt(scriptProperties.getProperty("NUMBER_OF_TRACKED"));
    }
  
    // At what second is the first timestamp in the log
    // If you trim a part of the start of the log run renewLogStartDate() after making sure the month, day and hour cells contain the proper value
    static getLogStartSeconds() {
      return parseInt(scriptProperties.getProperty("LOG_START_SECONDS"));
    }
  }