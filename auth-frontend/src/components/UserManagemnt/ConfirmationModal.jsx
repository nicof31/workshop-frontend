import React from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default' // 'danger', 'success', 'warning'
}) => {
  if (!isOpen) return null;

  const getConfirmButtonColor = () => {
    switch (variant) {
      case 'danger':
        return '#dc3545';
      case 'success':
        return '#198754';
      case 'warning':
        return '#ffc107';
      default:
        return '#4fc3f7';
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1050,
    },
    modal: {
      backgroundColor: '#2d2d2d',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      border: '1px solid #444',
    },
    header: {
      padding: '15px 20px',
      borderBottom: '1px solid #444',
    },
    title: {
      color: '#fff',
      margin: 0,
      fontSize: '1.25rem',
    },
    content: {
      padding: '20px',
      color: '#cccccc',
      fontSize: '1rem',
      lineHeight: '1.5',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      padding: '15px 20px',
      borderTop: '1px solid #444',
      backgroundColor: '#1a1a1a',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem',
    },
    cancelButton: {
      backgroundColor: '#757575',
      color: '#fff',
    },
    confirmButton: {
      backgroundColor: getConfirmButtonColor(),
      color: variant === 'warning' ? '#000' : '#fff',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
        </div>
        <div style={styles.content}>
          <p style={{ margin: 0 }}>{message}</p>
        </div>
        <div style={styles.footer}>
          <button style={{ ...styles.button, ...styles.cancelButton }} onClick={onClose}>
            {cancelText}
          </button>
          <button style={{ ...styles.button, ...styles.confirmButton }} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;