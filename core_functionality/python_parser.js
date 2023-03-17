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
 * Parses a JSON object into a simple Python script that is compatible with
 * DV360 Custom Bidding
 * @param {[condition]} conditions Array of weight and expression dictionaries
 * @return {string}
 */
function convertToPythonScript(conditions) {
  let finalScript = '';
  let aggregationMethod = AGGREGATION_METHOD;
  let expressionsObj = conditions;
  let expressionWeightString = '';
  for (let criteria of expressionsObj) {
    let expression = Object.keys(criteria)[0];
    let weight = Object.values(criteria)[0];
    expressionWeightString += `([${expression}], ${weight}),\\n`;
  }
  finalScript +=
      `return ${aggregationMethod} ([ \\n${expressionWeightString}
      #Created with CB Script Builder \\n])`;
  return finalScript;
}
