import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PressureVolumeDevice from 'App/Models/PressureVolumeDevice'
import { DateTime } from 'luxon'
import delay from 'delay';

export default class PressureVolumeDeviceSeeder extends BaseSeeder {
  public static developmentOnly = true
  
  public async run() {
    for (let index = 0; index < 101; index++) {
      await delay(5000)
      await PressureVolumeDevice.create({
        device_code: '12345678',
        pressure_value: (Math.random() * (23.5 - 10) + 10),
        status: this.random(Math.floor(Math.random() * 3)),
        time_device: DateTime.now(),
        volume_value: (Math.random() * (2100.7 - 1500.8) + 1500.8),
      })

    }
  }

  public random(number : number) : string | undefined{ 
    let status : string
    if (number == 0){
      return status = 'NORMAL'
    } else if ( number == 1){
      return status = 'UPPER'
    } else if ( number == 2){
      return status = 'LOWER'
    }
  }
}
