const queryGetTotalWeightThisDay = ( timeZone : string ) => {
  return `SELECT
    sum(x.volume_usage_value) AS "volume_used",
    sum(x.volume_usage_value/0.777) AS "weight_used"
  FROM volume_usages as x
  WHERE x.device_code = :deviceCode
  GROUP BY DATE_TRUNC('day',x.created_at AT TIME ZONE '${timeZone}')
  ORDER BY DATE_TRUNC('day',x.created_at AT TIME ZONE '${timeZone}') DESC
  LIMIT 1`
}

const queryGetTotalWeightThisMonth = ( timeZone : string ) => {
  return `SELECT
    sum(x.volume_usage_value) AS "volume_used",
    sum(x.volume_usage_value/0.777) AS "weight_used"
  FROM volume_usages as x
  WHERE x.device_code = :deviceCode
  GROUP BY DATE_TRUNC('month',x.created_at AT TIME ZONE '${timeZone}')
  ORDER BY DATE_TRUNC('month',x.created_at AT TIME ZONE '${timeZone}') DESC
  LIMIT 1`
}

export { queryGetTotalWeightThisDay , queryGetTotalWeightThisMonth}
