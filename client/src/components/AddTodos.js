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
    onCompleted: (data) => setTodo(data.getTodo),
  });

  const inputAreaRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (!inputAreaRef.current.contains(e.target)) {
        console.log('Outside input area');
        setSelectedId(0);
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
    if(todo.title == ""){
      alert('Please Enter The Title');
      return;
    }
    e.preventDefault();
    if (selectedId === 0) {
      addTodo({
        variables: {
          title: todo?.title, // Add the null check using the optional chaining operator
          detail: todo?.detail,
          date: todo?.date,
        },
      });
    } else {
      updateTodo({
        variables: {
          id: selectedId,
          title: todo?.title,
          detail: todo?.detail,
          date: todo?.date,
        },
      });
    }
  };



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error occurred</div>;
  }

  return (
    <form onSubmit={onSubmit} ref={inputAreaRef}>
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter title"
          value={todo.title}
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Detail:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter detail"
          value={todo.detail}
          onChange={(e) => setTodo({ ...todo, detail: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          className="form-control"
          value={todo.date}
          onChange={(e) => setTodo({ ...todo, date: e.target.value })}
        />
      </div>
      <button type="submit" className="btn btn-default">
        {selectedId === 0 ? 'Add' : 'Update'}
      </button>
    </form>
  );
};

export default AddTodos;