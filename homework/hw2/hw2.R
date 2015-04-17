setwd('/Users/kaileyhoo/Documents/MSAN/Module 4/MSAN622/DataVisualization/homework/')

df <- data.frame(
  state.name,
  state.abb,
  state.region,
  state.division,
  state.x77,
  row.names = NULL
)
colnames(df) <- c("name", "abb", "region", "division",
                  "population", "income", "illiteracy", 
                  "life_expectancy", "murders", "hs_grad",
                  "days_frost", "land_area")

write.csv(df, file = "state.csv", row.names = FALSE)

library(jsonlite)
json <- toJSON(df, dataframe = "rows", factor = "string", pretty = TRUE)
cat(json, file = "state.x77.json")
