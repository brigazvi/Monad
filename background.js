/////////////////////////////////////////////////
/**
 * @param {string} url
 */
async function updateMainTab(url) {
  console.log("7. updating main tab to: ", url)
  const mainTab = await getMainTab()
  return await browser.tabs.update(mainTab.id, { url: url })
}

/////////////////////////////////////////////////

/////////////////////////////////////////////////

/**
 * @param {browser.tabs.Tab} newTab
 */
function keepOneTab(newTab) {
  console.log("1. new tab has opened")
  // check if the new tab is actually a new window
  getMainTab()
    .then((mainTab) => {
      if (mainTab.id === newTab.id) {
        console.log("2. new window")
        return "new window"
      } else {
        console.log("2. regular new tab")
        return "new tab"
      }
    })
    .then((theSituation) => {
      console.log("3. dealing with the situation!")

      function onUpdate(id, update) {
        console.log("5. new tab has been updated")
        if (isWebsite(update.url)) {
          browser.tabs.remove(id).then(() => {
            updateMainTab(update.url)
          })
        }
      }

      // if it's actually a regular new tab, add listener for url updates:
      if (theSituation === "new tab") {
        console.log("4. adding new onUpdate event listener to tab ", newTab.id)
        browser.tabs.onUpdated.addListener(onUpdate, {
          tabId: newTab.id,
          properties: ["url"],
        })
      }
    })
}
////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////
async function getMainTab() {
  const allTabs = await browser.tabs.query({ currentWindow: true })
  return allTabs[0]
}
///////////////////////////////////////////////////////////////
/**
 *
 * @param {string} url
 * @returns {boolean}
 */
function isWebsite(url) {
  if (url.startsWith("http")) {
    console.log("6. it's a website")
    return true
  } else {
    console.log("6. it's not a website")
    return false
  }
}

// /**
//  * @param {browser.tabs.Tab} newTab
//  */
// function closePreviousTab(newTab) {
//     console.log(browser.sessions.)
//   // browser.tabs.remove(newTab.openerTabId)
// }

browser.tabs.onCreated.addListener(keepOneTab)

// doesn't work when opening extension settings!!!!!!!!!
