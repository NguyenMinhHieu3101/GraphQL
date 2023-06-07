import { useMutation, useQuery } from '@apollo/client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { ADD_TODO, UPDATE_TODO } from '../graphql/Mutation';
import { GET_TODO, GET_TODOS } from '../graphql/Query';
import { TodoContext } from '../TodoContext';

const AddTodos = () => {
  const { selectedId, setSelectedId } = useContext(TodoContext);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [todo, setTodo] = useState({
    title: '',
    detail: '',
    date: '',
  });
  const { loading, error, data, refetch } = useQuery(GET_TODO, {
    variables: { id: selectedId },
    skip: selectedId === 0, // Skip the query if selectedId is 0
    onCompleted: (data) => { console.log(data); setTodo(data.getTodo) },
  });

  const inputAreaRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (inputAreaRef.current && !inputAreaRef.current.contains(e.target)) {
        console.log('Outside input area');
        setSelectedId(0);
        setTodo({
          title: '',
          detail: '',
          date: '',
        })
      } else {
        console.log('Inside input area');
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [setSelectedId]);

  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => {
      setTodo({
        title: '',
        detail: '',
        date: '',
      });
    },
    refetchQueries: [{ query: GET_TODOS }] // Add this line to refetch the GET_TODOS query after adding a new todo
  });


  const onSubmit = (e) => {
    e.preventDefault();
    if (todo.title == "") {
      alert('Vui lòng nhập tiều đề!');
      return;
    }
    if (selectedId === 0) {
      addTodo({
        variables: {
          title: todo?.title, // Add the null check using the optional chaining operator
          detail: todo?.detail,
          date: todo?.date,
        },
      });
      alert('Thêm thành công');
    } else {
      updateTodo({
        variables: {
          id: selectedId,
          title: todo?.title,
          detail: todo?.detail,
          date: todo?.date,
        },
      });
      alert('Chỉnh sửa thành công');
    }
  };



  if (loading) {
    return <div className='fs-6 fw-bolder customCard p-3 bg-white'>Chờ chút...</div>;
  }

  if (error) {
    return <div>Error occurred</div>;
  }

  return (
    <div className='customCard pt-3 secondaryColor'>
      <div className='fs-4 fw-bolder pb-3 text-center borderBottom'>
        Công việc
      </div>
      <form onSubmit={onSubmit} ref={inputAreaRef} className='d-flex flex-column p-3 contentBgColor'
      >
        <div className="form-group mb-3">
          <label className='fs-5 fw-bolder mb-2'>Tiêu đề:</label>
          <input
            type="text"
            className="form-control customInput fs-6 fw-bolder"
            placeholder="Nhập tiêu đề"
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label className='fs-5 fw-bolder mb-2'>Thời hạn:</label>
          <input
            type="date"
            className="form-control customInput fs-6"
            value={todo.date.split('T')[0]}
            onChange={(e) => setTodo({ ...todo, date: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label className='fs-5 fw-bolder mb-2'>Chi tiết:</label>
          <textarea
            type="text"
            className="form-control customInput fs-6"
            style={{
              minHeight: '100px',
            }}
            placeholder="Chi tiết công việc"
            value={todo.detail}
            onChange={(e) => setTodo({ ...todo, detail: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary flex-fill mt-3 fs-5 fw-bolder customInput buttonBgColor"
          style={{
            border: 'none',
          }}
          onMouseOver={(e) => { e.target.style.opacity = '0.5'; }}
          onMouseOut={(e) => { e.target.style.opacity = '1'; }}
        >
          {selectedId === 0 ? 'Thêm' : 'Chỉnh sửa'}
        </button>
      </form>
    </div>
  );
};

export default AddTodos;