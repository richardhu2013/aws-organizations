const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = () => {
    const writeCsv = (data) => {
        const csvWriter = createCsvWriter({
            path: 'out.csv',
            header: [
                {id: 'Id', title: 'Account ID'},
                {id: 'Arn', title: 'ARN'},
                {id: 'Email', title: 'Email'},
                {id: 'Status', title: 'Status'},
                {id: 'JoinedMethod', title: 'Joined method'},
                {id: 'JoinedTimestamp', title: 'Joined timestamp'},
                {id: 'Path', title: 'Path'},
            ]
        });
        csvWriter
        .writeRecords(data)
        .then(()=> console.log('The CSV file was written successfully'));
    }
    return {
        writeCsv
      }
}