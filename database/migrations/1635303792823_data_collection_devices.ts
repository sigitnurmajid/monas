import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DataCollectionDevices extends BaseSchema {
  protected tableName = 'data_collection_devices'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('device_code').notNullable().references('devices.device_code')
      table.float('temperature')
      table.float('solar_exposure')
      table.float('humidity')
      table.float('battery_level')
      table.string('status')
      table.string('firmware_version')
      table.string('device_type')
      table.float('memory_usage')
      table.float('battery_voltage')
      table.float('battery_current')
      table.float('solar_voltage')
      table.float('solar_current')
      table.dateTime('time_device')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
