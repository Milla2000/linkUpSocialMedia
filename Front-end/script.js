 // Get the modal element
    var modal = document.querySelector(".modaling");

    // Get the button that opens the modal
    var editBtn = document.querySelector(".edit-btn");

    // Get the close button element
    var closeBtn = document.querySelector(".close");

    // Function to open the modal
    function openModal() {
        modal.style.display = "block";
  }

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
  }

    // Open the modal when the Edit button is clicked
    editBtn.addEventListener("click", openModal);

    // Close the modal when the close button is clicked
    closeBtn.addEventListener("click", closeModal);

    // Close the modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
    if (event.target == modal) {
        closeModal();
    }
  });

