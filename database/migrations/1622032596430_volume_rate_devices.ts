import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VolumeRateDevices extends BaseSchema {
  protected tableName = 'volume_rate_devices'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('device_code').notNullable().references('devices.device_code')
      table.float('volume_rate_value')
      table.string('tank_code').notNullable()
      table.dateTime('time_device')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
