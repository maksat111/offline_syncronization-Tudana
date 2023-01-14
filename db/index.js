const Pool = require('pg').Pool;


const pool = new Pool({
  user: process.env.USER || 'postgres',
  host: process.env.HOST || 'localhost',
  database: process.env.DATABASE || 'DB',
  password: process.env.PASSWORD || 'Server123456',
  port: process.env.DATABASE_PORT || '5432'
});

module.exports = {
  async query(text, params) {
    const res = await pool.query(text, params)
    return res
  },
   async queryTransaction(query_list){
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()
    try {
      await client.query('BEGIN');
      let response = [];
      for (const query of query_list) {
        const {rows} = await client.query(query.queryText, query.params);
        response = response.concat(rows);
      }
      await client.query('COMMIT');
      return response;
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
}

