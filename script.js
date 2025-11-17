$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.
    
    // Called function to update the name, happiness, and weight of our pet in our HTML
    checkAndUpdatePetInfoInHtml();
  
    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.sleep-button').click(clickedSleepButton);
  

  
    
  })
  
    // Add a variable "pet_info" equal to a object with the name (string), weight (number), and happiness (number) of your pet
    var pet_info = {name:"Raya", weight: 20, happiness:10, energy:5};

    // Visual notification after each button press
    function statusUpdate(message) {
      const statusEl = document.querySelector('.status');
      if (statusEl) {
        statusEl.textContent = message;
        // Fade out message after 2 seconds
        statusEl.style.opacity = 1;
        setTimeout(() => {
          statusEl.style.opacity = 0;
        }, 2000);
      }
    }

    // Using .addClass() to show emotion state (happy, sad)
    function updateMood() {
      const petImg = $(".pet-image");
      petImg.removeClass("happy sad");

      if (pet_info.happiness >= 40) petImg.addClass("happy");
      else if (pet_info.happiness <= 5) petImg.addClass("sad");
    }

    // -------- ACTIONS --------

    function clickedTreatButton() {
      // Checks if Raya is too (hungry, tired, or sad) to play
      if (!canPerformAction("eat a treat")) return;

      // Setting a weight limit before Raya gets overfed
      const weightLimit = 40;

      // Normal boost when Raya is within a healthy weight
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
      // Checks if Raya is too tired or hungry to play
      if (!canPerformAction("play", { energy: true, weight: true })) return;

      pet_info.happiness += 5;
      pet_info.weight -= 2;
      pet_info.energy -= 3;

      checkAndUpdatePetInfoInHtml();
      statusUpdate(`${pet_info.name} had fun playing! 🐾`);
    }
    
    function clickedExerciseButton() {
      // Checks if Raya is too tired or hungry to play
      if (!canPerformAction("exercise", { energy: true, weight: true })) return;

      pet_info.happiness -= 5;
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

    // Check if the Raya can perform an action depending on stats
    function canPerformAction(actionName, req = { energy: false, weight: false, happiness: false }) {
      const { energy, weight, happiness } = req;

      if (energy && pet_info.energy <= 0) {
        statusUpdate(`${pet_info.name} is too tired to ${actionName}. 😴`);
        return false;
      }
      if (weight && pet_info.weight <= 0) {
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

    // Visually flag depleted stats
    function highlightLowStats() {
      $(".weight, .happiness, .energy").removeClass("low-stat");
      if (pet_info.weight <= 0) $(".weight").addClass("low-stat");
      if (pet_info.happiness <= 0) $(".happiness").addClass("low-stat");
      if (pet_info.energy <= 0) $(".energy").addClass("low-stat");
    }




  