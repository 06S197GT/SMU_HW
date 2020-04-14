# read in the data

# calculate total months (iterate counter in row loop?)

# Modules

import csv
import os
import numpy as np

# Set path for file
csvpath = os.path.join("C:/Users/DanMona/Desktop/smu-dal-data-pt-03-2020-u-c/02-Homework/03-Python/Instructions/PyBank/Resources/budget_data.csv")

# counter for months
totalMonths = 0

# total profit
totalProfit = 0

# change list
profitChanges = []
perMonth = []
lastProfit = 0
currProfit = 0

# rowCount
rowCount = 0

# Open the CSV
with open(csvpath) as csvfile:
    csvreader = csv.reader(csvfile, delimiter=",")

    csv_header = next(csvreader)
    #print(f"CSV Header: {csv_header}")

    #Loop through rows
    for row in csvreader:
        #print(row)
        #increment total months
        totalMonths += 1
        
        #increment profit
        totalProfit += int(row[1])
        perMonth.append(row[0])
        
        # calculate change
        if rowCount == 0:
            lastProfit  = int(row[1])
            
            
        else:
            currProfit = int(row[1])
            change = currProfit - lastProfit
            profitChanges.append(change) # add change to list
            lastProfit = currProfit

        rowCount += 1 # check to skip first profit change
        
# finished reading CSV

largestProfit = max(profitChanges)
largestDecrease = min(profitChanges)
print((row[0],largestProfit))
print((row[0],largestDecrease))

averageChange = sum(profitChanges) / len(profitChanges)
greatestDecrease = min(profitChanges)
greatestIncrease = max(profitChanges)

print("Financial Analysis")
print(f"Total Months: {totalMonths}")
print(f"Total Profit: ${round(totalProfit,2)}")
print(f"Average Change: ${round(averageChange,2)}")
print(f"Greatest Increase in Profits:{largestProfit}")
print(f"Greatest Decrease in Profits:{largestDecrease}")

export_path = "C:/Users/DanMona/Desktop/SMU_Homework/SMU Assignments/Unit_03_Python/PyBank/main.txt"

with open(export_path,'w') as writer:
    
    Total_writer = csv.writer(writer)

    Total_writer.writerow(["Financial Analysis"])
    Total_writer.writerow([f"Total Months: {totalMonths}"])
    Total_writer.writerow([f"Total Profit: ${round(totalProfit,2)}"])
    Total_writer.writerow([f"Average Change: ${round(averageChange,2)}"])
    Total_writer.writerow([f"Greatest Increase in Profits:{largestProfit}"])
    Total_writer.writerow([f"Greatest Decrease in Profits:{largestDecrease}"])