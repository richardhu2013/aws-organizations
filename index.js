const AWS = require('aws-sdk');
const organizations = require('./lib/organizations')();
const csv = require('./lib/csv')();
const s3 = require('./lib/s3')();
// exports.handler = async function(event, context) {
const main = async function(event, context) {
    try{
        let roots = await organizations.listRoots();
        let parentPath = '/' + roots[0].Name;
        const ROOT_ID = roots[0].Id;

        let [ allAccounts, NextToken ] = await organizations.listAccounts();
        while(NextToken) {
            let [ pageAccounts, pageNextToken ] = await organizations.listAccounts(NextToken);
            allAccounts = allAccounts.concat(pageAccounts)
            NextToken = pageNextToken;
        }
        console.log('Total account numer', allAccounts.length)
        // Get OUs
        let rootOus = await organizations.listChildren(ROOT_ID, 'ORGANIZATIONAL_UNIT')
        // Get accounts
        let rootAccounts = await organizations.listChildren(ROOT_ID, 'ACCOUNT')

        console.log('root accounts', rootAccounts)
        rootOus.forEach(element=> {
            element.Path = parentPath;
        })
        let accountIds = [];
        rootAccounts.forEach(element => {
            accountIds.push(element.Id);
        });

        allAccounts.forEach(element=>{
            // element.path='I am a test path'
            if(accountIds.indexOf(element.Id) > -1){
                element.Path = parentPath;
            }
        })
        let remainingOus = rootOus;
        while (remainingOus.length > 0) {
            firstOu = remainingOus.shift();
            // Get OUs beneath it
            let childrenOus = await organizations.listChildren(firstOu.Id, 'ORGANIZATIONAL_UNIT')
            // Append to exist queue
            newOus = remainingOus.concat(childrenOus)
            remainingOus = newOus;

            firstOuDetails = await organizations.describeOrganizationUnit(firstOu.Id)
            // console.log('OuDetails:', firstOuDetails)
            // Construct current path
            parentPath = firstOu.Path + '/' + firstOuDetails.Name;

            // Set children OUs path
            childrenOus.forEach(el => {
                el.Path = parentPath
            })
            // Get Accounts immediately under it
            let ouAccounts = await organizations.listChildren(firstOu.Id, 'ACCOUNT')
            let ouAccountIds = [];
            ouAccounts.forEach(element => {
                ouAccountIds.push(element.Id);
            });

            allAccounts.forEach(element=>{
                if(ouAccountIds.indexOf(element.Id) > -1){
                    element.Path = parentPath;
                }
            })
        }
        console.log('allAccounts',allAccounts)
        csv.writeCsv(allAccounts)

    }catch(err) {
        console.log(err)
        return err;
    }
}; 

main();