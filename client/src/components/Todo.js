import React, { useState, useContext } from 'react'
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { DELETE_TODO } from '../graphql/Mutation';
import { GET_TODOS } from '../graphql/Query';
import { TodoContext } from '../TodoContext';


const Todo = ({ id, title, date, detail }) => {
  const { selectedId, setSelectedId } = useContext(TodoContext)
  const [deleteTodo] = useMutation(DELETE_TODO);
  const removeTodo = (id) => {
    deleteTodo({
      variables: {
        id: id
      }, refetchQueries: [
        {
          query: GET_TODOS
        }
      ]
    })
  }
  return (
    <div className=" col-12 p-3 list-group-item-action contentBgColor"
      style={{
        cursor: 'pointer',
        backgroundColor: selectedId === id ? 'white' : '',
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
      }}>
      <div className='row align-items-center justify-content-between'>
        <div onClick={() => setSelectedId(id)} className='col'>
          <div className='mb-0 fs-5 fw-bolder' >{title}</div>
          <div className='text-muted mb-1 fs-6 '>{moment(date).format(`DD/MM/YYYY`)}</div>
          <div className='text-break fs-6'>{detail}</div>
        </div>
        <div className='col-auto'>
          <button
            onClick={() => removeTodo(id)}
            style={{ color: 'grey', backgroundColor: 'transparent', border: 'none' }}
            onMouseOver={(e) => { e.target.style.opacity = '0.5'; }}
            onMouseOut={(e) => { e.target.style.opacity = '1'; }}
            type="button">
            <i className="fa-solid fa-trash-can" style={{ pointerEvents: 'none' }}></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Todo