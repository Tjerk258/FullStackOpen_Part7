import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import { useField } from './hooks'

// const Menu = () => {
//   const padding = {
//     paddingRight: 5
//   }
//   return (
//     <div>
//       <a href='#' style={padding}>anecdotes</a>
//       <a href='#' style={padding}>create new</a>
//       <a href='#' style={padding}>about</a>
//     </div>
//   )
// }

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id}><Link  to={`/anecdotes/${anecdote.id}`} >{anecdote.content}</Link></li>)}
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => {

  return (
    <div>
      <div>{anecdote.content}</div>
      <div>{anecdote.author}</div>
      <a href={anecdote.info}>{anecdote.info}</a>
      <div>{anecdote.votes}</div>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const [inputContent, resetContent, content] = useField('text')
  const [inputAuthor, resetAuthor, author] = useField('text')
  const [inputInfo, resetInfo, info] = useField('text')
  
  const navigate = useNavigate()


  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content,
      author,
      info,
      votes: 0
    })
    navigate('/')
  }

  const resetValues = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...inputContent} />
        </div>
        <div>
          author
          <input {...inputAuthor} />
        </div>
        <div>
          url for more info
          <input {...inputInfo} />
        </div>
        <button>create</button>
      </form>
      <button onClick={resetValues}>reset</button>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notifications, setNotifications] = useState([])

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotificationTimeout(`you crreated the new anecdote ${anecdote.content}`, 5000)
  }

  const setNotificationTimeout = (notification, timeout) => {
    const notificationObject = {notification: notification, id: Math.round(Math.random() * 10000)}
    setNotifications(notifications.concat(notificationObject))
    setTimeout(() => deleteNotification(notificationObject.id), timeout)
  }

  const deleteNotification = (id) => {
    setNotifications(oldNotifications => oldNotifications.filter(arrayNotification => arrayNotification.id !== id))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const match = useMatch('/anecdotes/:id')
  const anecdote = match
    ? anecdotes.find(note => note.id === Number(match.params.id))
    : null

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }
  
  const linkStyle = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={linkStyle} to="/">Anecdotes</Link>
        <Link style={linkStyle} to="/create-new">Create New</Link>
        <Link style={linkStyle} to="/about">About</Link>
        {/* <Link style={Link} to='/'>home</Link> */}
      </div>

      {notifications.map(notification => <div key={notification.id}>{notification.notification}</div>)}

      <Routes>
        <Route path='/anecdotes/:id' element={<Anecdote anecdote={anecdote} />} />
        <Route path='/create-new' element={<CreateNew addNew={addNew} />} />
        <Route path='/about' element={<About />} />
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
      </Routes>

      {/* <div> */}
        {/* <h1>Software anecdotes</h1>
        <Menu />
        <AnecdoteList anecdotes={anecdotes} />
        <About />
        <CreateNew addNew={addNew} /> */}
        <Footer />
      {/* </div> */}
    </div>
  )
}

export default App
