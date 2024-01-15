const flashcardApp = {
    contentArray: [],
  
    init: function () {
      this.loadFlashcards();
      this.setupEventListeners();
    },
  
    loadFlashcards: function () {
      this.contentArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
      this.contentArray.forEach(this.flashcardMaker.bind(this));
    },
  
    flashcardMaker: function (text, delThisIndex) {
      const flashcard = document.createElement("div");
      const question = document.createElement('h2');
      const answer = document.createElement('h2');
      const del = document.createElement('button');
      const edit = document.createElement('button');
  
      flashcard.className = 'flashcard';
  
      question.setAttribute("style", "border-top:1px solid black; padding: 15px; margin-top:30px");
      question.textContent = text.my_question;
  
      answer.setAttribute("style", "text-align:center; display:none; color:red");
      answer.textContent = text.my_answer;
  
      del.textContent = "Delete";
      del.className = "delete-card";
      del.addEventListener("click", () => {
        this.deleteFlashcard(delThisIndex);
      });
  
      edit.textContent = "Edit";
      edit.className = "edit-card";
      edit.addEventListener("click", () => {
        this.editFlashcard(delThisIndex);
      });
  
      flashcard.appendChild(question);
      flashcard.appendChild(answer);
      flashcard.appendChild(del);
      flashcard.appendChild(edit);
  
      flashcard.addEventListener("click", () => {
        if (answer.style.display == "none")
          answer.style.display = "block";
        else
          answer.style.display = "none";
      });
  
      document.querySelector("#flashcards").appendChild(flashcard);
    },
  
    addFlashcard: function () {
      const question = document.querySelector("#question");
      const answer = document.querySelector("#answer");
  
      let flashcard_info = {
        'my_question': question.value,
        'my_answer': answer.value
      };
  
      this.contentArray.push(flashcard_info);
      localStorage.setItem('items', JSON.stringify(this.contentArray));
      this.flashcardMaker(this.contentArray[this.contentArray.length - 1], this.contentArray.length - 1);
      question.value = "";
      answer.value = "";
    },
  
    deleteFlashcard: function (delThisIndex) {
      this.contentArray.splice(delThisIndex, 1);
      localStorage.setItem('items', JSON.stringify(this.contentArray));
      window.location.reload();
    },
  
    editFlashcard: function (editThisIndex) {
      document.getElementById("create_card").style.display = "block";
      const questionInput = document.querySelector("#question");
      const answerInput = document.querySelector("#answer");
  
      // Fill fields with existing values
      questionInput.value = this.contentArray[editThisIndex].my_question;
      answerInput.value = this.contentArray[editThisIndex].my_answer;
  
      // Removes the original flashcard by hiding it
       const flashcard = document.querySelectorAll(".flashcard")[editThisIndex];
      flashcard.style.display = "hidden";
  
          // Updates flashcard info
      document.getElementById("save_card").addEventListener("click", () => {
      const updatedQuestion = questionInput.value;
      const updatedAnswer = answerInput.value;

      // Updates the info and alerts the user that theres now an empty flashcard left behind
      flashcard.querySelector("h2").textContent = updatedQuestion;
      flashcard.querySelector("h2").nextSibling.textContent = updatedAnswer;
      flashcard.style.display = "block";
      alert('Please remove blank flashcard');

      // Save the changes in the contentArray and localStorage
      this.contentArray[editThisIndex].my_question = updatedQuestion;
      this.contentArray[editThisIndex].my_answer = updatedAnswer;
      localStorage.setItem('items', JSON.stringify(this.contentArray));

      // Clear the answer and question input fields
      questionInput.value = "";
      answerInput.value = "";

  
        // Hide create card box
        document.getElementById("create_card").style.display = "none";
      });
    },
  //buttons
    setupEventListeners: function () {
      const saveCardBtn = document.getElementById("save_card");
      const deleteCardsBtn = document.getElementById("delete_cards");
      const showCardBoxBtn = document.getElementById("add_card_button");
      const closeCardBoxBtn = document.getElementById("close_card_box");
  
      saveCardBtn.addEventListener("click", this.addFlashcard.bind(this));
      deleteCardsBtn.addEventListener("click", this.deleteAllFlashcards.bind(this));
      showCardBoxBtn.addEventListener("click", this.showCardBox.bind(this));
      closeCardBoxBtn.addEventListener("click", this.closeCardBox.bind(this));
    },
  //delete ALL cards button
    deleteAllFlashcards: function () {
      localStorage.clear();
      document.getElementById('flashcards').innerHTML = '';
      this.contentArray = [];
    },
  //Currently not working
    showCardBox: function () {
      document.getElementById("create_card").style.display = "block";
    },
  //Hides input box (Create card)
    closeCardBox: function () {
      document.getElementById("create_card").style.display = "none";
    },
  };
  //Executes app after html is loaded
  document.addEventListener("DOMContentLoaded", function () {
    flashcardApp.init();
  });
  

  const flashcardContainer = document.getElementById('flashcard-container');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  
  let currentFlashcardIndex = -1;
  
  function createFlashcard(question, answer) {
    currentFlashcardIndex++;
    const card = document.createElement('div');
    card.classList.add('flashcard');
  
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
  
    const questionElement = document.createElement('h2');
    questionElement.contentEditable = true;
    questionElement.textContent = question || 'Question';
  
    const answerElement = document.createElement('p');
    answerElement.contentEditable = true;
    answerElement.textContent = answer || 'Answer';
  
    cardContent.appendChild(questionElement);
    cardContent.appendChild(answerElement);
  
    card.appendChild(cardContent);
  
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  
    card.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      card.remove();
      currentFlashcardIndex--;
      updateNavigationButtons();
    });
  
    flashcardContainer.appendChild(card);
    updateNavigationButtons();
  }
  
  function updateNavigationButtons() {
    prevButton.disabled = currentFlashcardIndex <= 0;
    nextButton.disabled = currentFlashcardIndex >= flashcardContainer.children.length - 1;
  
    const zIndexBase = 1000;
    const zIndexIncrement = 10;
  
    flashcardContainer.children.forEach((child, index) => {
      child.style.zIndex = zIndexBase - index * zIndexIncrement;
    });
  }
  
  prevButton.addEventListener('click', () => {
    if (currentFlashcardIndex > 0) {
      currentFlashcardIndex--;
      updateNavigationButtons();
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (currentFlashcardIndex < flashcardContainer.children.length - 1) {
      currentFlashcardIndex++;
      updateNavigationButtons();
    }
  });
  
  let currentCard = 0;
  
  document.getElementById('nextButton').addEventListener('click', function () {
    // Hide the current card
    document.getElementsByClassName('flashcard')[currentCard].style.display = 'none';
    // Show the following card
    currentCard++;
    if (currentCard >= document.getElementsByClassName('flashcard').length) {
      currentCard = 0;
    }
    document.getElementsByClassName('flashcard')[currentCard].style.display = 'block';
  });
  
  document.getElementById('prevButton').addEventListener('click', function () {
    // Hide the current card
    document.getElementsByClassName('flashcard')[currentCard].style.display = 'none';
    // Show the previous card
    currentCard--;
    if (currentCard < 0) {
      currentCard = document.getElementsByClassName('flashcard').length - 1;
    }
    document.getElementsByClassName('flashcard')[currentCard].style.display = 'block';
  });



