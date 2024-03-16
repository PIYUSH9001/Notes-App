const submit_btn = document.getElementById("submit_btn");
const signup_btn = document.getElementById("signUpbtn");
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

function makeBtn(btn) {
    btn.addEventListener("mouseover", () => {
        btn.style.transition = "all 0.5s";
        btn.style.backgroundColor = "yellow";
        btn.style.color = "black";
    });
    btn.addEventListener("mouseout", () => {
        btn.style.transition = "all 0.5s";
        btn.style.backgroundColor = "black";
        btn.style.color = "white";
    });
};
makeBtn(submit_btn);
makeBtn(signup_btn);

function handleClientLogin() {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/login", true);

    xhr.setRequestHeader("Content-type", "application/json");

    const data = JSON.stringify({ email: email, password, password });

    xhr.send(data);
}
