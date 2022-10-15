// const http = require('http')
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(express.json())
app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id)
    .then((note) => {
      if (note) return response.send(note)
      response.status(404).end()
    })
    .catch((err) => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => response.json(result))
    .catch((err) => next(err))
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  Note.findByIdAndDelete(id)
    .then((result) => response.status(204).end())
    .catch((err) => next(err))
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'require "content" field is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: note.important ?? false,
    date: new Date().toISOString()
  })

  newNote.save().then((savedNote) => {
    response.json(savedNote)
  })

  response.status(201).json(newNote)
})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
