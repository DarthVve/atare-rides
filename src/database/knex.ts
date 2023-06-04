export const knex = require('knex')({
  client: process.env.DB_DIALECT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
  },
  debug: true
});

async function DataBaseInitialization() {
  await knex.schema.hasTable('passengers').then(async function (exists: unknown) {
    if (!exists) {
      await knex.schema
        .createTable('passengers', (table: { integer: (arg0: string) => number; increments: (arg0: string) => void; string: (arg0: string) => void; boolean: (arg0: string) => boolean; }) => {
          table.increments('id');
          table.string('firstname');
          table.string('lastname');
          table.string('email');
          table.string('phone');
          table.string('home_address');
          table.string('work_address');
          table.boolean('verified');
          table.integer('wallet');
          table.string('password');
        })
        .createTable('drivers', (table: { integer: (arg0: string) => number; increments: (arg0: string) => void; string: (arg0: string) => void; boolean: (arg0: string) => boolean; }) => {
          table.increments('id');
          table.string('firstname');
          table.string('lastname');
          table.string('email');
          table.string('phone');
          table.string('home_address');
          table.boolean('verified');
          table.integer('wallet');
          table.string('password');
        })
        .createTable('trips', (table: { increments: (arg0: string) => void; string: (arg0: string) => void; integer: (arg0: string) => { (): any; new(): any; unsigned: { (): { (): any; new(): any; references: { (arg0: string): void; new(): any; }; }; new(): any; }; }; json: (arg0: string) => void; }) => {
          table.increments('id');
          table
            .integer('driver')
            .unsigned()
            .references('drivers.id');
          table
            .integer('passenger')
            .unsigned()
            .references('passengers.id');
          table.json('location');
          table.json('destination');
          table.json('fair');
          table.integer('distance');
        })
        .createTable('payments', (table: { increments: (arg0: string) => void; string: (arg0: string) => void; integer: (arg0: string) => { (): any; new(): any; unsigned: { (): { (): any; new(): any; references: { (arg0: string): void; new(): any; }; }; new(): any; }; }; enum: (arg0: string, arg1: string[]) => void; }) => {
          table.increments('id');
          table.enum('type', ['wallet credit', 'wallet debit', 'withdrawal'])
          table.integer('amount');
          table.string('beneficiary');
          table.enum('status', ['pending', 'success', 'failed']);
          table.string('time');
          table.string('date');
          table.string('reference');
        })
    }
  })
};

export default DataBaseInitialization;
