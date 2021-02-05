const moment = require("moment")

// GET("http://localhost:3000/notes/")
const url = 'http://localhost:3000/notes/'
const form = document.querySelector('#notes-field')
const notesTaken = document.querySelector('#notes-taken')

form.addEventListener('submit', function (event) {
    event.preventDefault()
    const notesText = document.querySelector('#notes-text').value
    createNote(notesText)
})

notesTaken.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete')) {
        deleteNote(event.target)
    }
    if (event.target.classList.contains('edit')) {
        editNote(event.target)
    }
    if (event.target.classList.contains('update-todo')) {
        updateNote(event.target)
    }
    if (event.target.classList.contains('cancel')) {
        cancelNote(event.target)
    }
// })

function listNotes () {
    fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            for (let note of data) {
                console.log(note)
                renderNoteText(note)
            }
        })
}

function createNote(noteText) {
    fetch(url, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            text: noteText,
            created_at: moment().format()
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        renderNoteText(data)
    })
}

function deleteNote(element) {
    const noteId = element.parentElement.id
    fetch(`http://localhost:3000/notes/${noteId}`, {
        method: 'DELETE'
    }) .then(function() {
        element.parentElement.remove()
    })
}

function updateNote(element) {
    const noteId = element.parentElement.id
    const noteText = document.querySelector('.edit-text')
    fetch(`http://localhost:3000/notes/${noteId}`, {
        method: 'PATCH',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            text: noteText.value,
            updated_at: moment().format()
        })
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data){
            console.log(data)
            renderNoteText(element.parentElement, data)
        })
}

function renderNoteText(noteObj) {
    const itemEl = document.createElement('p')
    itemEl.id = noteObj.id
    itemEl.classList.add('note-item')
    renderNoteText(itemEl, noteObj)
    notesTaken.appendChild(itemEl)
    clearInputs()
}

function renderNoteText (notesTakenItem, noteObj) {
    notesTakenItem.innerHTML = `<span class="text-item">${noteObj.text}</span>`
}

function editNote(element) {
    showEditInput(element.parentElement)
}

function showEditInput(noteItem) {
    noteItem.innerHTML = `
        <input class="edit-text" type="text" value="${noteItem.textContent}" autofocus>
        <button class="update-note" data-note=${noteItem.id}>save note</button>
        <button class="cancel-note">cancel</button>`
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
    const inputs = document.queryCommandEnabled('input')
    for (let field of inputs) {
        field.value = ''
    }
}

listNotes()





//! BACK UP! DON'T TOUCH
// fetch("http://localhost:3000/notes/", {
//     method: 'POST',
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify({"title": "Hi", "body": "COOL"})
// })
// .then(response => response.json())
// .then()
//! BACK UP! DON'T TOUCH