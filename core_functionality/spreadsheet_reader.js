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
 * @OnlyCurrentDoc
 */

/** Global Variables */
const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet = ss.getActiveSheet();

/** Spreadsheet Layout */
const globalInputsColumn = 2;
const partnerIdRow = 2
const advertiserIdRow = partnerIdRow + 1;
const aggregationModelRow = partnerIdRow + 2;
const firstConditionRow = 8;
const weightingColumn = 2;
const conditionStartColumn = 4;
const clauseWidth = 6;

/** Create constants for User Input Values */
const PARTNER_ID =
    sheet.getRange(partnerIdRow, globalInputsColumn).getDisplayValue();
const ADVERTISER_ID =
    sheet.getRange(advertiserIdRow, globalInputsColumn).getDisplayValue();
const AGGREGATION_METHOD =
    sheet.getRange(aggregationModelRow, globalInputsColumn).getDisplayValue();


/**
 * A dictionary object to store the conditions and weights
 * @typedef {Object.<string, string>}  condition
 * @property {string} Expression The logical expression used as a condition
 * @property {string} Weight The weight assigned to the condition
 */


/**
 * Creates an array of dictionaries with weight as the value and the boolean
 * expression as the key SAMPLE OUTPUT:
 * [{ 'active_view_viewed and time_on_screen_seconds>10 and
 * creative_height>300': '100' }, { 'active_view_viewed and
 * creative_height>300': '70' }, { 'active_view_viewed and
 * time_on_screen_seconds>10': '40' }]
 * @return {[condition]} The array of weight and expression dictionaries
 */
function getConditions() {
  let conditionRow = firstConditionRow;
  let weight =
      sheet.getRange(firstConditionRow, weightingColumn).getDisplayValue();
  if (weight == '') {
    return []
  };
  let conditions = [];
  while (weight != '') {
    expression = constructExpression(conditionRow);
    dict = {};
    dict[expression] = weight;
    conditions.push(dict);
    conditionRow += 1;
    weight = sheet.getRange(conditionRow, weightingColumn).getDisplayValue();
  }
  return conditions;
}

/**
 * Creates a condition string that evaluates to a boolean expression for each
 * row of the spreadsheet
 * SAMPLE INPUT (Brackets used to represent cells):
 * [active_view_viewed] [==] [TRUE] []	[AND] [] [creative_height] [>] [300]
 * SAMPLE OUTPUT: 'active_view_viewed and creative_height>300'
 * @param {number} rowNumber The number of the row from which the boolean
 *     expression is built
 * @return {string}
 */
function constructExpression(rowNumber) {
  let expression = '';
  let conditionColumn = conditionStartColumn;
  let variable = sheet.getRange(rowNumber, conditionColumn).getDisplayValue();
  /**Checks if there is another clause in the row to be added to final
   * expression */
  while (variable != '') {
    let operator =
        sheet.getRange(rowNumber, conditionColumn + 1).getDisplayValue();
    let value =
        sheet.getRange(rowNumber, conditionColumn + 2).getDisplayValue();
    /** Adds a clause to the expression */
    clause = constructClause(variable, operator, value);
    if (clause == '') {
      Browser.msgBox(
          `One of your clauses was missing an input and therefore invalid. 
          Please check row number ${
              rowNumber} and correct the error before retrying.`);
      return;
    }
    expression += clause;
    /**Moves to the next possible instance of a clause and redefines "variable"
     */
    conditionColumn += clauseWidth;
    variable = sheet.getRange(rowNumber, conditionColumn).getDisplayValue();
    /**Adds a connector only if there is an additional clause coming after */
    if (variable != '') {
      let connector =
          sheet.getRange(rowNumber, conditionColumn - 2).getDisplayValue();
      connector = connector.toLowerCase();
      expression += (' ' + connector + ' ');
    }
  }
  return expression;
}

/**
 * Constructs a single criteria clause and checks for incorrectly empty values
 * @param {string} variable The DV360 variable we are evaluating against a
 *     criteria (e.g. creative_height)
 * @param {string} operator The operator used to evaluate the criteria (e.g. ==
 *     or >)
 * @param {string} value The criteria value (in most cases this is either a
 *     boolean or an integer stored as a string - e.g. "True" or "300")
 * @return {string}
 */
function constructClause(variable, operator, value) {
  let clause = '';
  /** For simplicity, "variable == True" is simplified to just "variable" */
  if (value.toLowerCase() == 'true') {
    clause = variable;
  } else if (value.toLowerCase() == 'false') {
    /** Ensures that any capitalization of False is converted to proper case */
    value = 'False';
    clause = variable + '==' + value;
  } else {
    if (operator == '' || value == '') {
      return '';
    }
    clause = variable + operator + value;
  }
  return clause;
}
