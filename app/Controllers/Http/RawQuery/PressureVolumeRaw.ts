const query = (params : string) => {
  return `SELECT
  n1.*,
  n2.pressure_value,
  n2.volume_value,
  n2.stability_value,
  devices.device_name,
  devices.location,
  sites.name
  FROM
  (SELECT DISTINCT ON (device_code) * FROM data_collection_devices where device_code IN (${params}) ORDER BY device_code, time_device DESC) n1
  INNER JOIN (SELECT DISTINCT on (device_code) * FROM pressure_volume_devices where device_code IN (${params}) ORDER BY  device_code, time_device DESC) n2
  ON n2.device_code = n1.device_code
  INNER JOIN devices ON n2.device_code = devices.device_code
  INNER JOIN sites ON sites.id = devices.site_id
  `
}

const queryDevicesLocation = (params : string) => {
  return `SELECT
  n1.*,
  n2.pressure_value,
  n2.volume_value,
  n2.stability_value,
  devices.device_name,
  devices.location,
  sites.name,
  n3.latitude,
  n3.longitude
  FROM
  (SELECT DISTINCT ON (device_code) * FROM data_collection_devices where device_code IN (${params}) ORDER BY device_code, time_device DESC) n1
  INNER JOIN (SELECT DISTINCT on (device_code) * FROM pressure_volume_devices where device_code IN (${params}) ORDER BY  device_code, time_device DESC) n2
  ON n2.device_code = n1.device_code
  INNER JOIN devices ON n2.device_code = devices.device_code
  INNER JOIN sites ON sites.id = devices.site_id
  INNER JOIN (SELECT DISTINCT on (device_code) * FROM devices_locations where device_code IN (${params}) ORDER BY  device_code, time_device DESC) n3
  ON n3.device_code = n1.device_code `
}

export {query, queryDevicesLocation}

