import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VolumeUsages extends BaseSchema {
  protected tableName = 'volume_usages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('device_code').notNullable().references('devices.device_code')
      table.float('volume_usage_value')
      table.string('tank_code')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
