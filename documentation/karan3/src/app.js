let sidebarMenuOpen = false;

function toggleSideMenu() {
  const sidebarMenu = document.getElementById("sidebarMenu");
  const sidebarMenuArea = document.getElementById("sidebarMenuArea");

  if (sidebarMenuOpen) {
    sidebarMenuArea.style.left = "-100%";
    setTimeout(() => {
      sidebarMenu.style.display = "none";
    }, 100);
    sidebarMenuOpen = false;
  } else {
    sidebarMenu.style.display = "flex";
    setTimeout(() => {
      sidebarMenuArea.style.left = 0;
    }, 100);
    sidebarMenuOpen = true;
  }
}

function openNoteModal() {
  const darkOverlay = document.querySelector(".dark-overlay");
  const openNoteBtn = document.querySelector(".open-note-btn");
  const noteBox = document.querySelector(".note-box");

  openNoteBtn.classList.add("hidden");
  darkOverlay.classList.remove("hidden");
  noteBox.style.right = 0;
}

function closeNoteModal() {
  const darkOverlay = document.querySelector(".dark-overlay");
  const openNoteBtn = document.querySelector(".open-note-btn");
  const noteBox = document.querySelector(".note-box");

  openNoteBtn.classList.remove("hidden");
  darkOverlay.classList.add("hidden");
  noteBox.style.right = "-100%";
}
