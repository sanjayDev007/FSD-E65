import React from 'react'
import './GlowButton.css'
function GlowButton() {
  return (
    <button className="uiverse">
    <div className="wrapper">
      <span>UIVERSE</span>
      <div className="circle circle-12" />
      <div className="circle circle-11" />
      <div className="circle circle-10" />
      <div className="circle circle-9" />
      <div className="circle circle-8" />
      <div className="circle circle-7" />
      <div className="circle circle-6" />
      <div className="circle circle-5" />
      <div className="circle circle-4" />
      <div className="circle circle-3" />
      <div className="circle circle-2" />
      <div className="circle circle-1" />
    </div>
  </button>
  )
}


function TestGlow() {
  return (
    <div className="test-glow">
      Hello
    </div>
  )
}

export { TestGlow }


export default GlowButton