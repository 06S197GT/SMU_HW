# Modules
import csv

# Set path for file
csvpath = "C:/Users/DanMona/Desktop/smu-dal-data-pt-03-2020-u-c/02-Homework/03-Python/Instructions/PyPoll/Resources/election_data.csv"

#Define counters
totalVotes = 0
Khvotes = 0
Covotes = 0
Livotes = 0
Otvotes = 0


# Open the CSV
with open(csvpath) as csvfile:
    csvreader = csv.reader(csvfile, delimiter=",")

    #Skip header   
    csv_header = next(csvreader)
    #Loop through rows
    for row in csvreader:
        #Add to total vote count.
        totalVotes += 1   
        for word in row:
            
            #Add to candidates vote count.
            if word == 'Khan':
                Khvotes = Khvotes + 1    
            if word == 'Correy':
                Covotes = Covotes + 1
            if word == 'Li':
                Livotes = Livotes + 1
            if word == "O'Tooley":
                Otvotes = Otvotes + 1

#Calculate vote percentages per candidate using vote counts.            
Kh_perc = round((Khvotes / totalVotes)*100,4)
Co_perc = round((Covotes / totalVotes)*100,4)
Li_perc = round((Livotes / totalVotes)*100,4)
Ot_perc = round((Otvotes / totalVotes)*100,4)

#Print results
print("Election Results")
print(f"Total Votes: {totalVotes}")   
print(f"Khan : {Kh_perc}% ({Khvotes})") 
print(f"Correy : {Co_perc}% ({Covotes})") 
print(f"Li : {Li_perc}% ({Livotes})") 
print(f"O'Tooley : {Ot_perc}% ({Otvotes})")
print(f"Winner: Khan")        
# finished reading CSV

#Define new file and file path
export_path = "C:/Users/DanMona/Desktop/SMU_Homework/SMU Assignments/Unit_03_Python/PyPoll/main.txt"

#Open newly created file
with open(export_path,'w') as writer:
    
    #Create the writer
    Total_writer = csv.writer(writer)
    #Print results to file
    Total_writer.writerow(["Election Results"])
    Total_writer.writerow([f"Total Votes: {totalVotes}"])   
    Total_writer.writerow([f"Khan : {Kh_perc}% ({Khvotes})"]) 
    Total_writer.writerow([f"Correy : {Co_perc}% ({Covotes})"]) 
    Total_writer.writerow([f"Li : {Li_perc}% ({Livotes})"]) 
    Total_writer.writerow([f"O'Tooley : {Ot_perc}% ({Otvotes})"])
    Total_writer.writerow([f"Winner: Khan"]) 

    