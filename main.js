// const moment = require("moment")

// GET("http://localhost:3000/notes/")
const url = 'http://localhost:3000/notes/'
const form = document.querySelector('#notes-field')
const notesTaken = document.querySelector('#notes-taken')



// form.addEventListener('submit', function(event) {
//     event.preventDefault()
//     const noteText = document.querySelector('#notes-text')
//     createNote(noteText)
// })

// function createNote() {
//     const noteText = document.querySelector('#notes-text').value
// // creating a variable and assigning it the value (the user input) of the notes-text id
// // for the <input> tag inside the form-field div
//     fetch(url, {
//         method: 'POST',
//         headers: {'Content-type': 'application/json'},
//         body: JSON.stringify({
//             text: "this is a note"
//         })
//         .then(response => response.json())
//         .then()
//     })
// }






//? rewrite of Amy's example

form.addEventListener('submit', function (event) {
    event.preventDefault()
    const notesText = document.querySelector('#notes-text').value
// creating a variable to hold the value of the id "notes-text". selects it and takes it's value
    createNote(notesText)
// using this function on the value of the variable above
})
// these event listeners "listen" for a click then depending on what is in the class name of the 
// target value will then use one of these functions. for example, if the class name contains 
// the word 'delete' then this first listener will launch its event and call the function
notesTaken.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete')) {
        deleteNote(event.target)
    }
    if (event.target.classList.contains('edit')) {
        editNote(event.target)
    }
    if (event.target.classList.contains('update-note')) {
        updateNote(event.target)
    }
    if (event.target.classList.contains('cancel')) {
        cancelNote(event.target.parentElement)
    }
})


function listNotes () {
// This function makes a later function result become part of the json data
// otherwise I am unclear exactly what this function does 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            for (let note of data) {
                console.log(note)
                renderNoteItem(note)
            }
    })
}


function createNote(noteText) {
    fetch(url, {
// created a function to call on later. using the 'POST' function for json this function
// will be adding values to the live server
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            item: noteText,
            created_at: moment().format()
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        renderNoteItem(data)
// calling a function that will do something to the data element
    })
}

// this function only acts if the earlier eventlisteners are fired for this function
function deleteNote(element) {
    const noteId = element.parentElement.id 
// this selects the parent element of a specific variable. 
    fetch(`http://localhost:3000/notes/${noteId}`, {
// makes this fetch request able to vary based on the variable sent then to be able to
// use a function on it.
        method: 'DELETE'
// uses the json behavior of 'delete' to get rid of notes that were made
    }) .then(function() {
        element.parentElement.remove()
// removes the parent element of the selected variable
    })
}

// this function only acts if the earlier eventlisteners are fired for this function
function updateNote(element) {
    const noteId = element.parentElement.id
// selecting an id and applying a variable name to it
    const noteText = document.querySelector('.edit-text')
// selecting a tag in the HTML and applying a variable name to it to be used
    fetch(`http://localhost:3000/notes/${noteId}`, {
        method: 'PATCH',
// I believe in this use 'PATCH' will act like both 'POST' and 'DELETE' by submitting new
// data to json but also maybe getting rid of other information. kinda like '.replace()'
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            item: noteText.value,
// just assigning a value to this key pair
            updated_at: moment().format()
// this I think it used to format certain information we will give it later
        })
    })
        .then(function(response) {
            return response.json()
        })
        .then(function(data){
            console.log(data)
            renderNoteText(element.parentElement, data)
// performing a function on some data and an element, a bit hard to follow where all the
// information for this one is coming from and what it will look like where it lands
        }) 
}


function renderNoteItem(noteObj) {
    const itemEl = document.createElement('li')
// making a <p> tag and assigning it a variable
    itemEl.id = noteObj.id
// appyling the id to both elements
    itemEl.classList.add('note-item')
// adding a class to the itemEl
    renderNoteText(itemEl, noteObj)
// using the function defined later on these two elements
    notesTaken.appendChild(itemEl)
// adding the itemEl element to the parent element notesTaken
    clearInputs()
// after adding the element it will clear the input
}

function renderNoteText (notesTakenItem, noteObj) {
    notesTakenItem.innerHTML = `<span class="text-item">${noteObj.item}</span>
    <i class="delete"></i><i class="edit"></i>`
}

function editNote(element) {
    showEditInput(element.parentElement)
}

function showEditInput(noteItem) {
    noteItem.innerHTML = `
        <input class="edit-text" type="text" value="${noteItem.textContent}" autofocus>
        <button class="update-note" data-note=${noteItem.id}>save note</button>
        <button class="cancel">cancel</button>`
    noteItem.querySelector('input').select()
}

function hideEditInput(noteItem) {
    fetch(`http://localhost:3000/notes/${noteItem.id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            renderNoteText(noteItem, data)
        })
}

function clearInputs() {
    const input = document.queryCommandEnabled('input')
    input.value = ''
    // for (let field of inputs) {
    //     field.value = ''
    // }
}

listNotes()




// ULTRA IMPORTANT, DO NOT DELETE!

// fetch("http://localhost:3000/notes/", {
//     method: 'POST',
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify({"title": "Hi", "body": "COOL"})
// })
// .then(response => response.json())
// .then()
