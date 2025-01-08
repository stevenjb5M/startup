# Startup
Get the highest cash back wherever you shop! 

### Elevator Pitch

Cash back has been around for years, but it continues to be a major way for people to save money on expenses. 
With most people owning more than one credit card, it can be difficult and time consuming to find out which 
credit card to use when they are buying groceries, shopping online, or eating out. And when the waiter asks 
for the check, it's too late to open all of your credit card apps and see which gives the highest cash back 
at Texas Roadhouse. CashCard makes getting the most cash back a simple and easy process. The ability to easily
add your favorite places and each of your credit cards makes it easy. 

### Design

![Mock](cardcashMockUI.jpeg)

### Key Features
- Secure Login
- Add/remove credit cards with associated cash back for each location
- Add/remove locations to shop at
- Quick access to best card to use for a particular location
- Cards and locations are stored
- See a list of most popular card-location combos used worldwide

### Technologies

- HTML: 3-5 HTML pages for structure. Login, main page, and then location and card manage pages. 
- CSS: Styling that will help the user know exaclty how to use the application. Good space and colors.
- Javascript: Changes html and css when user inputs information. Makes backend calls. 
- React: Used to help build a simple view that will be very responsive to the users inputs
- Web Service: Endpoints for saving cards, saving locations, getting cards, getting locations, also one additional
 outside api call to a outside api that I haven't determined yet. 
- Authentication: Allow user to login and enter a password
- Database: store the users cards and locations. Also stores at what locations users make purchases. 
- Websocket Data: Show the most popular card-location combos on a chart. Each time a user makes a purchase at a location it 
will add this to a chart. 