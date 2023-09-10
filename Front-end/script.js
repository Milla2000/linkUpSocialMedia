// Get the modal element
var editProfileModal = document.querySelector(".modaling");

// Get the button that opens the modal
var editBtn = document.querySelector(".edit-btn");

// Get the close button element
var closeEditProfileBtn = editProfileModal.querySelector('.close');

// Function to open the modal
function openEditProfileModal() {
  editProfileModal.style.display = "block";
}

// Function to close the modal
function closeEditProfileModal() {
  editProfileModal.style.display = 'none';
}

// Open the modal when the Edit button is clicked
editBtn.addEventListener("click", openEditProfileModal);

// Close the modal when the close button is clicked
closeEditProfileBtn.addEventListener("click", closeEditProfileModal);

// Close the modal when clicking outside the modal content
window.addEventListener("click", function (event) {
  if (event.target == editProfileModal) {
    closeEditProfileModal();
  }
});




// Get references to the modal and the add post button by their IDs
const modal1 = document.querySelector('.modaling1');
const addPostButton = document.getElementById('add-post-button');

// Function to show the modal
function showModal() {
  modal1.style.display = 'block';
}

// Function to hide the modal
function closeModal() {
  modal1.style.display = 'none';
}

// Event listener to show the modal when the add post button is clicked
addPostButton.addEventListener('click', showModal);

// Event listener to hide the modal when the close button (×) is clicked
const closeButton = modal1.querySelector('.close1');
closeButton.addEventListener('click', closeModal);


// Get references to the messages button and the messaging page
const messagesButton = document.getElementById('messages-button');
const messagingPage = document.querySelector('.messaging-page');
const trendsDiv = document.querySelector('.trends');
const userToKnowThemDiv = document.querySelector('.user-to-know-them');

// Add a click event listener to the messages button
messagesButton.addEventListener('click', () => {
  // Toggle the display property of the messaging page
  messagingPage.style.display = 'block';
  trendsDiv.style.display = 'none';
  userToKnowThemDiv.style.display = 'none'
});


const barLink = document.querySelector('.bar');
const postsLink = document.querySelector('.posts');
const followersLink = document.querySelector('.followers-div');
const followersContainer = document.querySelector('.follower-following-container');

// Add a click event listener to the followersLink
followersLink.addEventListener('click', function () {
  // Set display to 'none' for barLink and postsLink
  barLink.style.display = 'none';
  postsLink.style.display = 'none';

  // Set display to 'block' for followersContainer
  followersContainer.style.display = 'flex';
  followersContainer.style.flexDirection = 'row' ;
  followersContainer.style.alignItems =  'center' ;
  followersContainer.style.justifyContent = 'centre';
});



;

