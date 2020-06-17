import React from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");
const ConfirmModal = ({
  isOpen,
  onRequestClose,
  onClose,
  onSubmit,
  submitColor,
  submitLabel,
  headerLabel,
}) => {
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
      <div className="modal-header green white-text">{headerLabel}</div>
      <div className="modal-content">
        <button
          className={`waves-effect waves-light btn ${submitColor}`}
          onClick={onSubmit}
        >
          {submitLabel}
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

export default ConfirmModal;
