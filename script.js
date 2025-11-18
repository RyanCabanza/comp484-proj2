$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.
    
    // Called function to update the name, happiness, and weight of our pet in our HTML
    checkAndUpdatePetInfoInHtml();
  
    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.sleep-button').click(clickedSleepButton);
  
    // Clicking a pet button triggers a custom event carrying the new pet
    $('.pet-switcher').on('click', '.pet-select', function () {
      const key = this.dataset.pet;              // "raya" or "spotty" or "casper"
      if (PETS[key]) {
        $(document).trigger('pet:switch', [PETS[key]]);
      }
    });
  
  })

let lastMood = null;

$(document).on('pet:switch', function (_evt, newPet) {
    // swap current pet with the provided one
    pet_info = { ...newPet };

    // update the image (no .attr(), use plain DOM to respect constraints)
    const imgEl = document.querySelector('.pet-image');
    if (imgEl && newPet.img) imgEl.src = newPet.img;

    // re-render and notify
    checkAndUpdatePetInfoInHtml();
    statusUpdate(`Switched to ${pet_info.name}! 🐶`);
  });


    const PETS = {
      raya:    { name: "Raya",  weight: 20, happiness: 10, energy: 8,
               img: "images/raya.jpg" },
      spotty:  { name: "Spotty",  weight: 15, happiness: 14, energy: 10,
               img: "images/spotty.jpg" },
      casper:  { name: "Casper",  weight: 22, happiness: 12, energy: 5,
               img: "images/casper.jpg" },
      ziggy:   { name: "Ziggy",  weight: 18, happiness: 20, energy: 15,
               img: "images/ziggy.jpg" }
    };
  
    // Add a variable "pet_info" equal to a object with the name (string), weight (number), and happiness (number) of your pet
    var pet_info = { ...PETS.raya };

    // Visual notification after each button press
    function statusUpdate(message) {
      const statusEl = document.querySelector('.status');
      if (statusEl) {
        statusEl.textContent = message;
        // Fade out message after 2 seconds
        statusEl.style.opacity = 1;
        setTimeout(() => {
          statusEl.style.opacity = 0;
        }, 2500);
      }
    }

    // Using .addClass() to show emotion state (happy, sad)
    function updateMood() {
      const petImg = $(".pet-image");
      const moodBox = $(".mood-message");
      let newMood = null;

      petImg.removeClass("happy sad");
      moodBox.removeClass("show").text("");

      if (pet_info.happiness >= 30) {
        newMood = "happy";
        petImg.addClass("happy");
      } 
      else if (pet_info.happiness <= 5) {
        newMood = "sad";
        petImg.addClass("sad");
      }

      // Show message only when the mood changes
      if (newMood && newMood !== lastMood) {
        if (newMood === "happy") {
          moodBox.text(`${pet_info.name} is feeling amazing! 😄`).addClass("happy show");
        } else if (newMood === "sad") {
          moodBox.text(`${pet_info.name} looks really down... 😢`).addClass("sad show");
        }
        setTimeout(() => moodBox.removeClass("show"), 2500);
      }

      lastMood = newMood;
    }

    // -------- ACTIONS --------

    function clickedTreatButton() {
      // Checks if Raya is too (hungry, tired, or sad) to play
      if (!canPerformAction("eat a treat")) return;

      // Setting a weight limit before Raya gets overfed
      const weightLimit = 40;

      // Normal boost when pet is within a healthy weight
      if (pet_info.weight < weightLimit) {

        pet_info.happiness += 5;
        pet_info.weight += 5;
        pet_info.energy += 3;

        statusUpdate(`${pet_info.name} loved the treat! 🍪`);
      }
      // If the pet is overfed, eating treats makes them unhappy
      else {

        pet_info.weight += 3;
        pet_info.happiness -= 4;
        pet_info.energy -= 2;

        statusUpdate(`${pet_info.name} is too full and feels sick...🤢`);

        $(".pet-image").addClass("overfed");
        setTimeout(() => $(".pet-image").removeClass("overfed"), 800);

      }
      checkAndUpdatePetInfoInHtml();
    }
    
    function clickedPlayButton() {
      // Checks if pet is too tired or hungry to play
      if (!canPerformAction("play", { energy: true, weight: true })) return;

      pet_info.happiness += 5;
      pet_info.weight -= 2;
      pet_info.energy -= 3;

      checkAndUpdatePetInfoInHtml();
      statusUpdate(`${pet_info.name} had fun playing! 🐾`);
    }
    
    function clickedExerciseButton() {
      // Checks if pet is too tired or hungry to play
      if (!canPerformAction("exercise", { energy: true, weight: true })) return;

      pet_info.happiness -= 8;
      pet_info.weight -= 5;
      pet_info.energy -= 3;

      checkAndUpdatePetInfoInHtml();
      statusUpdate(`${pet_info.name} exercised hard! 💪`);
    }

    // Adding Sleep action
    function clickedSleepButton() {
      pet_info.happiness += 1;
      pet_info.weight -= 1;
      pet_info.energy += 10;
      checkAndUpdatePetInfoInHtml();
      statusUpdate(`${pet_info.name} took a nap and regained energy! ⚡`);
      $(".pet-image").addClass("sleepy"); // Applying temporary visual for when Raya takes a nap
      setTimeout(() => $(".pet-image").removeClass("sleepy"), 1500);
    }
  
    function checkAndUpdatePetInfoInHtml() {
      checkWeightAndHappinessBeforeUpdating();  
      updatePetInfoInHtml();
      updateMood();
      highlightLowStats();
    }
    
    function checkWeightAndHappinessBeforeUpdating() {
      if (pet_info.weight < 0 ) pet_info.weight = 0;
      if (pet_info.happiness < 0) pet_info.happiness = 0;
      if (pet_info.energy < 0) pet_info.energy = 0;
    }

    // Check if pet can perform an action depending on stats
    function canPerformAction(actionName, req = { energy: false, weight: false, happiness: false }) {
      const { energy, weight, happiness } = req;

      if (energy && pet_info.energy <= 0) {
        statusUpdate(`${pet_info.name} is too tired to ${actionName}. 😴`);
        return false;
      }
      if (weight && pet_info.weight <= 5) {
        statusUpdate(`${pet_info.name} is too hungry to ${actionName}. 🍽️`);
        return false;
      }
      if (happiness && pet_info.happiness <= 0) {
        statusUpdate(`${pet_info.name} feels too sad to ${actionName}. 😢`);
        return false;
      }
      return true;
    }
    
    // Updates your HTML with the current values in your pet_info object
    function updatePetInfoInHtml() {
      $('.name').text(pet_info['name']);
      $('.weight').text(pet_info['weight']);
      $('.happiness').text(pet_info['happiness']);
      $('.energy').text(pet_info['energy']);
    }

    // Visually pulse depleted stats
    function highlightLowStats() {
      $(".weight, .happiness, .energy").removeClass("low-stat");
      if (pet_info.weight <= 5) $(".weight").addClass("low-stat");
      if (pet_info.happiness <= 0) $(".happiness").addClass("low-stat");
      if (pet_info.energy <= 0) $(".energy").addClass("low-stat");
    }




  