// Get the modal element
const editProfileModal = document.querySelector(".modaling");
// Get the button that opens the modal
const editBtn = document.querySelector(".edit-btn");
// Get the close button element
const closeEditProfileBtn = editProfileModal.querySelector('.close');

// Get references to the modal and the add post button by their IDs
const modal1 = document.querySelector('.modaling1');
const addPostButton = document.getElementById('add-post-button');

// Get references to the messages button and the messaging page
const messagesButton = document.getElementById('messages-button');
const messagingPage = document.querySelector('.messaging-page');
const trendsDiv = document.querySelector('.trends');
const userToKnowThemDiv = document.querySelector('.user-to-know-them');

const barLink = document.querySelector('.bar');
const postsLink = document.querySelector('.posts');
const followersLink = document.querySelector('.followers-div');
const followersContainer = document.querySelector('.follower-following-container');

const profilePicture = document.querySelector('.png1');
const name = document.querySelector('.name');
const username = document.querySelector('.username');
const email = document.querySelector('.email');
const followersCount = document.querySelector('.p-followers');
const followingCount = document.querySelector('.p-following');

const editForm = document.getElementById("edit-form");
const imageEdit = document.getElementById("image-upload");

const usernameElement = document.querySelector('.name');
const emailElement = document.querySelector('.emailUser');
const followersElement = document.querySelector('.follospan');
const followingElement = document.querySelector('.followingspan');
const profilePictureElement = document.querySelector('.png-edit');
const dateJoined = document.querySelector(".p-top");




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










// Add a click event listener to the messages button
messagesButton.addEventListener('click', () => {
  // Toggle the display property of the messaging page
  messagingPage.style.display = 'block';
  trendsDiv.style.display = 'none';
  userToKnowThemDiv.style.display = 'none'
});




// Add a click event listener to the followersLink
followersLink.addEventListener('click', function () {
  // Set display to 'none' for barLink and postsLink
  barLink.style.display = 'none';
  postsLink.style.display = 'none';

  // Set display to 'block' for followersContainer
  followersContainer.style.display = 'flex';
  followersContainer.style.flexDirection = 'row';
  followersContainer.style.alignItems = 'center';
  followersContainer.style.justifyContent = 'centre';
});

// Assuming you have already stored the token in localStorage
const token = localStorage.getItem('token');
const userId = localStorage.getItem('id');

// Function to fetch user data from the backend
async function fetchUserData() {
  try {

    const response = await axios.get(`http://localhost:4500/users/singleusers/${userId}`, {
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "token": token
      }
    });

    const userData = response.data;
    // console.log(userData);

    // Set user data in HTML elements


    profilePicture.src = userData.profile_picture
    name.textContent = userData.full_name;
    username.textContent = `@${userData.username}`;
    email.textContent = userData.email;
    followersCount.textContent = userData.followers_count;
    followingCount.textContent = userData.following_count;


    usernameElement.textContent = userData.username;
    emailElement.textContent = userData.email;
    followersElement.textContent = userData.followers_count;
    followingElement.textContent = userData.following_count;
    profilePictureElement.src = userData.profile_picture;

    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'long' };
      const date = new Date(dateString);
      return `Joined, ${date.toLocaleDateString('en-US', options)}`;
    }
    const joinedDate = formatDate(userData.created_at);

    dateJoined.textContent = joinedDate;


  } catch (error) {
    console.error('Error fetching user data:', error);
    // Handle error as needed
  }
}




// Define a variable to store the profile picture URL
let profileUrl = '';

// Function to upload an image to Cloudinary and get the image URL
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Shoppie");
  formData.append("cloud_name", "dhgs8thzx");

  try {
    // Upload the image to Cloudinary
    const response = await fetch('https://api.cloudinary.com/v1_1/dhgs8thzx/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.url;
    } else {
      console.error("Failed to upload image to Cloudinary");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while uploading the image:", error);
    return null;
  }
}





