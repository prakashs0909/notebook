import React, { useContext,useState } from 'react'
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';
import Addnote from './Addnote'
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(noteContext);
    const {notes, getAllNotes, editNote}= context;
    const ref = useRef(null);
    const refclose = useRef(null);
    let nevigate = useNavigate();
    const [note, setnotes] = useState({id:"", etitle: "", econtent: ""})
    
    useEffect(()=>{
      if (localStorage.getItem("token")) {
        getAllNotes();
        
      } else {
        nevigate("/login")
      }
      // eslint-disable-next-line
    },[])

    const updateNote=(currentNote)=>{
        ref.current.click()
        setnotes({id: currentNote._id, etitle: currentNote.title, econtent: currentNote.content})
    }
    const handleclick=()=>{
      editNote(note.id, note.etitle, note.econtent);
      refclose.current.click()
      props.showalert("Updated successfully", "success")
    }
    const onchange=(e)=>{
        setnotes({...note, [e.target.name]: e.target.value})
    }

  return (
    <>
    
    <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>

    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onchange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">content</label>
                <input type="text" className="form-control" id="econtent" name="econtent" value={note.econtent} onChange={onchange}/>
              </div>
              
            </form>
          </div>
          <div className="modal-footer">
            <button ref={refclose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button  onClick={handleclick} type="button" className="btn btn-primary">Update Note</button>
          </div>
        </div>
      </div>
    </div>

    <div className='row my-3'>
      <h1 className='text-2xl font-bold'>Your Notes</h1>
      <div className='container mx-2'>
      {notes.length===0 && 'No notes to display'}
      </div>
      {notes.length>0 && notes.map((note)=>{
        return <Noteitem key={note._id} updateNote={updateNote} showalert={props.showalert} note={note}/>;
      })}
    </div>
    <Addnote showalert={props.showalert}/>
    </>
  )
}

export default Notes
