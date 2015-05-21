setwd("/Users/kaileyhoo/Documents/MSAN/Module4/MSAN622/DataVisualization/project/dataset/")

data <- read.csv("winequality.csv")
# data <- data[sort(as.numeric(data$quality)),]
q1.3 <- data[data$quality==1 | data$quality==2 | data$quality==3,]
q4 <- data[data$quality==4, ]
q5 <- data[data$quality==5, ]
q6 <- data[data$quality==6, ]
q7 <- data[data$quality==7, ]
q8.10 <- data[data$quality==8 | data$quality==9 | data$quality==10, ]

s4 <- q4[sample(nrow(q4), length(q4$quality)/3, replace=FALSE),]
s5 <- q5[sample(nrow(q5), length(q5$quality)/5, replace=FALSE),]
s6 <- q6[sample(nrow(q6), length(q6$quality)/5, replace=FALSE),]
s7 <- q7[sample(nrow(q7), length(q7$quality)/4, replace=FALSE),]
s8.10 <- q8.10[sample(nrow(q8.10), length(q8.10$quality)/3, replace=FALSE),]

data2 = rbind(q1.3, s4, s5, s6, s7, s8.10)
data2 = data2[,c(13, 12, 1:11)]

write.csv(data2, "winequality-subset.csv", row.names=FALSE)