// Add an event listener to the image input to handle file upload
imageEdit.addEventListener('change', async (event) => {
  const target = event.target;
  const files = target.files;

  console.log("inside", files);

  if (files) {
    const file = files[0];
    profileUrl = await uploadImageToCloudinary(file);

    if (profileUrl) {
      console.log("Image uploaded to Cloudinary:", profileUrl);
    }
  }
});




// Event listener to handle form submission
editForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get the user input from the form
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const fullname = document.getElementById("fullname").value;

  // Make the PUT request to update the user profile
  try {
    const response = await axios.put(`http://localhost:4500/users/edit/${userId}`,
      {
        username: username,
        email: email,
        full_name: fullname,
        profile_picture: profileUrl,
      }, {
      headers: {
        "Content-Type": "application/json",
        "token": token,
      },
    });

    closeEditProfileModal();
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.response && error.response.data && error.response.data.message) {
      alert("Error: " + error.response.data.error);
    } else {
      alert(error.response.data.error);
    }
  }
});

function showToast(message) {
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");
  toast.style.display = "block";
  toastText.textContent = message;
  toast.style.right = "20px"; // Show the toast

  setTimeout(() => {
    toast.style.display = "none"; // Hide the toast
    // toast.style.left = "-250px"; // Hide the toast
  }, 1000); // Change 2000 to the desired duration in milliseconds
}

// Add a click event listener to the Delete User button
const deleteUserButton = document.querySelector(".fixed-div");

deleteUserButton.addEventListener("click", function () {
  const token = localStorage.getItem('token');
  // Perform the DELETE request
  axios.delete(`http://localhost:4500/users/softdelete/${userId}`, {
    headers: {
      "token": token,
    }
  })
    .then(function (response) {
      // Check if the delete request was successful
      if (response.status === 200) {
        // Show the toast notification with a message
        showToast("User deleted successfully.");
      } else {
        // Show the toast notification with an error message
        showToast("Failed to delete user.");
      }
    })
    .catch(function (error) {
      // Handle any errors that occurred during the DELETE request
      console.error("Error deleting user:", error);
      // Show the toast notification with an error message
      showToast("An error occurred while deleting user.");
    });
});

function isValidURL(string) {
  return string.includes('http');
}

function fetchAndDisplayUsers(token) {
  axios.get('http://localhost:4500/users/getallusers', {
    headers: {
      'token': token, // Pass the token as an argument
    },
  })
    .then((response) => {
      const usersData = response.data;
      console.log(usersData);
      const filteredUsersData = usersData.filter(user => user.id !== userId);

      // Get the container element where you want to append the users
      const usersContainer = document.querySelector('.to-be-generated')
      usersContainer.innerHTML = '';

      // Iterate over the users and generate HTML for each user using template literals
      filteredUsersData.forEach((user) => {
        const profilePictureSrc = isValidURL(user.profile_picture)
          ? user.profile_picture
          : '/Front-end/images/user (1).png';
        const userHTML = `
          <div class="user-know">
            <img style= "border-radius: 49%;" class="png-edit" src="${profilePictureSrc}" alt="">
            <div class="user-details">
              <h3 class="to-know-names">${user.username}</h3>
              <h5 class="email">${user.email}</h5>
              <h5><span>${user.followers_count}</span> followers</h5>
            </div>
          </div>
        `;

        // Append the generated HTML to the usersContainer
        usersContainer.innerHTML += userHTML;
      });
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      // Handle the error as needed
    });
}

async function deletePost(postId) {
  try {
    const requestBody = JSON.stringify({
      user_id: userId,
      post_id: postId
    });

    const response = await fetch('http://localhost:4500/posts/softdeleteyourpost', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: requestBody
    });

    if (response.status === 200) {
      // Successfully deleted the post, you can remove it from the DOM
      const postToRemove = document.querySelector(`[data-post-id="${postId}"]`);
      if (postToRemove) {
        postToRemove.closest('.my-details').remove();
        alert('Post deleted successfully!');
      }
    } else {
      const responseData = await response.json(); // Parse the error response JSON
      alert('Failed to delete the post: ' + responseData.error);
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Error deleting post: ' + error.message);
  }
}




