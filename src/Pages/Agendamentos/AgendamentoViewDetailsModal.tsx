import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './AgendamentoViewDetailsModal.css';

interface AgendamentoViewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  agendamento: any;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const AgendamentoViewDetailsModal: React.FC<AgendamentoViewDetailsModalProps> = ({ open, onClose, agendamento }) => {
  return (
    <Modal open={open} onClose={onClose} className="modal-overlay" aria-labelledby="agendamento-modal-title" aria-describedby="agendamento-modal-description">
      <Box className="modal-box">
        <Typography id="agendamento-modal-title" variant="h6" component="h2" className="modal-title">
          Detalhes do Agendamento
        </Typography>
        <div id="agendamento-modal-description" className="modal-description">
          <TextField label="Serviço Agendado" value={`${agendamento?.servicoCategoria?.nome} - ${agendamento?.servicoSubCategoria?.nome}`} variant="outlined" fullWidth margin="normal" InputProps={{ readOnly: true }} />
          <TextField label="Data" value={formatDate(agendamento?.dataAgendamento)} variant="outlined" fullWidth margin="normal" InputProps={{ readOnly: true }} />
          <TextField label="Hora" value={agendamento?.horaAgendamento} variant="outlined" fullWidth margin="normal" InputProps={{ readOnly: true }} />
          <TextField label="Status" value={agendamento?.status} variant="outlined" fullWidth margin="normal" InputProps={{ readOnly: true }} />
          <TextField label="Profissional" value={agendamento?.profissional?.nome} variant="outlined" fullWidth margin="normal" InputProps={{ readOnly: true }} />
          <TextField label="Contato do Profissional" value={`Telefone: ${agendamento?.profissional?.telefone} / Email: ${agendamento?.profissional?.email}`} variant="outlined" fullWidth margin="normal" InputProps={{ readOnly: true }} />
          <TextField label="Cliente" value={agendamento?.usuario?.nome} variant="outlined" fullWidth margin="normal" InputProps={{ readOnly: true }} />
          <TextField label="Contato do Cliente" value={`Telefone: ${agendamento?.usuario?.telefone} / Email: ${agendamento?.usuario?.email}`} variant="outlined" fullWidth margin="normal" InputProps={{ readOnly: true }} />
          <TextField label="Observações" value={agendamento?.observacoes} variant="outlined" fullWidth margin="normal" multiline rows={3} InputProps={{ readOnly: true }} />
        </div>
        <Button onClick={onClose} className="modal-button">Fechar</Button>
      </Box>
    </Modal>
  );
};

export default AgendamentoViewDetailsModal;
