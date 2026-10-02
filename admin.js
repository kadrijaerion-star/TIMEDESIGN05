const SUPABASE_URL =
    "https://gpwqcfjdwwwlwutcuizpx.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_4V3NG02ni7eC6LduWqHjxA_-3s2DZgj";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ===============================
// SHTO PRODUKT
// ===============================

async function addProduct() {

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


    if (!name) {
        alert("Ju lutem vendosni emrin e produktit.");
        return;
    }


    if (!imageInput.files.length) {
        alert("Ju lutem zgjidhni një fotografi.");
        return;
    }


    const file = imageInput.files[0];

    const fileExtension =
        file.name.split(".").pop();

    const fileName =
        Date.now() +
        "-" +
        Math.random().toString(36).substring(2) +
        "." +
        fileExtension;


    try {

        // ===============================
        // 1. NGARKO FOTOGRAFINË
        // ===============================

        const {
            error: uploadError
        } = await supabaseClient
            .storage
            .from("product-images")
            .upload(fileName, file);


        if (uploadError) {
            console.error(uploadError);

            alert(
                "Gabim gjatë ngarkimit të fotografisë:\n" +
                uploadError.message
            );

            return;
        }


        // ===============================
        // 2. MERR URL E FOTOGRAFISË
        // ===============================

        const {
            data: imageData
        } = supabaseClient
            .storage
            .from("product-images")
            .getPublicUrl(fileName);


        const imageUrl =
            imageData.publicUrl;


        // ===============================
        // 3. RUAJ PRODUKTIN
        // ===============================

        const {
            error: databaseError
        } = await supabaseClient
            .from("products")
            .insert([
                {
                    name: name,
                    category: category,
                    image: imageUrl,
                    description: description,
                    dimensions: dimensions,
                    material: material
                }
            ]);


        if (databaseError) {

            console.error(databaseError);

            alert(
                "Produkti nuk u ruajt:\n" +
                databaseError.message
            );

            return;
        }


        // ===============================
        // 4. PASTRO FORMULARIN
        // ===============================

        clearForm();

        await showProducts();


        alert(
            "✅ Produkti u shtua me sukses!"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Ndodhi një gabim. Shiko Console për detaje."
        );
    }
}



// ===============================
// SHFAQ PRODUKTET NË ADMIN
// ===============================

async function showProducts() {

    const container =
        document.getElementById("adminProducts");

    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Duke ngarkuar produktet...</p>";


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

        console.error(error);

        container.innerHTML =
            "<p>Nuk u mundën të ngarkohen produktet.</p>";

        return;
    }


    if (!products || products.length === 0) {

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


    container.innerHTML = "";


    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${escapeHtml(product.image)}"
                    alt="${escapeHtml(product.name)}"
                >

            </div>


            <div class="product-info">

                <h3>
                    ${escapeHtml(product.name)}
                </h3>

                <p>
                    ${escapeHtml(product.category || "")}
                </p>

                <p>
                    ${escapeHtml(product.description || "")}
                </p>

                <p>
                    <strong>Dimensionet:</strong>
                    ${escapeHtml(product.dimensions || "")}
                </p>

                <p>
                    <strong>Materiali:</strong>
                    ${escapeHtml(product.material || "")}
                </p>

                <br>

                <button
                    type="button"
                    onclick="deleteProduct(${product.id})"
                >
                    🗑️ Fshi
                </button>

            </div>

        `;


        container.appendChild(card);

    });
}



// ===============================
// FSHI PRODUKT
// ===============================

async function deleteProduct(id) {

    const confirmation =
        confirm(
            "A je i sigurt që dëshiron ta fshish këtë produkt?"
        );


    if (!confirmation) {
        return;
    }


    const {
        error
    } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Produkti nuk u fshi:\n" +
            error.message
        );

        return;
    }


    await showProducts();

    alert("Produkti u fshi me sukses!");
}



// ===============================
// PASTRO FORMULARIN
// ===============================

function clearForm() {

    const name =
        document.getElementById("productName");

    const image =
        document.getElementById("productImage");

    const description =
        document.getElementById("productDescription");

    const dimensions =
        document.getElementById("productDimensions");

    const material =
        document.getElementById("productMaterial");

    const preview =
        document.getElementById("imagePreview");


    if (name) {
        name.value = "";
    }

    if (image) {
        image.value = "";
    }

    if (description) {
        description.value = "";
    }

    if (dimensions) {
        dimensions.value = "";
    }

    if (material) {
        material.value = "";
    }

    if (preview) {
        preview.innerHTML = "";
    }
}



// ===============================
// SIGURIA PËR HTML
// ===============================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



// ===============================
// NGARKO PRODUKTET
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function() {
        showProducts();
    }
);
