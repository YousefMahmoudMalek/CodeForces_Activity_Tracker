from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


import time

MY_EMAIL = "your throw-away account email here"
MY_PASS = "your throw-away account password here"

allHandles =['find a way', 'to import a string', 'of all the handles', 'into this variable']

failedAdditions = []
driver = webdriver.Chrome()

driver.get("https://codeforces.com/enter?back=%2F")
emailInput = driver.find_element(
    by=By.ID, value="handleOrEmail"
)


passwordInput = driver.find_element(
    by=By.ID, value="password"
)

submitButton = driver.find_element(
    by=By.CLASS_NAME, value="submit"
)

emailInput.send_keys(MY_EMAIL)
passwordInput.send_keys(MY_PASS)

submitButton.click()

time.sleep(20)

for handle in allHandles:
        driver.get("https://codeforces.com/profile/" + handle)
        try:
            addFriend = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//img[@class='addFriend friendStar']"))
            )
            addFriend.click()
            print("Sucessfully added " + handle)
            time.sleep(2)
        except:
            try:
                addFriend = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "//img[@class='removeFriend friendStar']"))
                )
                print(handle + " is already added as a friend")
            except:
                print("Failed to add " + handle)
                failedAdditions.append(handle)

print("Failed to add the following:")

for handle in failedAdditions:
     print(handle)
