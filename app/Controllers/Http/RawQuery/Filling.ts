const queryGetLastFillingData = () => {
  return `SELECT
    z.Dates AS "start_date",
    z.finishDate AS "finish_date",
    z.levelAwal AS "initial_level_pressure",
    z.levelAkhir AS "final_level_pressure",
    (z.levelAkhir-z.levelAwal) AS "total_level_pressure",
    z.volumeAwal AS "initial_level_volume",
    z.volumeAkhir AS "final_level_volume",
    (z.volumeAkhir-z.volumeAwal) AS "total_level_volume",
    z.beratAwal AS "initial_level_weight",
    z.beratAkhir AS "final_level_weight",
    (z.beratAkhir-z.beratAwal) AS "total_level_weight"
  FROM(SELECT
        x.time_device AS Dates,
        LEAD(x.time_device ,1) OVER (ORDER BY x.time_device ASC) AS finishDate,
        x.filling_state,
        x.pressure_value AS levelAwal,
        LEAD(x.pressure_value,1) OVER (ORDER BY x.time_device ASC) AS levelAkhir,
        x.volume_value AS volumeAwal,
        LEAD(x.volume_value,1) OVER (ORDER BY x.time_device ASC) AS volumeAkhir,
        x.weight_value AS beratAwal,
        LEAD(x.weight_value,1) OVER (ORDER BY x.time_device ASC) AS beratAkhir,
        x.device_code
      FROM fillings as x
      ORDER BY x.time_device DESC) AS z
  WHERE z.device_code = :device_code AND z.filling_state = 'STARTED'
  LIMIT 1`
}

const queryGetFillingData = () => {
  return `SELECT
  z.Dates AS "start_date",
  z.finishDate AS "finish_date",
  z.levelAwal AS "initial_level_pressure",
  z.levelAkhir AS "final_level_pressure",
  (z.levelAkhir-z.levelAwal) AS "total_level_pressure",
  z.volumeAwal AS "initial_level_volume",
  z.volumeAkhir AS "final_level_volume",
  (z.volumeAkhir-z.volumeAwal) AS "total_level_volume",
  z.beratAwal AS "initial_level_weight",
  z.beratAkhir AS "final_level_weight",
  (z.beratAkhir-z.beratAwal) AS "total_level_weight"
  FROM(SELECT
      x.time_device AS Dates,
      LEAD(x.time_device ,1) OVER (ORDER BY x.time_device ASC) AS finishDate,
      x.filling_state,
      x.pressure_value AS levelAwal,
      LEAD(x.pressure_value,1) OVER (ORDER BY x.time_device ASC) AS levelAkhir,
      x.volume_value AS volumeAwal,
      LEAD(x.volume_value,1) OVER (ORDER BY x.time_device ASC) AS volumeAkhir,
      x.weight_value AS beratAwal,
      LEAD(x.weight_value,1) OVER (ORDER BY x.time_device ASC) AS beratAkhir,
      x.device_code
    FROM fillings as x
    ORDER BY x.time_device DESC) AS z
  WHERE z.device_code = :deviceCode AND z.filling_state = 'STARTED'  AND z.Dates > :startDate  AND z.Dates < :endDate`
}

const queryGetFillingFrequency = (timeZone : string) => {
  return `SELECT
  to_char(DATE_TRUNC('day',created_at AT TIME ZONE '${timeZone}'), 'DD/MM/YYYY') AS  "date",
  COUNT(id) AS "frequency"
  FROM fillings
  WHERE
    created_at BETWEEN :startDate AND :endDate AND filling_state = 'FINISHED' AND device_code = :deviceCode
  GROUP BY DATE_TRUNC('day',created_at AT TIME ZONE '${timeZone}')`
}

export {queryGetLastFillingData, queryGetFillingData, queryGetFillingFrequency}
