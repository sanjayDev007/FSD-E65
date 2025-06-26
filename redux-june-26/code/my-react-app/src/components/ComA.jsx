import React from 'react'
import ComB from './ComB'
import { useSelector } from 'react-redux'
function ComA() {
    const count = useSelector((state) => state.count)
  return (
    <>
    Component A
    count: {count}
    <br />
    <ComB/>
    </>
  )
}

export default ComA