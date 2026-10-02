// ==========================================
// TIMEDESIGN - SHOWROOM
// ==========================================

let products = JSON.parse(
    localStorage.getItem("timeDesignProducts")
) || [];


// ==========================================
// SHOWROOM - SHFAQ PRODUKTET
// ==========================================

function renderProducts() {

    const container =
        document.getElementById("showroomProducts");

    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>Nuk ka produkte</h3>
                <p>Produktet e reja do të shfaqen këtu.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product";

        card.innerHTML = `

            <div class="product-image">

                ${
                    product.image
                        ? `
                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >
                          `
                        : `
                            <span>FOTO</span>
                          `
                }

            </div>

            <div class="product-info">

                <h3>${product.name}</h3>

                ${
                    product.category
                        ? `<p>${product.category}</p>`
                        : ""
                }

                <button
                    onclick="showProductById(${product.id})">
                    Shiko detajet
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}


// ==========================================
// SHFAQ DETAJET E PRODUKTIT
// ==========================================

function showProductById(id) {

    const product =
        products.find(p => p.id === id);

    if (!product) return;

    const modal =
        document.getElementById("modal");

    if (!modal) return;

    const title =
        document.getElementById("modal-title");

    const image =
        document.getElementById("modal-image");

    const description =
        document.getElementById("modal-description");

    const dimensions =
        document.getElementById("modal-dimensions");

    const material =
        document.getElementById("modal-material");

    const category =
        document.getElementById("modal-category");

    if (title) {
        title.textContent = product.name;
    }

    if (image) {

        if (product.image) {
            image.src = product.image;
            image.style.display = "block";
        } else {
            image.style.display = "none";
        }
    }

    if (category) {
        category.textContent =
            product.category || "";
    }

    if (description) {
        description.textContent =
            product.description || "";
    }

    if (dimensions) {
        dimensions.textContent =
            product.dimensions || "";
    }

    if (material) {
        material.textContent =
            product.material || "";
    }

    modal.style.display = "flex";
}


// ==========================================
// MBYLL MODALIN
// ==========================================

function closeProduct() {

    const modal =
        document.getElementById("modal");

    if (!modal) return;

    modal.style.display = "none";
}


// ==========================================
// KLIKO JASHTË MODALIT
// ==========================================

window.addEventListener("click", function(event) {

    const modal =
        document.getElementById("modal");

    if (
        modal &&
        event.target === modal
    ) {
        modal.style.display = "none";
    }

});


// ==========================================
// KUR HAPET FAQJA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderProducts();

    }
);