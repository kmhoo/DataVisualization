setwd('/Users/kaileyhoo/Documents/MSAN/Module 4/MSAN622/DataVisualization/homework/hw4/')
library(ggplot2)

movies = movies

# exclude all that do not have a MPAA rating and budget
sub = movies[movies$mpaa!="",]
sub = sub[!is.na(sub$budget),]

# exclude title, budget, r1-r10
sub = sub [, -c(7:16)]

# write.csv
write.csv(sub, "movies.csv", row.names=FALSE)
