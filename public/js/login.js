const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login", {
        method : "POST",
        headers: {"content-type" : "applicaiton/json"},
        body: JSON.stringify({email,password}),
    })

    const data = res.json();

    if(!res.ok) {
        document.getElementById("errorMsg").textContent = data.message;
        return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard";
})