const queryGetTotalWeightThisDay = ( timeZone : string ) => {
  return `SELECT
    sum(x.volume_usage_value) AS "volume_used",
    sum(x.volume_usage_value/0.777) AS "weight_used"
  FROM volume_usages as x
  WHERE x.device_code = :deviceCode AND DATE_TRUNC('day',x.created_at AT TIME ZONE '${timeZone}') = DATE_TRUNC('day',CURRENT_DATE AT TIME ZONE '${timeZone}')
  GROUP BY DATE_TRUNC('day',x.created_at AT TIME ZONE '${timeZone}')
  ORDER BY DATE_TRUNC('day',x.created_at AT TIME ZONE '${timeZone}') DESC`
}

const queryGetTotalWeightThisMonth = ( timeZone : string ) => {
  return `SELECT
    sum(x.volume_usage_value) AS "volume_used",
    sum(x.volume_usage_value/0.777) AS "weight_used"
  FROM volume_usages as x
  WHERE x.device_code = :deviceCode AND DATE_TRUNC('month',x.created_at AT TIME ZONE '${timeZone}') = DATE_TRUNC('month',CURRENT_DATE AT TIME ZONE '${timeZone}')
  GROUP BY DATE_TRUNC('month',x.created_at AT TIME ZONE '${timeZone}')
  ORDER BY DATE_TRUNC('month',x.created_at AT TIME ZONE '${timeZone}') DESC`
}

const queryGetTotalWeightperDay = ( timeZone : string ) => {
  return `SELECT
	to_char(DATE_TRUNC('day',x.created_at AT TIME ZONE '${timeZone}'), 'DD/MM/YYYY') AS  "date",
    sum(x.volume_usage_value) AS "volume_used",
    sum(x.volume_usage_value/0.777) AS "weight_used"
  FROM volume_usages as x
  WHERE x.device_code = :deviceCode AND
  (x.created_at > DATE_TRUNC('day', :startDate AT TIME ZONE '${timeZone}') AND x.created_at < DATE_TRUNC('day', :endDate AT TIME ZONE '${timeZone}'))
  GROUP BY DATE_TRUNC('day',x.created_at AT TIME ZONE '${timeZone}')
  ORDER BY DATE_TRUNC('day',x.created_at AT TIME ZONE '${timeZone}') DESC`
}

const queryGetTotalWeightperMonth = ( timeZone : string ) => {
  return `SELECT
	to_char(DATE_TRUNC('month',x.created_at AT TIME ZONE '${timeZone}'), 'MONTH YYYY') AS  "date",
    sum(x.volume_usage_value) AS "volume_used",
    sum(x.volume_usage_value/0.777) AS "weight_used"
  FROM volume_usages as x
  WHERE x.device_code = :deviceCode AND
  (x.created_at > DATE_TRUNC('month', :startDate AT TIME ZONE '${timeZone}') AND x.created_at < DATE_TRUNC('month', :endDate AT TIME ZONE '${timeZone}'))
  GROUP BY DATE_TRUNC('month',x.created_at AT TIME ZONE '${timeZone}')
  ORDER BY DATE_TRUNC('month',x.created_at AT TIME ZONE '${timeZone}') DESC`
}

export { queryGetTotalWeightThisDay , queryGetTotalWeightThisMonth, queryGetTotalWeightperDay, queryGetTotalWeightperMonth}
