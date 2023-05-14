import React,{useEffect,useState} from 'react'
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css'; 
import Navbar from './Navbar';
const modules = {toolbar:[
 
  
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote'],

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'font': [] }],


  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  // [{ 'direction': 'rtl' }],                         // text direction

 

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'align': [] }],

  ['link', 'image']
  // ['clean']                                         // remove formatting button
]};

function Editor() {

    const [value,setValue]=useState();

   


  return (
    <div>
            <div id="container">
                <Navbar></Navbar>
                <ReactQuill theme="snow" 
                   value={value}
                   onChange={setValue}
                   className="editor-input"
                   modules={modules} 
                   />
            </div>
        </div>
  )
}

export default Editor