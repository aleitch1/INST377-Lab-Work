/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log('fired injectHTML')
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str
  })
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutRestaurantList(list) {
  console.log('fired cut list');
  const range = [...Array(15).keys()]; 
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length -1);
    return list[index]
  })
}

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const filterDataButton = document.querySelector('#filter'); // This class name lets us target a labelled button for an event listener
  const loadDataButton = document.querySelector('#data_load'); // This class name lets us target a labelled button for an event listener
  const generateListButton = document.querySelector('#generate'); // This class name lets us target a labelled button for an event listener
  
  const loadAnimation = document.querySelector('#data_load_animation');
  loadAnimation.style.display = 'none';

  let currentList = []; // this is "scoped" to the main event function
  
  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
    console.log('Loading data'); // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form
    loadAnimation.style.display = 'inline-block';

    
    // Basic GET request - this replaces the form Action
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    // This changes the response from the GET into data we can use - an "object"
    currentList = await results.json();
    
    loadAnimation.style.display = 'none';
    console.table(currentList); 
  });

  filterDataButton.addEventListener('click', (event) => {
    console.log('clicked filterButton'); // log out clicks for easier debugging
    // this is the preferred way to handle form data in JS in 2022
    const formData = new FormData(mainForm); // and the action ACTS on the form
    const formProps = Object.fromEntries(formData); // This line turns form data into an object for easy access

    // You can also access all forms in a document by using the document.forms collection
    // But this will retrieve ALL forms, not just the one that "heard" a submit event - less good
    
    console.log(formProps); // Log out the object we're working with

    // Using the filterList function, filter the list
    const newList = filterList(currentList, formProps.resto);
    // and log out the new list
    console.log(newList);
    injectHTML(newList);

  })

  generateListButton.addEventListener('click', (event) => {
    console.log('generate new list');
    const restaurantsList = cutRestaurantList(currentList);
    console.log(restaurantsList);
    injectHTML(restaurantsList);
  })
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
