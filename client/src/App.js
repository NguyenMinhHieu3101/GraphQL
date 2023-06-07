import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { useQuery } from '@apollo/client';
import { GET_TODOS } from './graphql/Query';
import AddTodos from './components/AddTodos';
import Todo from './components/Todo';
import { TodoContext } from './TodoContext';

function App() {
  const [selectedId, setSelectedId] = useState(0);
  const { loading, error, data } = useQuery(GET_TODOS);

  const [searchValue, setSearchValue] = useState('');

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (data) {
      if (searchValue == '') {
        setTodos(data.getTodos);
      }
      else if (/\d/.test(searchValue)) {
        var temp = data.getTodos?.filter(todo => todo.date.includes(searchValue.toLowerCase()));
        setTodos(temp);
      }
      else {
        var temp = data.getTodos?.filter(todo => todo.title.toLowerCase().includes(searchValue.toLowerCase()) || todo.detail.toLowerCase().includes(searchValue.toLowerCase()));
        setTodos(temp);
      }
      setSelectedId(0);
    }
  }, [searchValue, data]);

  const backgroundImage = 'https://i.pinimg.com/originals/5d/27/cf/5d27cf2f04ff38b851c3701bc2682683.jpg';
  if (loading) return <div className='fs-6 fw-bolder customCard p-3 bg-white'>Chờ chút...</div>;
  if (error) return <p>{error.message}</p>;
  if (loading) {
    setTodos(data.getTodos);
  }
  return (
    <TodoContext.Provider value={{ selectedId, setSelectedId }}>
      <div className="container-fluid py-5"
        style={{
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: 1,
          minHeight: '100vh',
        }}

      >
        <div className='container'>
          <div className='fs-3 fw-bolder p-3 mb-3 text-center customCard text-white primaryColor'
          >Todo List</div>

          <div className='row justify-content-center align-items-start'>
            <div className='col-12 col-md-6 mb-3'>
              <AddTodos />
            </div>

            <div className='col-12 col-md-6'>
              <div className='pt-3 customCard tertiaryColor' >
                <div className='fs-4 fw-bolder pb-3 text-center '>
                  Danh sách công việc
                </div>
                <div className='px-3 borderBottom'>
                  <div className="input-group mb-3 customInput">
                    <span className="input-group-text bg-white" >
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="form-control fs-5 fw-bolder" placeholder="Tìm kiếm" />
                  </div>
                </div>
                <div className="row px-0 mx-0">
                  {todos.map((todo) => (
                    <Todo
                      key={todo.id}
                      id={todo.id}
                      title={todo.title}
                      detail={todo.detail}
                      date={todo.date}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </TodoContext.Provider >
  );
}

export default App;