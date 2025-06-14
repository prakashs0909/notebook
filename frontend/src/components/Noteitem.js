import React, { useContext, useState} from 'react';
import noteContext from '../context/notes/noteContext';

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const {deleteNote}= context;
  const {note, updateNote} = props;
  const [copied, setCopied] = useState(false);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(note.content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => props.showalert("Failed to copy!", "danger"));
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleImageClick = () => {
    if (note.image && note.image.length > 0) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write('<html><head><title>Note Images</title></head><body>');
        note.image.forEach((img) => {
          const base64Image = `data:image/png;base64,${arrayBufferToBase64(img.data)}`;
          newWindow.document.write(`<img src="${base64Image}" alt="Note Image" style="margin: 10px; width: 300px; height: 300px;" />`);
        });
        newWindow.document.write('</body></html>');
        newWindow.document.close();
      } else {
        alert('Popup blocked! Please allow popups for this website.');
      }
    }
  };

  return (
    <div className="col-md-3">
      <div className="card my-3" style={{ width: "18rem", minHeight: "300px", padding: "10px" }}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title font-bold">{note.title}</h5>
          <p className="card-text mb-2" style={{ whiteSpace: "pre-wrap" }}>
            {note.content}
          </p>

          {note.image && note.image.length > 0 ? (
            <div
              className="bg-gray-200 rounded px-1 d-flex align-items-center"
              style={{ cursor: "pointer", width: "fit-content", padding: "5px" }}
              onClick={() => handleImageClick(note.image)}
            >
              <div>
                <svg width="20" height="20" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="150" fill="lightgray" stroke="black" strokeWidth="2" />
                  <circle cx="50" cy="50" r="20" fill="white" stroke="black" strokeWidth="2" />
                  <polygon points="0,150 80,80 150,130 200,90 200,150" fill="darkgray" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              <div className="px-1">{note.image.length} {note.image.length === 1 ? "Image" : "Images"}</div>
            </div>
          ) : (
            <div className="bg-gray-200 rounded px-1 d-flex align-items-center"
            style={{ width: "fit-content", padding: "5px" }}>
              <div>
                <svg width="20" height="20" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="150" fill="lightgray" stroke="black" strokeWidth="2" />
                  <circle cx="50" cy="50" r="20" fill="white" stroke="black" strokeWidth="2" />
                  <polygon points="0,150 80,80 150,130 200,90 200,150" fill="darkgray" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              <div className='px-1'>0 Images</div>
            </div>
          )}

          <div className="mt-auto ml-auto">
            <i className="fa-solid fa-trash mx-2 " style={{ cursor: "pointer" }} 
              onClick={() => { deleteNote(note._id); props.showalert("Note has been deleted successfully", "success"); }}>
            </i>
            <i className="fa-solid fa-pen-to-square mx-2 " style={{ cursor: "pointer" }} 
              onClick={() => { updateNote(note); }}>
            </i>
            <i className="fa-regular fa-copy mx-2" style={{ cursor: "pointer" }}
              onClick={copyToClipboard} >
            </i>
            {copied && <span className="text-success">Copied!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noteitem
