import React, { useContext, useState } from 'react';
import noteContext from '../context/notes/noteContext';

const Addnote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const [note, setNotes] = useState({ title: '', content: '' });
  const [files, setFiles] = useState([]);
 
  // const [audioText, setAudioText] = useState('');
  // const [isRecording, setIsRecording] = useState(false);
  // const recognitionRef = useRef(null);

  // Initialize Web Speech API
  // const initializeSpeechRecognition = () => {
  //   if (!('webkitSpeechRecognition' in window)) {
  //     alert('Web Speech API not supported in this browser');
  //     return;
  //   }
  //   const SpeechRecognition = window.webkitSpeechRecognition;
  //   recognitionRef.current = new SpeechRecognition();
  //   recognitionRef.current.lang = 'en-US';
  //   recognitionRef.current.interimResults = true;

  //   recognitionRef.current.onresult = (event) => {
  //     const transcript = event.results[0][0].transcript;
  //     setAudioText(transcript);
  //   };

  //   recognitionRef.current.onend = () => {
  //     setIsRecording(false);
  //   };
  // };

  // Start/Stop Audio Recording
  // const toggleAudioRecording = () => {
  //   if (isRecording) {
  //     recognitionRef.current.stop();
  //   } else {
  //     recognitionRef.current.start();
  //   }
  //   setIsRecording(!isRecording);
  // };

  

  const handleClick = (e) => {
    e.preventDefault();
    const title = note.title.trim();
    const content = (note.content || '').trim();
    
    if (!title && !content) {
      props.showalert('Please add some details before submitting!', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    addNote(formData);
    setNotes({ title: '', content: '' });
    setFiles([]);
    // setAudioText('');
    props.showalert('Added Note successfully', 'success');
  };

  return (
    <div className='container my-4'>
      <h1 className='text-2xl'>Add a Note</h1>
      <form encType='multipart/form-data'>
        <div className='mb-3'>
          <label htmlFor='title' className='form-label'>Title</label>
          <input type='text' className='form-control' id='title' name='title' value={note.title} onChange={(e) => setNotes({ ...note, title: e.target.value })} />
        </div>
        <div className='mb-3'>
          <label htmlFor='content' className='form-label'>Content</label>
          <textarea className='form-control' id='content' name='content' value={note.content} onChange={(e) => setNotes({ ...note, content: e.target.value })} />
        </div>

        {/* <div className='mb-3'>
          <label htmlFor='audioText' className='form-label'>Audio Transcription</label>
          <textarea className='form-control' id='audioText' value={audioText} readOnly />
          <button type='button' className='btn btn-secondary mt-2' onClick={toggleAudioRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div> */}
        <div className='mb-3'>
          <label htmlFor='images' className='form-label'>Upload Images</label>
          <input type='file' id='images' multiple onChange={(e) => setFiles(e.target.files)} className='form-control' />
        </div>
        <button type='submit' className='btn btn-primary mt-3' onClick={handleClick}>ADD</button>
        {/* <button type='button' className='btn btn-outline-secondary mt-3 ml-2' onClick={initializeSpeechRecognition}>Initialize Speech API</button> */}
      </form>
    </div>
  );
};

export default Addnote;
