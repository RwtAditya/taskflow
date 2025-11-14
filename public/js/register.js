const form = document.querySelector("#registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/register", {
        method:"POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({
            username,
            email,
            password
        })
    })

    const data = await res.json();

    if(!res.ok){
         if (Array.isArray(data.message)) {
            document.getElementById("errorMsg").textContent =
                data.message[0].msg; // show first error
        } else {
            document.getElementById("errorMsg").textContent = data.message;
        }
        return;
    }

    window.location.href = "/login";

})