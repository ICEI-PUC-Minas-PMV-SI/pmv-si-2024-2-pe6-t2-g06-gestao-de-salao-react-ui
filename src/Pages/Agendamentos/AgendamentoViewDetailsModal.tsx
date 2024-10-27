import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface AgendamentoViewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  agendamento: any; // Substitua `any` pelo tipo específico de `agendamento`, se disponível
}

const AgendamentoViewDetailsModal: React.FC<AgendamentoViewDetailsModalProps> = ({ open, onClose, agendamento }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="agendamento-modal-title"
      aria-describedby="agendamento-modal-description"
    >
      <Box sx={style}>
        <Typography id="agendamento-modal-title" variant="h6" component="h2">
          Detalhes do Agendamento
        </Typography>
        <Typography id="agendamento-modal-description" sx={{ mt: 2 }}>
          <p><strong>Serviço:</strong> {agendamento?.servicoSubCategoria?.nome}</p>
          <p><strong>Data:</strong> {agendamento?.dataAgendamento}</p>
          <p><strong>Hora:</strong> {agendamento?.horaAgendamento}</p>
          <p><strong>Status:</strong> {agendamento?.status}</p>
        </Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>Fechar</Button>
      </Box>
    </Modal>
  );
};

export default AgendamentoViewDetailsModal;
