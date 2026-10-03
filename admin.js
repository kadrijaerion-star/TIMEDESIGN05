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
// 🔐 ADMIN LOGIN
// =====================================

async function loginAdmin() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const errorBox =
        document.getElementById("loginError");

    if (!email || !password) {

        if (errorBox) {

            errorBox.textContent =
                "Ju lutem plotësoni email dhe password.";

            errorBox.style.display =
                "block";
        }

        return;
    }

    if (errorBox) {
        errorBox.style.display =
            "none";
    }

    const {
        data,
        error
    } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {

        console.error(error);

        if (errorBox) {

            errorBox.textContent =
                "Email ose password gabim!";

            errorBox.style.display =
                "block";
        }

        return;
    }

    console.log(
        "Admin u kyç:",
        data.user.email
    );

    showAdminPanel();

    await showProducts();
}



// =====================================
// 🔑 RESET PASSWORD
// =====================================

async function forgotPassword() {

    const emailInput =
        document.getElementById("loginEmail");

    const email =
        emailInput
            ? emailInput.value.trim()
            : "";

    if (!email) {

        alert(
            "Shkruaje email-in e Admin-it së pari."
        );

        return;
    }


    const {
        error
    } =
        await supabaseClient.auth.resetPasswordForEmail(
            email,
            {
                redirectTo:
                    "https://kadrijaerion-star.github.io/TIMEDESIGN05/reset-password.html"
            }
        );


    if (error) {

        console.error(error);

        alert(
            "Nuk u dërgua email-i për reset:\n" +
            error.message
        );

        return;
    }


    alert(
        "✅ Linku për ndryshimin e password-it u dërgua në Gmail."
    );
}



// =====================================
// 🚪 LOGOUT
// =====================================

async function logoutAdmin() {

    const {
        error
    } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error(error);

        alert(
            "Nuk u bë logout."
        );

        return;
    }

    location.reload();
}



// =====================================
// 🔎 KONTROLLO LOGIN-IN
// =====================================

async function checkAdminSession() {

    const {
        data
    } =
        await supabaseClient.auth.getSession();


    if (data.session) {

        showAdminPanel();

        await showProducts();

    } else {

        hideAdminPanel();

    }
}



// =====================================
// 👑 SHFAQ ADMIN PANEL
// =====================================

function showAdminPanel() {

    const panel =
        document.getElementById("adminPanel");


    if (panel) {

        panel.style.display =
            "block";
    }


    const loginButton =
        document.getElementById("loginButton");

    const loginEmail =
        document.getElementById("loginEmail");

    const loginPassword =
        document.getElementById("loginPassword");


    if (loginButton) {

        loginButton.style.display =
            "none";
    }


    if (loginEmail) {

        loginEmail.style.display =
            "none";
    }


    if (loginPassword) {

        loginPassword.style.display =
            "none";
    }


    const loginError =
        document.getElementById("loginError");


    if (loginError) {

        loginError.style.display =
            "none";
    }


    addLogoutButton();
}



// =====================================
// 🔒 FSHEH ADMIN PANEL
// =====================================

function hideAdminPanel() {

    const panel =
        document.getElementById("adminPanel");


    if (panel) {

        panel.style.display =
            "none";
    }
}



// =====================================
// 🚪 SHTO BUTONIN LOGOUT
// =====================================

function addLogoutButton() {

    if (
        document.getElementById(
            "logoutButton"
        )
    ) {

        return;
    }


    const panel =
        document.getElementById(
            "adminPanel"
        );


    if (!panel) return;


    const button =
        document.createElement(
            "button"
        );


    button.id =
        "logoutButton";


    button.type =
        "button";


    button.textContent =
        "Dil nga Admin";


    button.onclick =
        logoutAdmin;


    button.style.cssText = `
        padding: 12px 20px;
        margin: 15px 0;
        cursor: pointer;
    `;


    panel.prepend(button);
}



// =====================================
// ➕ SHTO PRODUKT
// =====================================

