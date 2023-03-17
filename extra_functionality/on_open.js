/**
 * Copyright 2022 Google LLC
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
      .addItem('Open DV360', 'openDV360')
      .addToUi();
  ui.alert(
      'This is a BETA version of the tool.  Please DO NOT make copies at this time. Also please be aware that the Google team will have access to this sheet in order to monitor logs and check for errors.');
};


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
        return
      };
      let body = ui.prompt('Please provide your full feedback message below');
      if (body.getSelectedButton() != ui.Button.OK) {
        return
      };
      MailApp.sendEmail({
        to: 'cb-script-builder+feedback@google.com',
        subject: subject.getResponseText(),
        body: body.getResponseText()
      })
    }
  } catch (err) {
    Browser.msgBox('There was an error: \\n \\n' + err);
    logFunctionRun('Send Feedback', err);
  }
}

/**
 * Opens DV360 UI to Advertiser's Custom Bidding page in a new tab
 */

function openDV360() {
  try {
    let htmlTemplate = HtmlService.createTemplateFromFile('CustomBiddingRedirect.html');
    htmlTemplate.partner_id = PARTNER_ID
    htmlTemplate.advertiser_id = ADVERTISER_ID
    let htmlOutput = htmlTemplate.evaluate().getContent();
    SpreadsheetApp.getUi().showModalDialog(
        HtmlService.createHtmlOutput(htmlOutput).setHeight(50), 'Opening DV360')
  } catch (err) {
    Browser.msgBox('There was an error: \\n \\n' + err);
    logFunctionRun('Open DV360', err);
  }
}
