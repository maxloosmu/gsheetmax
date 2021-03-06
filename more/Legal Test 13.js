function onEdit(e) {
  // respond to special inputs
  let c = e.range;
  let cvalue = e.value;
  let sheet = SpreadsheetApp.getActiveSheet();
  parseWords(c, cvalue);
}
function testEdit() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let c = sheet.getRange('A2');
  let cvalue = c.getValue();
  let summary = "";
  parseWords(c, cvalue, summary);
}

function parseWords(c, cvalue, summary) {
  // Logger.log("parseWords");
  if (cvalue=="IF") {
    return processIf(c, summary);
  }
}

function getNextCell(cell) {
  // Logger.log("getNextCell");
  let nextCell;
  let nextCValue = "";
  let cellCol = 1;
  let endParse = false;
  // Logger.log("cell.getColumnIndex() = " + cell.getColumnIndex());
  let columnLimit = 1 - cell.getColumnIndex();
  // Logger.log("columnLimit = " + columnLimit);
  do {
    nextCell = cell.offset(1,cellCol);
    nextCValue = nextCell.getValue();
    if (nextCValue=="IF") {
      // Logger.log("nextCValue = " + nextCValue);
      break;
    }
    cellCol -= 1;
  } while (cellCol >= columnLimit)
  if (!nextCell.getValue()) {
    endParse = true;
    Logger.log("endParse = " + endParse);
  }
  return [nextCell, endParse];
}

function processIf(cell, summary) {
  Logger.log("processIf row = " + cell.getRowIndex());
  // Log information about the data validation rule for cell A1.
  let topLeft = cell.offset(-1,0);
  let rightOfIf = cell.offset(0,1);
  let boxRightOfIf = 
    rightOfIf.getDataValidation().getCriteriaType();
  if (boxRightOfIf=="CHECKBOX") {
    summary = summary + "(" + rightOfIf.getValue();
    Logger.log("start parse " + summary);
    [nextCell, endParse] = getNextCell(cell);
    if (!endParse) { 
      summary = summary
        + parseWords(nextCell, nextCell.getValue(), summary) + ")";
      Logger.log("not endparse " + summary);
    } else {
      summary = summary + ")";
      Logger.log("endparse " + summary);
    }
  }
  Logger.log("the end " + summary);
  return summary;
}

function processAnd(cell){
}

function testRowColStarts() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let c = sheet.getRange('A1');
  let d = sheet.getRange('A1:Z100').getCell(2,2);
  Logger.log("c.rowStart = " + c.getRowIndex());
  Logger.log("c.getColumnIndex = " + c.getColumnIndex());
  Logger.log("d.rowStart = " + d.getRowIndex());
  Logger.log("d.getColumnIndex = " + d.getColumnIndex());
}

function testoffsets() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let c = sheet.getRange('A2');
  Logger.log("c.getValue() = " + c.getValue());
  Logger.log("c.offset(1,1).getValue() = " 
    + c.offset(1,1).getValue());
  Logger.log("c.getValue() = " + c.getValue());
}

