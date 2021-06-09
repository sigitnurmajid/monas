import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersDevices extends BaseSchema {
  protected tableName = 'users_devices'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users_telegrams.id').onDelete('CASCADE')
      table.integer('device_id').unsigned().references('devices.id').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
