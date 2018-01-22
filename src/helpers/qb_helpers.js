var records =[

    { 7: undefined, 8: undefined, 9: "Custom Heading", 12: undefined, 15: "MCF UI Test", 16: undefined, 17: 1816, 18: "MCF Main Test", 19: "bjajpvfwq", rid: 8 },

    { 7: "AE-Floor Remediation Notes", 8: 2255, 9: "Notes", 12: "Floor Remediation Notes", 15: undefined, 16: "Some help text for floor remediation.", 17: 1816, 18: "MCF Main Test", 19: "bjajpvfwq", rid: 6 },

    { 7: "AE-Contract Issued", 8: 1764, 9: "Date", 12: "Contract Issued", 15: undefined, 16: "This is some help text for Contract Issued field.", 17: 1816, 18: "MCF Main Test", 19: "bjajpvfwq", rid: 7 }
];

var fieldValues = {
 
}

associateFldValuesToFldRecords(fieldValues, records, 8);



/**
 * Pass an array of records from fields list table, returns the clist to query for in the project.
 * @param {string} fieldFid - From fields list table, the fid of the fid of the field in projects table (8)
 * @param {array} records - array of records from query from QB.
 * @return {string} - returns the clist
 */
 export function getClist( fieldFid, records ) {
    var clist = "";

    if( records.length < 1 ) return false;

    records.forEach(record => {
        if( clist ) {
            clist += "." + record[fieldFid];
        } else {
            clist += record[fieldFid];
        }
    });

    return clist;

}//end getClist


/**
 * In the UI fields table, there are field types that are used for custom text and custom header - these aren't associated with a field in QB.  This filters those records out.
 * @param {array} records - array of records from QB UI Fields Table
 * @param {integer} fieldTypeFid - This is the field type fid in the User Interface Table (9)
 * @return {array} - Array of records that aren't a fitlered field type
 */
 export function getClistRecords( records, fieldTypeFid ) {

    if (records.length < 1) return false;

    //field types to filter
    var filterFieldTypes = [
        "Custom Text",
        "Custom Heading"
    ];
    //filter records for "Custom Header" and "Custom Text" field types as they don't contain fid's
    return records.filter(function (record) {
        return filterFieldTypes.indexOf( record[fieldTypeFid] ) < 0;
    });
}


/**
 * Associates the UI Field Records with the QB table record values for those fields.
 * @param {object} fieldValues - The values returned from Query to Table Record of interest (just the object.
 * @param {array} userInterfaceFieldRecords - UI Field Records returned from QB.
 * @param {interger} fieldFid - Fid of the QB field in Question (8)
 * @return - returns updated array of field records with field values.
 */
export function associateFldValuesToFldRecords(fieldValues, userInterfaceFieldRecords, fieldFid ) {
    var updatedUserInterfaceFields = [];
    var length = userInterfaceFieldRecords.length;
    var updatedRecord = null;


    for (var fid in fieldValues) {
        //don't iterate over the rid key
        if (fid === 'rid') break;

        if (fieldValues.hasOwnProperty(fid)) {
            
            
            //value of field
            var fieldValue = fieldValues[fid];
            for( let i = 0; i < length; i++ ) {                
                
                if (userInterfaceFieldRecords[i][fieldFid] == fid ) {
                    updatedRecord = userInterfaceFieldRecords[i];
                    updatedRecord.value = fieldValue;
                    userInterfaceFieldRecords[i] = updatedRecord;                  
                    
                    continue;
                }
            }
        }
    }

    

    return userInterfaceFieldRecords;
}



