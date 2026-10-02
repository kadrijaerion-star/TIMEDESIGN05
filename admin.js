let products =
    JSON.parse(localStorage.getItem("timeDesignProducts")) || [];


// ===============================
// RUAJTJA E PRODUKTEVE
// ===============================

function saveProducts() {

    localStorage.setItem(
        "timeDesignProducts",
        JSON.stringify(products)
    );

}


// ===============================
// HAP FORMULARIN
// ===============================

function openAddProduct() {

    const section =
        document.getElementById("add-product");

    section.style.display = "block";

    section.scrollIntoView({
        behavior: "smooth"
    });

}


// ===============================
// SHTO PRODUKT
// ===============================

function addProduct() {

    const name =
        document.getElementById("productName").value.trim();

    const category =
        document.getElementById("productCategory").value;

    const imageInput =
        document.getElementById("productImage");

    const description =
        document.getElementById("productDescription").value.trim();

    const dimensions =
        document.getElementById("productDimensions").value.trim();

    const material =
        document.getElementById("productMaterial").value.trim();


    // Kontrollo të dhënat

    if (!name) {

        alert("Ju lutem vendosni emrin e produktit.");

        return;
    }


    if (imageInput.files.length === 0) {

        alert("Ju lutem zgjidhni një fotografi.");

        return;
    }


    // Merr fotografinë

    const file =
        imageInput.files[0];

    const reader =
        new FileReader();


    reader.onload = function(event) {

        const product = {

            id: Date.now(),

            name: name,

            category: category,

            image: event.target.result,

            description: description,

            dimensions: dimensions,

            material: material

        };


        // Shto produktin

        products.push(product);


        // Ruaje

        saveProducts();


        // Pastro formularin

        clearForm();


        // Rifresko listën

        showProducts();


        alert("Produkti u shtua me sukses!");

    };


    reader.readAsDataURL(file);

}


// ===============================
// SHFAQ PRODUKTET NË ADMIN
// ===============================

function showProducts() {

    const container =
        document.getElementById("adminProducts");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (products.length === 0) {

        container.innerHTML = `
            <p style="
                text-align:center;
                grid-column:1 / -1;
            ">
                Ende nuk ka produkte.
            </p>
        `;

        return;
    }


    products.forEach(product => {

        container.innerHTML += `

            <div class="product">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${product.category}
                    </p>

                    <p>
                        ${product.description}
                    </p>

                    <p>
                        <strong>Dimensionet:</strong>
                        ${product.dimensions}
                    </p>

                    <p>
                        <strong>Materiali:</strong>
                        ${product.material}
                    </p>

                    <br>

                    <button
                        onclick="deleteProduct(${product.id})"
                    >
                        🗑️ Fshi
                    </button>

                </div>

            </div>

        `;

    });

}


// ===============================
// FSHI PRODUKT
// ===============================

function deleteProduct(id) {

    const confirmation =
        confirm(
            "A je i sigurt që dëshiron ta fshish këtë produkt?"
        );


    if (!confirmation) {
        return;
    }


    products =
        products.filter(
            product => product.id !== id
        );


    saveProducts();

    showProducts();

}


// ===============================
// PASTRO FORMULARIN
// ===============================

function clearForm() {

    document.getElementById("productName").value = "";

    document.getElementById("productImage").value = "";

    document.getElementById("productDescription").value = "";

    document.getElementById("productDimensions").value = "";

    document.getElementById("productMaterial").value = "";

    const preview =
        document.getElementById("imagePreview");


    if (preview) {

        preview.innerHTML = "";

    }

}


// ===============================
// SHFAQ PRODUKTET KUR HAPET ADMIN
// ===============================

showProducts();