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
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * Writes data to the tracking sheet based on what function was run and whether
 * or not it triggered an error
 * @param {string} functionName The name of the function being executed
 * @param {string=} error The error message
 */

function logFunctionRun(functionName, error) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Error Tracking');
  let ss_id = SpreadsheetApp.getActiveSpreadsheet().getId();
  let partner_id = PARTNER_ID;
  let adv_id = ADVERTISER_ID;
  let user = Session.getActiveUser().getEmail();
  let status = '';
  if (error == undefined) {
    error = '';
    status = 'SUCCESS';
  } else {
    error = error;
    status = 'ERROR';
  };
  ss.setSpreadsheetTimeZone(Session.getScriptTimeZone());
  let ts = new Date();
  sheet.appendRow([ts, ss_id, partner_id, adv_id, user, functionName, status, error]);
}