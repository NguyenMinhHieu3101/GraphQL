import React, { useState, useContext } from 'react'
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { DELETE_TODO } from '../graphql/Mutation';
import { GET_TODOS } from '../graphql/Query';
import { TodoContext } from '../TodoContext';


const Todo = ({ id, title, date, detail, bgColor }) => {
  const { selectedId, setSelectedId } = useContext(TodoContext)
  const [deleteTodo] = useMutation(DELETE_TODO);
  const removeTodo = (id) => {
    const result = window.confirm("Bạn chắc chắn muốn xóa?");
    if (result) {
      deleteTodo({
        variables: {
          id: id
        }, refetchQueries: [
          {
            query: GET_TODOS
          }
        ]
      })
    } else {
      // user clicked cancel
    }

  }
  return (
    <div className=" col-12 p-3 contentBgColor borderBottom contentHover"
      style={{
        cursor: 'pointer',
        backgroundColor: selectedId === id ? 'rgba(255, 255, 255, 1)' : new Date(date) < new Date() ? 'rgba(254, 161, 161, 0.07)' : '',
        boxShadow: selectedId === id ? 'rgba(17, 17, 26, 0.1) 0px 8px 24px,rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px' : '',
      }}>
      <div className='row align-items-center justify-content-between'>
        <div onClick={() => setSelectedId(id)}
          className='col'
        >
          <div className='mb-0 fs-5 fw-bolder'
            style={{
              color: selectedId === id ? 'black' : ''
            }}
          >{title}</div>
          <div className='mb-1 fs-6 '
            style={{
              color: selectedId === id ? 'black' : ''
            }}
          >{moment(date).format(`DD/MM/YYYY`)}</div>
          <div className='text-break fs-6'
            style={{
              color: selectedId === id ? 'black' : ''
            }}
          >{detail}</div>
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