/**
 * Class for organizing all the fetch functions
 * Every function by default excludes the status returned by codeforces and returns a sorted result
 */
class Fetch {
    static allFriends() {
      const API_KEY = Enviroment.getApiKey();
      const SECRET = Enviroment.getSecret();
      var signiture = Math.floor(Math.random() * 900000) + 100000;
  
      var url = 'https://codeforces.com/api/user.friends?onlyOnline=false&'
        + `apiKey=${API_KEY}&`
        + `time=${Math.floor(Date.now() / 1000)}&`
        + `apiSig=${signiture}`
        + `${SHA512(`${signiture}/user.friends?apiKey=${API_KEY}&onlyOnline=false&time=${Math.floor(Date.now() / 1000)}#${SECRET}`)}`
  
      var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
      return JSON.parse(response.getContentText()).result.sort();
    }
  
    static onlineFriends() {
      const API_KEY = Enviroment.getApiKey();
      const SECRET = Enviroment.getSecret();
      var signiture = Math.floor(Math.random() * 900000) + 100000;
  
      var url = 'https://codeforces.com/api/user.friends?onlyOnline=true&'
        + `apiKey=${API_KEY}&`
        + `time=${Math.floor(Date.now() / 1000)}&`
        + `apiSig=${signiture}`
        + `${SHA512(`${signiture}/user.friends?apiKey=${API_KEY}&onlyOnline=true&time=${Math.floor(Date.now() / 1000)}#${SECRET}`)}`;
  
      var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
      return JSON.parse(response.getContentText()).result.sort();
    }
  
    static userInfo(handles) {
      handles = splitHandles(handles)
      var responseArray = new Array()
  
      handles.forEach(handleString => {
        var url = `https://codeforces.com/api/user.info?handles=${handleString}`
  
        var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
  
        responseArray = responseArray.concat(JSON.parse(response.getContentText()).result)
      });
  
      return responseArray;
    }
  
    static submissionsCount(handle) {
      var url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`;
      for (var attempt = 1; attempt <= 50; attempt++) {
        try {
          var response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': false });
          return JSON.parse(response.getContentText()).result.length;
        } catch (error) {
          Utilities.sleep(5000);
          console.error(`Attempt ${attempt} at submission API call failed. Cooling down for 5 seconds...`);
        }
      }
    }
  }
  