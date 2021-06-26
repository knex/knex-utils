import { Knex } from 'knex'

export async function createJoinTable(knex: Knex) {
  await knex.schema.createTable('joinTable', (table) => {
    table.increments('id').primary()
    table.string('userId').notNullable()
    table.string('orgId').notNullable()
    table.string('linkType').notNullable()
    table.string('name').notNullable()
  })
}

export async function dropJoinTable(knex: Knex) {
  await knex.schema.dropTable('joinTable')
}
