/**
 * Copyright 2023 Google LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific lan  guage governing permissions and
 *  limitations under the License.
 */

const PARTNER_ID = SpreadsheetApp.getActiveSpreadsheet()
                       .getActiveSheet()
                       .getRange(2, 2)
                       .getValue();
const ADVERTISER_ID = SpreadsheetApp.getActiveSpreadsheet()
                          .getActiveSheet()
                          .getRange(3, 2)
                          .getValue();

/**
 * Creates a custom menu with an option to send feedback directly in the tool
 */
function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('Script Builder')
      .addItem('Send Feedback', 'sendFeedback')
      .addItem('Open DV360 (Adv)', 'openAdvDV360')
      .addItem('Open DV360 (Partner)', 'openPartnerDV360')
      .addToUi();
  if (firstOpen()) {
    response = ui.alert(
        'The Google team who built this solution is requesting to have view access to this spreadsheet, to collect usage and error data.  This data will allow the team to: \n \n' +
            '\0 \0 \0 \0 \0 \0 \0 \0 \0 \u2022 monitor common errors and premptively fix them \n' +
            '\0 \0 \0 \0 \0 \0 \0 \0 \0 \u2022 collect aggregate usage data to justify continued support for the solution \n \n' +
            'You will be able to remove this access at any time from the native user sharing menu.  Would you like to grant view access to cb-script-builder-tracking@google.com?',
        ui.ButtonSet.YES_NO);
    if (response == ui.Button.YES) {
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        ss.addViewer('cb-script-builder-tracking@google.com');
        ui.alert('Sharing was a success');
      } catch (err) {
        ui.alert(
            'There was an error.  Please manually add cb-script-builder-tracking@google.com as a viewer.');
      }
    }
  }
}


/**
 * Checks if this is first time the spreadsheet has been opened
 */
function firstOpen() {
  const ps = PropertiesService.getScriptProperties();
  let loginCheck = ps.getProperty('First Login');
  if (!loginCheck) {
    ps.setProperty('First Login', 'YES');
    return true;
  } else {
    return false;
  }
}


/**
 * Adds ability for users to send a feedback email directly from the UI
 */
function sendFeedback() {
  try {
    let ui = SpreadsheetApp.getUi();
    response = ui.alert(
        'You can provide feedback on this solution by sending an email to cb-script-builder+feedback@google.com.\n Alternatively, you can provide feedback directly via this dialogue box.  Would like to proceed with that option?',
        ui.ButtonSet.YES_NO);
    if (response == ui.Button.YES) {
      let subject = ui.prompt('Please give a short title for your feedback');
      if (subject.getSelectedButton() != ui.Button.OK) {
        return;
      }
      let body = ui.prompt('Please provide your full feedback message below');
      if (body.getSelectedButton() != ui.Button.OK) {
        return;
      }
      MailApp.sendEmail({
        to: 'cb-script-builder+feedback@google.com',
        subject: subject.getResponseText(),
        body: body.getResponseText()
      });
    }
    logFunctionRun('Send Feedback');
  } catch (err) {
    Browser.msgBox('ERROR', err.message, Browser.Buttons.OK);
    logFunctionRun('Send Feedback', err);
  }
}

/**
 * Opens DV360 UI to Advertiser's Custom Bidding page
 * Wrapper function is necessary because functions called from the menu cannot
 * pass parameters
 */
function openAdvDV360() {
  try {
    openDV360('Advertiser');
    logFunctionRun('Open DV360 Adv');
  } catch (err) {
    Browser.msgBox('ERROR', err.message, Browser.Buttons.OK);
    logFunctionRun('Open DV360 Adv', err);
  }
}

/**
 * Opens DV360 UI to Partner's Custom Bidding page
 * Wrapper function is necessary because functions called from the menu cannot
 * pass parameters
 */
function openPartnerDV360() {
  try {
    openDV360('Partner');
    logFunctionRun('Open DV360 Partner');
  } catch (err) {
    Browser.msgBox('ERROR', err.message, Browser.Buttons.OK);
    logFunctionRun('Open DV360 Partner', err);
  }
}

/**
 * Opens DV360 UI to Custom Bidding page in a new tab
 * @param {string} hierarchyLevel The hierarchy level (Partner or Advertiser)
 *     where the platform should open
 */

function openDV360(hierarchyLevel) {
  try {
    htmlTemplate =
        HtmlService.createTemplateFromFile('CustomBiddingRedirect.html');
    if (hierarchyLevel == 'Advertiser') {
      htmlTemplate.redirect_url = 'https://displayvideo.google.com/ng_nav/p/' +
          PARTNER_ID + '/a/' + ADVERTISER_ID + '/custom-bidding';
    } else if (hierarchyLevel == 'Partner') {
      htmlTemplate.redirect_url = 'https://displayvideo.google.com/ng_nav/p/' +
          PARTNER_ID + '/custom-bidding';
    }
    let htmlOutput = htmlTemplate.evaluate().getContent();
    SpreadsheetApp.getUi().showModalDialog(
        HtmlService.createHtmlOutput(htmlOutput).setHeight(50),
        'Opening DV360');
  } catch (err) {
    Browser.msgBox('ERROR', err.message, Browser.Buttons.OK);
    logFunctionRun('Open DV360', err);
  }
}
