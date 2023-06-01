export const knex = require('knex')({
  client: process.env.DB_DIALECT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
  }
});

async function DB() {
  await knex.schema.hasTable('users').then(async function (exists: unknown) {
    if (!exists) {
      await knex.schema
        .createTable('users', (table: { integer: (arg0: string) => number; increments: (arg0: string) => void; string: (arg0: string) => void; }) => {
          table.increments('id');
          table.string('fullname')
          table.string('username');
          table.string('email');
          table.string('phonenumber')
          table.integer('wallet');
          table.string('password');
        })
        .createTable('deposits', (table: { increments: (arg0: string) => void; string: (arg0: string) => void; integer: (arg0: string) => { (): any; new(): any; unsigned: { (): { (): any; new(): any; references: { (arg0: string): void; new(): any; }; }; new(): any; }; }; }) => {
          table.increments('id');
          table.string('reference');
          table.string('amount');
          table.string('currency');
          table.string('status');
          table
            .integer('user_id')
            .unsigned()
            .references('users.id');
        })
        .createTable('transfers', (table: { increments: (arg0: string) => void; string: (arg0: string) => void; integer: (arg0: string) => { (): any; new(): any; unsigned: { (): { (): any; new(): any; references: { (arg0: string): void; new(): any; }; }; new(): any; }; }; }) => {
          table.increments('id');
          table.string('reference');
          table.string('amount');
          table.string('recipient');
          table.string('recipient_email');
          table.string('recipient_phone');
          table.string('status');
          table
            .integer('user_id')
            .unsigned()
            .references('users.id');
        })
        .createTable('withdrawals', (table: { increments: (arg0: string) => void; string: (arg0: string) => void; integer: (arg0: string) => { (): any; new(): any; unsigned: { (): { (): any; new(): any; references: { (arg0: string): void; new(): any; }; }; new(): any; }; }; }) => {
          table.increments('id');
          table.string('reference');
          table.string('code');
          table.string('bank');
          table.string('name');
          table.string('account_number');
          table.string('amount');
          table.string('status');
          table
            .integer('user_id')
            .unsigned()
            .references('users.id');
        })
    }
  });
}

export default DB;
