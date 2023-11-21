import pg from 'pg';

import * as dotenv from 'dotenv';
dotenv.config();

export class DbUtil {

    private client: pg.PoolClient | undefined;

    constructor() {
      // コネクションプールを作成
      this.connectDB();
    }

    public async connectDB() {
        const pool = new pg.Pool({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASS,
          port: 5432,
        });

        this.client = await pool.connect();
      }
    
    public async insert(prompt: string, response: string) {
        try {
          if(!this.client) {
            throw new Error('No client');
          }

          const res1 = await this.client.query('INSERT INTO conversations DEFAULT VALUES RETURNING *');

          const res2 = await this.client.query(
            'INSERT INTO textresponses (conversation_id, prompot, response, created_at) \
              VALUES ($1, $2, $3, $4)',
              [res1.rows[0].id, prompt, response, new Date()]
              );
          // console.log(res.rows[0]);
        }
        catch (err) {
          console.error(err);
        }
   }
}
