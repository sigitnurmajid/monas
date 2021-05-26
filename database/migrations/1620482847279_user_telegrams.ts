import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersTelegrams extends BaseSchema {
  protected tableName = 'users_telegrams'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('chat_id').notNullable().unique()
      table.string('token_user').references('token_user_telegrams.token').onDelete('CASCADE').notNullable()
      table.enum('role', ['maintenance', 'supplier', 'client']) // maintenance for ateri, supplier for atm, client for hospital
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
