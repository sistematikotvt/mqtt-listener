const { sql, poolPromise } = require('./db.js');

const insertData = async(data) => {
	const pool = await poolPromise
	const rs = await pool.request()
				.input('data', sql.NVARCHAR, data)
				.output('result', sql.BIT)
				.execute('InsertFiliationCoreData').then(result => {
					console.dir(result.output.result);
					return result.output.result
				}).catch(err => {
					console.log('error', err) 
				});	
		 
	
}

module.exports = {
  insertData
}

