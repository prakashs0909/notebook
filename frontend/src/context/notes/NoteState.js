import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState =(props)=>{
    const host = "http://localhost:5001"

    const notesinitial =[]

    const [notes, setnotes ] = useState(notesinitial)

    // get user all notes
    const getAllNotes = async()=>{
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET", 
      headers: {
        "Content-Type": "multipart/form-data",
        "auth-token": localStorage.getItem('token')
      }, 
    });
    const json = await response.json();
    setnotes(json)
    // console.log(json);
    }

    // Add a note
    const addNote = async(formData)=>{
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST", 
      headers: {
        "auth-token": localStorage.getItem('token')
      },
      body: formData, 
    });
    const note = await response.json();
    setnotes(notes.concat(note));
    }

    // Delete a note
    const deleteNote = async(id)=>{
      const newNote = notes.filter((note)=>{return note._id !== id})
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "multipart/form-data",
          "auth-token": localStorage.getItem('token')
        }, 
      });
      const json = await response.json();
      console.log(json);
      setnotes(newNote)
    }

    // Edit a note
    const editNote = async(id, title, content)=>{  
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "Put", 
      headers: {
        "Content-Type": "multipart/form-data",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, content}), 
    });
    const json = await response.json();
    console.log(json);

    let newNote = JSON.parse(JSON.stringify(notes))
    // logic to edit in client
      for (let index = 0; index < newNote.length; index++) {
        const element = newNote[index];
        if (element._id=== id) {
          newNote[index].title = title;
          newNote[index].content = content;
          break;
        } 
      }
      setnotes(newNote)
    }

    return(
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;