seat = as.data.frame(Seatbelts)

years = c(1969:1984)
months = c("January", "February", "March", "April", 
           "May", "June", "July", "August", 
           "September", "October", "November", "December")

# add in months
for (i in 1:length(seat$law)) { 
  if (i%%12 == 0) {
    seat[i,"Month"] = months[12]
  } else{ 
    seat[i,"Month"] = months[i%%12]
  }
}

# add in year
for (i in 1:length(seat$law)) {
  seat[i,"Year"] = years[floor((11+i)/12)] 
}

# combine month and year
seat$MonthYear = paste(substring(seat$Month,1,3),seat$Year, sep="-")

# reorder columns
seat = seat[,c(10,9,11,1,2,3,4,5,6,7,8)]
write.csv(seat, "seatbelts.csv", row.names=FALSE)

# subset to only 3 columns
chart1 = seat[,c("MonthYear", "drivers", "front", "rear")]
colnames(chart1)[1] = "date"
write.csv(chart1, "seatbelt_chart1.csv", row.names=FALSE)
