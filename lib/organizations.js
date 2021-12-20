// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var proxy = require('proxy-agent');
// Set the region 
AWS.config.update({region: 'us-east-1'});
var organizations = new AWS.Organizations({apiVersion: '2016-11-28'});
// Set proxy
AWS.config.update({
  httpOptions: { agent: proxy('your proxy') }
});

module.exports = () => {
  const listRoots = () => {
    var params = {
    };
    return new Promise((resolve, reject) => {
      organizations.listRoots(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          return reject(err)
        }
        else{
          return resolve(data.Roots) // successful response
        }
      });
    });
  }

  const listAccounts = (NextToken) => {
    var params = {
      MaxResults: 20
    };
    if(NextToken){
      params.NextToken = NextToken;
    }
    return new Promise((resolve, reject) => {
      organizations.listAccounts(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          return reject(err)
        }
        else {
          console.log('accounts number:', data.Accounts.length)
          if(data.NextToken != undefined){
            return resolve([data.Accounts, data.NextToken])
          }
          return resolve([data.Accounts, null])
        }
      });
    });
  }

  const listChildren = (parentId, childType) => {
    var params = {
      ChildType: childType, 
      ParentId: parentId
     };
    return new Promise((resolve, reject) =>{
      organizations.listChildren(params, function(err, data) {
          if (err) {
            console.log(err, err.stack); // an error occurred
            return reject(err)
          }
          else{
            return resolve(data.Children) // successful response
          }
        });
    });
  }

  const listParents =  (childId) => {
    var params = {
      ChildId: childId
     };
    return new Promise((resolve, reject) =>{
      organizations.listParents(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          return reject(err)
        }
        else {
          return resolve(data.Parents) // successful response
        }
      });
    });
  }
 
  const describeOrganizationUnit = (OrganizationalUnitId) =>{
    var params = {
      OrganizationalUnitId: OrganizationalUnitId
    };
    return new Promise((resolve, reject) =>{
      organizations.describeOrganizationalUnit(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          return reject(err)
        }
        else {
          return resolve(data.OrganizationalUnit) // successful response
        }
      });
    });
  }

  return {
    listAccounts,
    listChildren,
    listParents,
    listRoots,
    describeOrganizationUnit
  }
}

