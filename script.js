const SUPABASE_URL =
    "https://gpwqcfjdwwwlwutcuizpx.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_4V3NG02ni7eC6LduWqHjxA_-3s2DZgj";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =====================================
// MERR PRODUKTET NGA SUPABASE
// =====================================

async function loadProducts() {

    const container =
        document.getElementById("showroomProducts");

    if (!container) return;


    container.innerHTML = `
        <div class="no-products">
            <p>Duke ngarkuar produktet...</p>
        </div>
    `;


    const {
        data: products,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "Gabim Supabase:",
            error
        );

        container.innerHTML = `
            <div class="no-products">
                <h3>Nuk u ngarkuan produktet</h3>
                <p>Ju lutem provoni përsëri.</p>
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    if (!products || products.length === 0) {

        container.innerHTML = `
            <div class="no-products">
                <h3>Nuk ka produkte</h3>
                <p>
                    Produktet e reja do të shfaqen këtu.
                </p>
            </div>
        `;

        return;
    }


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product";


        const image =
            product.image
                ? `
                    <img
                        src="${escapeHtml(product.image)}"
                        alt="${escapeHtml(product.name)}"
                    >
                  `
                : `
                    <span>FOTO</span>
                  `;


        card.innerHTML = `

            <div class="product-image">
                ${image}
            </div>


            <div class="product-info">

                <h3>
                    ${escapeHtml(product.name)}
                </h3>


                ${
                    product.category
                        ? `
                            <p>
                                ${escapeHtml(product.category)}
                            </p>
                          `
                        : ""
                }


                <button
                    type="button"
                    onclick="showProduct(${product.id})">

                    Shiko detajet

                </button>

            </div>

        `;


        container.appendChild(card);

    });

}



// =====================================
// SHFAQ DETAJET E PRODUKTIT
// =====================================

async function showProduct(id) {

    const {
        data: product,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .eq("id", id)
        .single();


    if (error || !product) {

        console.error(error);

        return;
    }


    const modal =
        document.getElementById("modal");


    if (!modal) return;


    const title =
        document.getElementById("modal-title");

    const image =
        document.getElementById("modal-image");

    const category =
        document.getElementById("modal-category");

    const description =
        document.getElementById("modal-description");

    const dimensions =
        document.getElementById("modal-dimensions");

    const material =
        document.getElementById("modal-material");


    if (title) {
        title.textContent =
            product.name || "";
    }


    if (image) {

        if (product.image) {

            image.src =
                product.image;

            image.alt =
                product.name || "Produkt";

            image.style.display =
                "block";

        } else {

            image.style.display =
                "none";

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


    modal.style.display =
        "flex";

}



// =====================================
// MBYLL MODALIN
// =====================================

function closeProduct() {

    const modal =
        document.getElementById("modal");


    if (!modal) return;


    modal.style.display =
        "none";

}



// =====================================
// KLIK JASHTË MODALIT
// =====================================

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById("modal");


        if (
            modal &&
            event.target === modal
        ) {

            modal.style.display =
                "none";

        }

    }
);



// =====================================
// SIGURIA PËR TEKSTIN
// =====================================

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



// =====================================
// NIS FAQEN
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadProducts();

    }
);
