const express = require('express')
const app = express()
const morgan = require('morgan')

let persons=[
  { 
    name: "Arto Hellas", 
    number: "040-123456",
    id: 1
  },
  { 
    name: "Ada Lovelace", 
    number: "39-44-5323523",
    id: 2
  },
  { 
    name: "Dan Abramov", 
    number: "12-43-234345",
    id: 3
  },
  { 
    name: "Mary Poppendieck", 
    number: "39-23-6423122",
    id: 4
  }
]

morgan.token('body',(req,res)=>{
  return JSON.stringify(req.body)
})

app.use(express.json())

app.use(morgan(':method :url :status :response-time ms :body'))


  app.get('/api/persons',(request,response)=>{
    response.json(persons)
  })

  const generateId=()=>{
    const maxId = Math.floor(Math.random()*10000);
    return maxId  
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if(!body.name){
      return response.status(404).json({
        error:'missing name'
      })
    }
    if(!body.number){
      return response.status(404).json({
        error:'missing number'
      })
    }
    
    if(persons.find(person=>person.name===body.name)){
      return response.status(404).json({
        error:'name must be unique'
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons=persons.concat(person)
  
    response.json(person)
  })

    
  app.get('/api/persons/:id',(request,response)=>{
    const id= Number(request.params.id)
    const person = persons.find(person=>person.id===id)
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id',(request,response)=>{
    const id= Number(request.params.id)
    
    persons=persons.filter(person=>person.id!==id)
    response.status(204).end()
  })

  app.get('/info',(request,response)=>{
    const date = new Date()
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
        </div>
        `
    )
  })




const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})