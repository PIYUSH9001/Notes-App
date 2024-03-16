const CreateBtn = document.querySelector("#create_btn");
const NewNoteForm = document.querySelector("#new_form");
const Container = document.querySelector("#container");
const options = document.getElementsByClassName("options");
const options_btn = document.getElementsByClassName("options_btn");
const notes = document.getElementsByClassName("notes");
const addNoteBtn = document.getElementById("addNoteBtn");
const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    NewNoteForm.style.visibility = "hidden";
    NewNoteForm.style.opacity = 0;
    cancelBtn.disabled = true;
    addNoteBtn.disabled = true;
})
addNoteBtn.addEventListener("mouseover", () => {
    addNoteBtn.style.backgroundColor = "white";
    addNoteBtn.style.color = "orange";
});
addNoteBtn.addEventListener("mouseout", () => {
    addNoteBtn.style.backgroundColor = "orange";
    addNoteBtn.style.color = "white";
});
addNoteBtn.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/addNote", true);
    xhr.setRequestHeader("Content-type", "application/json");
    const created_heading = document.getElementById("new_heading").value;
    const created_content = document.getElementById("new_content").value;
    const data = JSON.stringify({ createdHeading: created_heading, createdContent: created_content });
    xhr.send(data);
    xhr.onload = function () {
        if (xhr.status === 201 || xhr.status === 409) {
            // Note successfully added
            window.location.href = "/home";
        }
        else {
            console.error("Error adding note:", xhr.responseText);
        }
    }
})
CreateBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    addNoteBtn.disabled = false;
    cancelBtn.disabled = false;
    const computedStyle = window.getComputedStyle(NewNoteForm);
    const visibility = computedStyle.getPropertyValue('visibility');
    if (visibility == "hidden") {
        NewNoteForm.style.visibility = "visible";
        NewNoteForm.style.backgroundColor = "navy";
        NewNoteForm.style.opacity = 1;
    }
    HideNewNotePaneOnClickOutside();
});

Array.from(options).forEach(Optionsfunction);
function Optionsfunction(element) {
    element.addEventListener("mouseover", () => {
        element.style.cursor = "pointer";
        element.style.backgroundColor = "lightGrey";
    });
    element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "white";
    });
}
function DisplayOptionsPaneOnClick(element) {
    element.addEventListener("click", (event) => {
        const optionsPane = element.nextElementSibling;
        event.stopPropagation();
        if (optionsPane) {
            const computedStyle = window.getComputedStyle(optionsPane);
            const visibility = computedStyle.getPropertyValue('visibility');
            const optionsBtns = optionsPane.children;
            const deleteBtn = Array.from(optionsBtns)[1];
            const CurrentNoteHeading = optionsPane.nextElementSibling.innerHTML.trim();
            deleteBtn.addEventListener("click", () => {
                const xhr = new XMLHttpRequest();
                xhr.open("DELETE", "/deleteNote", true);
                xhr.setRequestHeader("Content-type", "application/json");
                const data = JSON.stringify({
                    CurrentNoteHeading: CurrentNoteHeading
                });
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        // Note successfully deleted
                        window.location.href = "/home";
                    }
                    else {
                        console.error("Error deleting note:", xhr.responseText);
                    }
                }
                xhr.send(data);
            })
            if (visibility == "hidden") {
                optionsPane.style.visibility = "visible";
                optionsPane.style.opacity = 1;
            }
            else {
                optionsPane.style.visibility = "hidden";
                optionsPane.style.opacity = 0;
            }
            document.addEventListener("click", (event) => {
                const targetElement = event.target;
                if (!optionsPane.contains(targetElement)) {
                    optionsPane.style.visibility = "hidden";
                    optionsPane.style.opacity = 0;
                }
            });
        }
    });

    element.addEventListener("mouseover", () => {
        element.style.backgroundColor = "lightgrey";
    });
    element.addEventListener("mouseout", () => {
        element.style.backgroundColor = "white";
    });
}
Array.from(options_btn).forEach(DisplayOptionsPaneOnClick);

function HideNewNotePaneOnClickOutside() {
    document.addEventListener("click", (event) => {
        const targetElement = event.target;
        const isClickInside = NewNoteForm.contains(targetElement);
        if (!isClickInside) {
            NewNoteForm.style.visibility = "hidden";
            NewNoteForm.style.opacity = 0;
        }
    });
}