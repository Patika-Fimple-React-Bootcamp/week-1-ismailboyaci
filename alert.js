// alert.js
export class AlertManager {
    constructor() {
        this.alertDiv = document.getElementById("alert");
        this.overlay = document.createElement("div");
        this.overlay.classList.add("overlay");
        document.body.appendChild(this.overlay);

        const closeButton = document.getElementById("closeButton");
        closeButton.addEventListener("click", this.hideAlert.bind(this));
    }

    showAlert() {
        this.alertDiv.style.display = "flex";
        this.overlay.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    hideAlert() {
        this.alertDiv.style.display = "none";
        this.overlay.style.display = "none";
        document.body.style.overflow = "";
    }
}