async function addProduct() {

    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const imageInput =
        document.getElementById(
            "productImage"
        );


    const description =
        document.getElementById(
            "productDescription"
        ).value.trim();


    const dimensions =
        document.getElementById(
            "productDimensions"
        ).value.trim();


    const material =
        document.getElementById(
            "productMaterial"
        ).value.trim();



    if (!name) {

        alert(
            "Ju lutem vendosni emrin e produktit."
        );

        return;
    }



    if (!imageInput.files.length) {

        alert(
            "Ju lutem zgjidhni një fotografi."
        );

        return;
    }



    const file =
        imageInput.files[0];



    const extension =
        file.name
            .split(".")
            .pop();



    const fileName =
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2) +
        "." +
        extension;



    try {

        // =========================
        // 🖼️ UPLOAD FOTO
        // =========================

        const {
            error: uploadError
        } =
            await supabaseClient
                .storage
                .from("product-images")
                .upload(
                    fileName,
                    file
                );



        if (uploadError) {

            console.error(
                uploadError
            );

            alert(
                "Gabim gjatë ngarkimit të fotografisë:\n" +
                uploadError.message
            );

            return;
        }



        // =========================
        // 🔗 PUBLIC URL
        // =========================

        const {
            data: imageData
        } =
            supabaseClient
                .storage
                .from("product-images")
                .getPublicUrl(
                    fileName
                );



        const imageUrl =
            imageData.publicUrl;



        // =========================
        // 💾 RUAJ PRODUKTIN
        // =========================

        const {
            error: databaseError
        } =
            await supabaseClient
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

            console.error(
                databaseError
            );

            alert(
                "Produkti nuk u ruajt:\n" +
                databaseError.message
            );

            return;
        }



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



// =====================================
// 📦 SHFAQ PRODUKTET
// =====================================

async function showProducts() {

    const container =
        document.getElementById(
            "adminProducts"
        );


    if (!container) return;



    container.innerHTML =
        "<p>Duke ngarkuar produktet...</p>";



    const {
        data: products,
        error
    } =
        await supabaseClient
            .from("products")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );



    if (error) {

        console.error(error);

        container.innerHTML =
            "<p>Nuk u mundën të ngarkohen produktet.</p>";

        return;
    }



    if (
        !products ||
        products.length === 0
    ) {

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



    container.innerHTML =
        "";



    products.forEach(
        product => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product";


            card.innerHTML = `

                <div class="product-image">

                    ${
                        product.image
                        ?
                        `
                        <img
                            src="${escapeHtml(product.image)}"
                            alt="${escapeHtml(product.name)}"
                        >
                        `
                        :
                        `<span>FOTO</span>`
                    }

                </div>


                <div class="product-info">

                    <h3>
                        ${escapeHtml(product.name)}
                    </h3>


                    <p>
                        ${escapeHtml(
                            product.category || ""
                        )}
                    </p>


                    <p>
                        ${escapeHtml(
                            product.description || ""
                        )}
                    </p>


                    <p>
                        <strong>
                            Dimensionet:
                        </strong>

                        ${escapeHtml(
                            product.dimensions || ""
                        )}
                    </p>


                    <p>
                        <strong>
                            Materiali:
                        </strong>

                        ${escapeHtml(
                            product.material || ""
                        )}
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


            container.appendChild(
                card
            );

        }
    );
}



// =====================================
// 🗑️ FSHI PRODUKT
// =====================================

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
    } =
        await supabaseClient
            .from("products")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        console.error(error);

        alert(
            "Produkti nuk u fshi:\n" +
            error.message
        );

        return;
    }


    await showProducts();


    alert(
        "✅ Produkti u fshi me sukses!"
    );
}



// =====================================
// 🧹 PASTRO FORMULARIN
// =====================================

function clearForm() {

    const name =
        document.getElementById(
            "productName"
        );


    const image =
        document.getElementById(
            "productImage"
        );


    const description =
        document.getElementById(
            "productDescription"
        );


    const dimensions =
        document.getElementById(
            "productDimensions"
        );


    const material =
        document.getElementById(
            "productMaterial"
        );


    const preview =
        document.getElementById(
            "imagePreview"
        );



    if (name) {

        name.value =
            "";
    }


    if (image) {

        image.value =
            "";
    }


    if (description) {

        description.value =
            "";
    }


    if (dimensions) {

        dimensions.value =
            "";
    }


    if (material) {

        material.value =
            "";
    }


    if (preview) {

        preview.innerHTML =
            "";
    }
}



// =====================================
// 🛡️ SIGURIA HTML
// =====================================

function escapeHtml(value) {

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



// =====================================
// 🚀 START
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        checkAdminSession();

    }
);
