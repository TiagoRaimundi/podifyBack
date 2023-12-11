const getById = (id) => {
    return document.getElementById(id);
}

const password = getById('password');
const confirmPassword = getById('confirm-password');
const form = getById('form');
const container = getById('container');
const loader = getById('loader');
const button = getById('submit');
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";
container.style.display = "none";


let token, userId; 
// If you plan to use URLSearchParams, you can do so without a Proxy
window.addEventListener('DOMContentLoaded', async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop)
        }
    }) 
    token = params.token
    userId = params.userId

    const res = await fetch("/auth/verify-pass-reset-token",
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"

        },
        body: JSON.stringify({
            token, userId
        })
    })

    if(!res.ok){
        const { error } = await res.json()
        loader.innerText = error
        return
    }

    loader.style.display = "none"
    container.style.display = "block"
  
});

