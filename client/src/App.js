import React, { useState } from 'react';
import './App.css';
import { useQuery } from '@apollo/client';
import { GET_TODOS } from './graphql/Query';
import AddTodos from './components/AddTodos';
import Todo from './components/Todo';
import { TodoContext } from './TodoContext';

function App() {
  const [selectedId, setSelectedId] = useState(0);
  const { loading, error, data } = useQuery(GET_TODOS);

  const backgroundImage = 'https://i.pinimg.com/originals/5d/27/cf/5d27cf2f04ff38b851c3701bc2682683.jpg';
  if (loading) return <div className='fs-6 fw-bolder customCard p-3 bg-white'>Chờ chút...</div>;
  if (error) return <p>{error.message}</p>;

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
                <div className='fs-5 fw-bolder mb-3 text-center'>
                  Danh sách công việc
                </div>
                <div className="row px-0 mx-0">
                  {data?.getTodos.map((todo) => (
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
    </TodoContext.Provider>
  );
}

export default App;