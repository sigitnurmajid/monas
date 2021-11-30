import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SiteUsers extends BaseSchema {
  protected tableName = 'site_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('users_id').unsigned().references('users.id')
      table.integer('site_id').unsigned().references('sites.id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
