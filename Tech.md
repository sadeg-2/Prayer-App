# Prayer App Technical requirements
    the app is a single page that allow us to select our continent and country and city to can show the payer time and have a live count down to the next prayer

## Folder Structure
- `index.html` the main structure of the app (entry point)
- `style.css` the css style of the app
- `main.js` the logic added to the app
- `utility.js` the functionality logic

## Requirements
    0. for testing usage use interface and mapping to can get data 
    1. drop down list to choose continent that will have a fix content 
        - hint how we can use it in the url 
        | Continent   | URL parameter |
        | ---------- | ------------- |
        | Africa     | `africa`      |
        | Americas   | `americas`    |
        | Asia       | `asia`        |
        | Europe     | `europe`      |
        | Oceania    | `oceania`     |
        | Antarctica | `antarctica`  |

        - after i choose the continent should save the value in variable 
        - and send request directly to fetch the country 

    2. drop down list to choose country 
        - the content of the list should be dynamic from the url based on the Selected continent
        - also save the value in variable
        - and send request to fetch the city 
    
    3. drop down list to choose the city
        - the content of the list should be dynamic from the url based on the Selected county
        - also save the value in variable
        - here send request to get the main prayer
    
    4. drop down  to can choose calculation time 
        - Method 1: University of Islamic Sciences, Karachi
        - Method 2: Islamic Society of North America (ISNA)
        - Method 3: Muslim World League
        - Method 4: Umm al-Qura University, Makkah
        - Method 5: Egyptian General Authority of Survey
        - Method 7: Institute of Geophysics, University of Tehran
        - Method 8: Shia Ithna-Ashari
        - the drop down should show the name of each one and when save in variable should save the number of it 
    
    5. render the table of 5 main prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
        - the content should be responsive design and accessible on mobile and desktop
        - the table should show the name of prayer and time of it and it will be today or tomorrow 
    
    6. toast message or custom alert to show if error happen in fetch or not cause the network error




