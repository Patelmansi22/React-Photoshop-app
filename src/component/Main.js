import React, { useState } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import "../style/main.scss";
import { GrRotateLeft, GrRotateRight } from "react-icons/gr";
import { CgMergeVertical, CgMergeHorizontal } from "react-icons/cg";
import {  IoIosImage } from "react-icons/io";


const Main = () => {
  const filterElement = [
    {
      name: 'brightness',
      maxValue: 200
    },
    {
      name: 'grayscale',
      maxValue: 200
    },
    {
      name: 'sepia',
      maxValue: 200
    },
    {
      name: 'saturate',
      maxValue: 200
    },
    {
      name: 'contrast',
      maxValue: 200
    },
    {
      name: 'hueRotate'
    }
  ]
  const [details, setDetails] = useState('')
  const [crop, setCrop] = useState()
  const [state, setState] = useState({
    image: '',
    brightness: 100,
    grayscale: 0,
    sepia: 0,
    saturate: 100,
    contrast: 100,
    hueRotate: 0,
    rotate: 0,
    vertical: 1,
    horizontal: 1
  })
  const [property, setProperty] = useState(
    {
      name: 'brightness',
      maxValue: 200
    }
  )

  const inputHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }
  const leftRotate = () => {
    setState({
      ...state,
      rotate: state.rotate - 90
    })
  }
  const rightRotate = () => {
    setState({
      ...state,
      rotate: state.rotate + 90
    })
  }
  const verticalFlip = () => {
    setState({
      ...state,
      vertical: state.vertical === 1 ? -1 : 1
    })
  }
  const horizontalFlip = () => {
    setState({
      ...state,
      horizontal: state.horizontal === 1 ? -1 : 1
    })
  }
  const imageHandler = (e) => {
    if (e.target.files.length !== 0) {
      const reader = new FileReader()
      reader.onload = () => {
        setState({
          ...state,
          image: reader.result
        })
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }
  const cropImage = () => {
    const canvas = document.createElement('canvas')
    const scaleX = details.naturalWidth / details.width
    const scaleY = details.naturalHeight / details.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      details,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )
    const base64Url = canvas.toDataURL('image/png')

    setState({
      ...state,
      image: base64Url
    })

  }
  const saveImage = () => {
    const canvas = document.createElement('canvas')
    canvas.width = details.naturalHeight
    canvas.height = details.naturalHeight
    const ctx = canvas.getContext('2d')

    ctx.filter = `brightness(${state.brightness}%) grayscale(${state.grayscale}%) 
    sepia(${state.sepia}%)saturate(${state.saturate}%)contrast(${state.contrast}%)
    hue-rotate(${state.hueRotate}deg)`

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(state.rotate * Math.PI / 180)
    ctx.scale(state.vertical, state.horizontal)


    ctx.drawImage(
      details,
      -canvas.width /2,
      -canvas.height/2 ,
      canvas.width,
      canvas.height
    )
    const link = document.createElement('a')
    link.download = 'image_edit.png'
    link.href = canvas.toDataURL()
    link.click()
  }
  const reset =()=>{
    window.location.reload();
  }
  return (
    <div className='image_editor'>
      <div className='card'>
        <div className='card_header'>
          <h2>----Photoshop----</h2>
        </div>
        <div className='card_body'>
          <div className='sidebar'>
            <div className='side_body'>
              <div className='filter_section'>
                <span>Filters</span>
                <div className='filter_key'>
                  {filterElement.map((val, i) => {
                    return (<button className={property.name === val.name ? 'active' : ''} onClick={() => setProperty(val)} key={i}>{val.name}</button>
                    )

                  })}
                </div>
              </div>
              <div className='filter_silder'>
                <div className='label_bar'>
                  <label htmlFor='range'>Rotate</label>

                </div>
                <input name={property.name} onChange={inputHandler} value={state[property.name]} max={property.maxValue} type="range" />
              </div>
              <div className='rotate'>
                <label htmlFor=''>Rotate & Flip</label>
                <div className='icon'>
                  <div id='icons' onClick={leftRotate}><GrRotateLeft /></div>
                  <div id='icons' onClick={rightRotate}><GrRotateRight /></div>
                  <div id='icons' onClick={verticalFlip}><CgMergeVertical /></div>
                  <div id='icons' onClick={horizontalFlip}><CgMergeHorizontal /></div>

                </div>
              </div>
            </div>
            <div className='reset'>
              <button onClick={reset} className='set'>Reset</button>
              <button onClick={saveImage} className='save'>Save Image</button>
            </div>
          </div>
          <div className='image_section'>
            <div className='image'>
              {state.image ? <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                <img id='image' onLoad={(e) => setDetails(e.currentTarget)} style={{
                  filter: `brightness(${state.brightness}%) grayscale(${state.grayscale}%) 
            sepia(${state.sepia}%)saturate(${state.saturate}%)contrast(${state.contrast}%)
            hue-rotate(${state.hueRotate}deg)`, transform: `rotate(${state.rotate}deg) scale(${state.vertical}, 
            ${state.horizontal} )`
                }} src={state.image} alt='' />
              </ReactCrop> :
                <label htmlFor='choose'>
                  <IoIosImage />
                  <span>Choose Image</span>
                </label>
              }

            </div>
            <div className='image_select'>
              {/* <button onClick={undo} className='undo' ><IoMdUndo /></button>
              <button className='redo'><IoMdRedo /></button> */}
              {crop && <button onClick={cropImage} className='crop'>Crop Image</button>}
              <label htmlFor='choose'>Choose Image</label>
              <input onChange={imageHandler} type="file" id='choose' />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Main