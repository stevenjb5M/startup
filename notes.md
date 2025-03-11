#Steven's Notes


## Github Assignment
-Steps to commit and push

Run git add . 
Run git commit -m"detailed message"
Run git push

## AWS Startup
- Visit site at http://44.199.66.13
- Link to ssh instructions https://github.com/webprogramming260/.github/blob/main/profile/webServers/amazonWebServicesEc2/amazonWebServicesEc2.md
- Domian name is cardcash.click
- Use Route 53 on amazon to manage domain names
- Link to update Caddy https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md

# HTML 
-Use UI list for lists and each child can be a LI
-BR is for spaces between things
-Javascript can either be in the html page or a seperate file
-A link tag with a href can carry you from page to page
-Remember to hook up the popup buttons later when we can add javascript! 

## HTML deliverable

For this deliverable I built out the structure of my application using HTML.

- [x] **HTML pages** - 5 HTML page that represent the ability to login, view the main page, view the leaderboard, manage cards and locations.
- [x] **Links** - The login page automatically links to the main page. The main page continues from there to other pages
- [x] **Text** - Text describes important data to the user
- [x] **Images** - We have a logo on the login screen, as well as a icon on the main screen
- [x] **DB/Login** - Input box and submit button for login. The locations and cards will be stored on the database
- [x] **WebSocket** - The top 3 location that people buy at will be displayed on the leaderboard

## CSS Notes
-Animations can be made using keyframes. @keyframes fly-from-left {
  0% {
    transform: translateX(-200%);
  }
  100% {
    transform: translateX(0%);
  }
}
-I learned from the simon project that you want to use a main.css for all of the pages that will include basic font and colors, and then each page has it's own css page as needed. 
-# is used for an id, and . is used for a class. 
-vh is for view height and will take up a percentage. 
-em is a font sizing that will scale with the screen size

## CSS deliverable

For this deliverable I properly styled the application into its final appearance.

- [x] **Header, footer, and main content body** added main.css to every page. 
-Login page now has colors and it is aligned center. I also made the header pink and centered. Made the footer pink and centered as well. The main content of the main page has been styled. 
- [x] **Navigation elements** - All navigation buttons are pink with black text and a border radius. The navigation menu is on the bottom of the main page. 
- [x] **Responsive to window resizing** - My app looks great on all window sizes and devices. It should scale automatically. 
- [x] **Application elements** - Used good contrast and whitespace
- [x] **Application text content** - Consistent fonts. 
- [x] **Application images** - Navigation buttons have icons that are svgs. 

## React Phase one
-This was a great overview of react
-It is very similar to Angular which I use at work
-I like it better since everything is on the same page. It is very clean. I'd like to see how to looks in a complex project. 


## React Phase two
-React useEffect is used for component lifecycle events
-React useState is used for reactive parts of each component
-You can use {object} inside the html to show objects
-Overall, I really like the idea of React. It is much easier when everything is on the same page. It makes it easier to understand. 

## Service
-This was my favorite unit by far. I have always had an interest in backend
-Use Fetch to call apis
-Api urls can be the same as long us you use different put/get/push etc
-Async and await can be used to not slow down the app while you make an api call