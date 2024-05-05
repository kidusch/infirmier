let sidebarMenuOpen = false;

function toggleSideMenu() {
    const sidebarMenu = document.getElementById("sidebarMenu");
    const sidebarMenuArea = document.getElementById("sidebarMenuArea");


    if (sidebarMenuOpen) {
        sidebarMenuArea.style.left = '-100%';
        setTimeout(() => {
            sidebarMenu.style.display = 'none';
        }, 100);
        sidebarMenuOpen = false;
    } else {
        sidebarMenu.style.display = 'flex';
        setTimeout(() => {
            sidebarMenuArea.style.left = 0;
        }, 100);
        sidebarMenuOpen = true;
    }

}