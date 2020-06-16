import React from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");
const Modal = ({ isOpen, onRequestClose, onClose, onSubmit }) => {
  const customStyles = {
    overlay: {
      zIndex: 999,
    },
    content: {
      position: "absolute",
      right: "40%",
      left: "40%",
      top: "30%",
      bottom: "auto",
      height: "auto",
      width: "250px",
      padding: 0,
    },
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <div className="modal-header green white-text">DELETE</div>
      <div className="modal-content">
        <button className="waves-effect waves-light btn red" onClick={onSubmit}>
          DELETE
        </button>
        <button
          className="waves-effect waves-light btn lighten-5 ml-2"
          onClick={onClose}
        >
          CANCEL
        </button>
      </div>
    </ReactModal>
  );
};

export default Modal;
