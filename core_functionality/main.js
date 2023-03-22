/**
 * Copyrigh 2023 Google LLC
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
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * Opens a dialogue box with the JSON inputs formatted to be more readable to
 * non-tech users.  Triggered via the "QA Script" button in the UI.  Also
 * includes error handling and tracking.
 */
function printJSON() {
  try {
    let finalJSON = {
      'PartnerID': PARTNER_ID,
      'AdvertiserID': ADVERTISER_ID,
      'AggregationMethod': AGGREGATION_METHOD,
      'ExpressionWeightPairs': getConditions()
    };
    SpreadsheetApp.getUi().alert(
      JSON.stringify(finalJSON, null, '\u{2000}'.repeat(2)));
    logFunctionRun('Print JSON');
  } catch (err) {
    Browser.msgBox('ERROR', err.message, Browser.Buttons.OK);
    logFunctionRun('Print JSON', err);
  }
}

/**
 * Opens a dialogue box with final Custom Bidding python script which can be
 * copied to DV3 UI.  Triggered via the "Final Script to Copy" button in the UI.
 * Also includes error handling and tracking.
 */
function printScript() {
  try {
    let conditions = getConditions();
    let pythonScript = convertToPythonScript(conditions);
    logFunctionRun('Print Script');
    Browser.msgBox(pythonScript);
  } catch (err) {
    logFunctionRun('Print Script', err);
    Browser.msgBox('ERROR', err.message, Browser.Buttons.OK);
  }
}
