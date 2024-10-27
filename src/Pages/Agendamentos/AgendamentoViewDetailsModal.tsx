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

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
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
          <p><strong>Serviço agendado:</strong> {agendamento?.servicoCategoria?.nome} - {agendamento?.servicoSubCategoria?.nome}</p>
          <p><strong>Data:</strong> {formatDate(agendamento.dataAgendamento)}</p>
          <p><strong>Hora:</strong> {agendamento?.horaAgendamento}</p>
          <p><strong>Status:</strong> {agendamento?.status}</p>
          <p><strong>Profissional:</strong> {agendamento?.profissional?.nome}</p>   
          <p><strong>Contato do Profissional:</strong> Telefone: {agendamento?.profissional?.telefone} / Email: {agendamento?.profissional?.email}</p>          
          <p><strong>Cliente:</strong> {agendamento?.usuario?.nome}</p>
          <p><strong>Contato do Cliente:</strong> Telefone: {agendamento?.usuario?.telefone} / Email: {agendamento?.usuario?.email}</p> 
          <p><strong>Observacoes:</strong> {agendamento?.observacoes}</p>
        </Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>Fechar</Button>
      </Box>
    </Modal>
  );
};

export default AgendamentoViewDetailsModal;