// Get the container where you want to display the posts
const postsContainer = document.querySelector('.posts');


function fetchAndDisplayPosts() {


  // Make an HTTP GET request to fetch the posts
  axios.get('http://localhost:4500/posts/getAllPosts', {
    headers: {
      'token': token, // Use the retrieved user token here
    },
  })
    .then((response) => {
      const postsData = response.data; // Assuming the response data is an array of post objects
      console.log(postsData);
      // Clear the existing content in the posts container
      postsContainer.innerHTML = '';

      // Iterate over each post in the array and append to the container
      postsData.forEach((post) => {
        // Create a div for the post
        const postDiv = document.createElement('div');
        postDiv.classList.add('my-details');
        const createdAtTimestamp = new Date(post.created_at);

        // Month abbreviations
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedCreatedAt = `${monthNames[createdAtTimestamp.getMonth()]} ${createdAtTimestamp.getDate()}, ${createdAtTimestamp.getFullYear()} @${createdAtTimestamp.getHours().toString().padStart(2, '0')}:${createdAtTimestamp.getMinutes().toString().padStart(2, '0')}:${createdAtTimestamp.getSeconds().toString().padStart(2, '0')}`;

        // Create the HTML structure for each post
        postDiv.innerHTML = `
        <p class="poster" >${post.username}, &nbsp;&nbsp; &nbsp; ${formattedCreatedAt}</span> &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; <span class="delete-post-button" data-post-id="${post.id}">
        <img src="/Front-end/images/icons8-trash-24.png" alt="Delete Post">
    </span></p>
        <p>${post.content}</p>
        <img class="png-post" src="${post.image_url}" alt="">
        <div class="reacting-comments">
          <div class="user-actions"><img src="/Front-end/images/icons8-like-28.png" alt=""><span class="no-likes">${post.likes_count}</span></div>
          <div class="user-actions"><img src="/Front-end/images/icons8-comment-28.png" alt=""><span class="no-comments">${post.comments_count}</span></div>
          
        </div>
      `;


        postDiv.querySelector('.delete-post-button').addEventListener("click", () => {
          deletePost(post.id);
        });
        // Append the post div to the container
        postsContainer.appendChild(postDiv);
      });
    })
    .catch((error) => {
      console.error('Error fetching posts:', error);

    });
}



// Get references to the form and form elements
const addPostForm = document.querySelector('.modal-content1 form');
const postImageInput = document.getElementById('post-image');
const postTextInput = document.getElementById('post-text');

// Add an event listener for the form submission
addPostForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Get user input from the form
  const imageFile = postImageInput.files[0];
  const postText = postTextInput.value;

  // Upload the image to Cloudinary
  const imageUrl = await uploadImageToCloudinary(imageFile);

  if (!imageUrl) {
    alert('Failed to upload the image to Cloudinary.');
    return;
  }



  // Make the POST request to create a new post
  axios
    .post('http://localhost:4500/posts/createnewpost',
      {
        user_id: userId,
        content: postText,
        image_url: imageUrl

      },
      {
        headers: {
          "Content-Type": "application/json",
          "token": token
        },
      })
    .then((response) => {
      // Handle success, e.g., close the modal or show a success message
      console.log('Post created successfully:', response.data);
      closeModal();
      alert('Post created successfully!');
    })
    .catch((error) => {
      // Handle errors, e.g., display an error message
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
    });
});






// Call the fetchUserData function when the page loads
window.addEventListener('load', fetchUserData);
fetchAndDisplayPosts();
fetchAndDisplayUsers(token);





