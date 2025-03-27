// this is a generic mock data for custom queries where if the query is updated to any text
export const genericMockData = [
  {
    id: 1,
    result: "Snowflake data warehouse ingestion completed",
    status: "Success",
    platform: "Snowflake",
    dataSource: "S3",
  },
  {
    id: 2,
    result: "Databricks Spark job processed analytics data",
    status: "Success",
    platform: "Databricks",
    dataSource: "Kafka",
  },
  {
    id: 3,
    result: "Atlan metadata catalog updated for governance",
    status: "Success",
    platform: "Atlan",
    dataSource: "Snowflake",
  },
  {
    id: 4,
    result: "Snowflake query execution for reporting",
    status: "Failed",
    platform: "Snowflake",
    dataSource: "Internal",
  },
  {
    id: 5,
    result: "Databricks ML model training run",
    value: 180,
    status: "Running",
    platform: "Databricks",
    dataSource: "Azure Blob",
  },
];
