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
-Login page now has colors and it is aligned center. I also made the header pink and centered. Made the footer pink and centered as well. 
- [x] **Navigation elements** - All navigation buttons are pink with black text and a border radius
- [x] **Responsive to window resizing** - My app looks great on all window sizes and devices
- [x] **Application elements** - Used good contrast and whitespace
- [x] **Application text content** - Consistent fonts
- [x] **Application images** - Still don't have images and so no styling here. 😔

