import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ThresholdDevices extends BaseSchema {
  protected tableName = 'threshold_devices'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('device_code').notNullable().references('devices.device_code').onDelete('CASCADE')
      table.float('up_limit').notNullable()
      table.float('low_limit').notNullable()
      table.float('up_limit_hostpital').notNullable()
      table.float('low_limit_hostpital').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
