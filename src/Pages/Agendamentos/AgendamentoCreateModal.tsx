import * as React from 'react'; 
import Stepper from '@mui/joy/Stepper';
import Step, { stepClasses } from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Dialog, DialogContent, DialogActions, Button, IconButton, Select, MenuItem, FormControl, InputLabel, TextField, SelectChangeEvent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createAgendamentoAPI } from '../api/AgendamentoAPI';

interface AgendamentoCreateModalProps {
  open: boolean;
  onClose: () => void;
  agendamento: any | null; // Ajuste o tipo conforme necessário
}

interface Agendamento {
  id: number,
  dataAgendamento: string,
  horaAgendamento: string,
  status: string,
  observacoes: string,
  servicoCategoriaId: number,
  servicoSubCategoriaId: number,
  profissionalId: number,
  usuarioId: number,
}

// Dados fictícios de salões com CNPJ e profissionais vinculados
const saloesData = [
  {
    id: '2',
    nome: 'Salão 1',
    cnpj: '12.345.678/0001-90',
    profissionais: [
      { id: '11', nome: 'Alice', categorias: ["1"], servicos: ["1", "2"] },
      { id: '15', nome: 'Carlos', categorias: ["2"], servicos: ["3","4"] },
    ],
  },
  {
    id: '1',
    nome: 'Salão 2',
    cnpj: '98.765.432/0001-10',
    profissionais: [
      { id: '15', nome: 'Bruna', categorias: ["1","2"], servicos: ["1","2","3","4"] },
    ],
  },
];

const categoriasServicosData = [
  { id: '1', nome: 'Unha' },
  { id: '2', nome: 'Cabelo' },
  // { id: '3', nome: 'Pele' },
];

// Adicionando preços aos serviços
const servicosData = [
  { id: '1', nome: 'Unha Gel', preco: 50.00 },
  { id: '2', nome: 'Unha Acrílico', preco: 60.00 },
  { id: '3', nome: 'Corte de Cabelo Feminino', preco: 80.00 },
  { id: '4', nome: 'Corte de Cabelo Masculino', preco: 70.00 },
];

const AgendamentoCreateModal: React.FC<AgendamentoCreateModalProps> = ({ open, onClose, agendamento }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedSalao, setSelectedSalao] = React.useState('');
  const [selectedCategoria, setSelectedCategoria] = React.useState('');
  const [selectedServico, setSelectedServico] = React.useState('');
  const [selectedProfissional, setSelectedProfissional] = React.useState('');
  const [selectedData, setSelectedData] = React.useState('');
  const [selectedHora, setSelectedHora] = React.useState('');
  const [observacoes, setObservacoes] = React.useState(''); // Novo estado para observações
 
  const [agendamentos, setAgendamento] = React.useState<Agendamento>({
    id: 0,
    dataAgendamento: "",
    horaAgendamento: "",
    status: "Pendente",
    observacoes: observacoes,
    servicoCategoriaId: 0,
    servicoSubCategoriaId: 0,
    profissionalId: 0,
    usuarioId: 0,
  });

  // Função para habilitar o próximo passo com base na seleção
  const handleNextStep = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, 6)); // Habilita o próximo passo até o máximo de 5
  };

  const handleSalaoChange = (event: SelectChangeEvent<string>) => {
    setSelectedSalao(event.target.value as string);
    setSelectedCategoria(''); // Resetar seleção ao trocar salão
    setSelectedProfissional('');
    setSelectedServico('');
    if (event.target.value) handleNextStep(); // Avança para o próximo passo
  };

  const handleCategoriaChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategoria(event.target.value as string);
    setSelectedServico('');
    setSelectedProfissional('');
    if (event.target.value) handleNextStep(); // Avança para o próximo passo
  };

  const handleServicoChange = (event: SelectChangeEvent<string>) => {
    setSelectedServico(event.target.value as string);
    if (event.target.value) handleNextStep(); // Avança para o próximo passo
  };

  const handleProfissionalChange = (event: SelectChangeEvent<string>) => {
    setSelectedProfissional(event.target.value as string);
    if (event.target.value) handleNextStep(); // Avança para o próximo passo
  };

  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedData(event.target.value);
    if (event.target.value) handleNextStep(); // Avança para o próximo passo
  };

  const handleHoraChange = (event: SelectChangeEvent<string>) => {
    setSelectedHora(event.target.value as string);
    if (event.target.value) handleNextStep(); // Avança para o próximo passo
  };
  
  // Definição da função para lidar com as observações
  const handleObservacaoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservacoes(event.target.value);
    handleNextStep(); // Avança para o próximo passo
  };

  const selectedSalaoData = saloesData.find((salao) => salao.id === selectedSalao);
  const profissionaisFiltrados = selectedSalaoData
    ? selectedSalaoData.profissionais.filter((profissional) =>
        selectedCategoria ? profissional.categorias.includes(selectedCategoria) : true
      )
    : [];

  const servicosFiltrados = selectedSalaoData
    ? servicosData.filter((servico) =>
        selectedCategoria && selectedSalaoData.profissionais.some(
          (profissional) =>
            profissional.categorias.includes(selectedCategoria) &&
            profissional.servicos.includes(servico.id)
        )
      )
    : [];

  // Formatar a data de hoje no formato YYYY-MM-DD
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // '2024-11-03'

  // Exemplo de opções de hora
  const horasOptions = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleConcluirAgendamento = async () => {
    const storedUserId = Number(localStorage.getItem("userId"));
    const agendamentoFinal = {
      Id: 0,
      // salaId: selectedSalao, // Mapeando o ID do salão selecionado
      servicoCategoriaId: selectedCategoria, // Mapeando o ID da categoria do serviço
      servicoSubCategoriaId: selectedServico, // Mapeando o ID do serviço selecionado
      profissionalId: selectedProfissional, // Mapeando o ID do profissional selecionado
      dataAgendamento: selectedData, // Usando a data selecionada
      horaAgendamento: selectedHora, // Usando a hora selecionada
      status: "Pendente", // Status do agendamento
      observacoes: observacoes, // Inclua as observações aqui
      usuarioId: storedUserId,
    };
  
    try {
      const localStorageToken = localStorage.getItem("token") || ''; // Usar || para garantir uma string vazia
    
      // Verifique se o token está presente antes de chamar a API
      if (!localStorageToken) {
        console.error('Token não encontrado no localStorage');
        return; // Você pode escolher como tratar a ausência do token
      }
    
      await createAgendamentoAPI(localStorageToken, agendamentoFinal); // Chamada para a API
      console.log('Agendamento concluído com sucesso:', agendamentoFinal);
      onClose(); // Fecha o modal após concluir o agendamento
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      // Você pode adicionar um tratamento de erro aqui, se necessário
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogActions>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogContent>
        <Stepper
          orientation="vertical"
          sx={(theme) => ({
            '--Stepper-verticalGap': '2.5rem',
            '--StepIndicator-size': '2.5rem',
            '--Step-gap': '1rem',
            '--Step-connectorInset': '0.5rem',
            '--Step-connectorRadius': '1rem',
            '--Step-connectorThickness': '4px',
            '--joy-palette-neutral-solidBg': theme.vars.palette.neutral[400],
            [`& .${stepClasses.completed}`]: {
              '&::after': { bgcolor: theme.vars.palette.success }, // Passo anterior como "success"
            },
            [`& .${stepClasses.active}`]: {
              [`& .${stepIndicatorClasses.root}`]: {
                border: '4px solid',
                borderColor: '#fff',
                boxShadow: `0 0 0 1px ${theme.vars.palette.primary[500]}`,
              },
            },
            [`& .${stepClasses.disabled} *`]: {
              color: 'neutral.softDisabledColor',
            },
            [`& .${typographyClasses['title-sm']}`]: {
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '10px',
            },
          })}
        >
          <Step completed={activeStep > 0} active={activeStep === 0} indicator={<StepIndicator variant="solid" color={activeStep === 0 ? 'primary' : activeStep < 0 ? 'neutral' : 'success'}><CheckRoundedIcon /></StepIndicator>}>
            <div>
              <Typography level="title-sm">Step 1</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-salao-label">Escolha o Salão *</InputLabel>
                <Select labelId="select-salao-label" id="select-salao" value={selectedSalao} onChange={handleSalaoChange} label="Salão">
                  {saloesData.map((salao) => (
                    <MenuItem key={salao.id} value={salao.id}>
                      {salao.nome} ({salao.cnpj})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Step>
          <Step completed={activeStep > 1} active={activeStep === 1} indicator={<StepIndicator variant="solid" color={activeStep === 1 ? 'primary' : activeStep < 1 ? 'neutral' : 'success'}><CheckRoundedIcon /></StepIndicator>}>
            <div>
              <Typography level="title-sm">Step 2</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-categoria-label">Escolha a Categoria *</InputLabel>
                <Select labelId="select-categoria-label" id="select-categoria" value={selectedCategoria} onChange={handleCategoriaChange} label="Categoria">
                  {categoriasServicosData.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Step>
          <Step completed={activeStep > 2} active={activeStep === 2} indicator={<StepIndicator variant="solid" color={activeStep === 2 ? 'primary' : activeStep < 2 ? 'neutral' : 'success'}><CheckRoundedIcon /></StepIndicator>}>
            <div>
              <Typography level="title-sm">Step 3</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-servico-label">Escolha o Serviço *</InputLabel>
                <Select labelId="select-servico-label" id="select-servico" value={selectedServico} onChange={handleServicoChange} label="Serviço">
                  {servicosFiltrados.map((servico) => (
                    <MenuItem key={servico.id} value={servico.id}>
                      {servico.nome} - R$ {servico.preco.toFixed(2)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Step>
          <Step completed={activeStep > 3} active={activeStep === 3} indicator={<StepIndicator variant="solid" color={activeStep === 3 ? 'primary' : activeStep < 3 ? 'neutral' : 'success'}><CheckRoundedIcon /></StepIndicator>}>
            <div>
              <Typography level="title-sm">Step 4</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-profissional-label">Escolha o Profissional *</InputLabel>
                <Select labelId="select-profissional-label" id="select-profissional" value={selectedProfissional} onChange={handleProfissionalChange} label="Profissional">
                  {profissionaisFiltrados.map((profissional) => (
                    <MenuItem key={profissional.id} value={profissional.id}>
                      {profissional.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Step>
          <Step completed={activeStep > 4} active={activeStep === 4} indicator={<StepIndicator variant="solid" color={activeStep === 4 ? 'primary' : activeStep < 4 ? 'neutral' : 'success'}><CheckRoundedIcon /></StepIndicator>}>
            <div>
              <Typography level="title-sm">Step 5</Typography>
              <TextField
                fullWidth
                margin="normal"
                id="data-agendamento"
                type="date"
                label="Escolha a Data *"
                value={selectedData}
                onChange={handleDataChange}
                inputProps={{ min: todayString }} // Define a data mínima como hoje
              />
            </div>
          </Step>
          <Step completed={activeStep > 5} active={activeStep === 5} indicator={<StepIndicator variant="solid" color={activeStep === 5 ? 'primary' : activeStep < 5 ? 'neutral' : 'success'}><CheckRoundedIcon /></StepIndicator>}>
            <div>
              <Typography level="title-sm">Step 6</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-hora-label">Escolha a Hora *</InputLabel>
                <Select labelId="select-hora-label" id="select-hora" value={selectedHora} onChange={handleHoraChange} label="Escolha a Hora *">
                  {horasOptions.map((hora) => (
                    <MenuItem key={hora} value={hora}>
                      {hora}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Step>
           {/* Novo passo para adicionar observações */}
           <Step completed={activeStep > 6} active={activeStep === 6} indicator={<StepIndicator variant="solid" color={activeStep === 6 ? 'primary' : activeStep < 6 ? 'neutral' : 'success'}><CheckRoundedIcon /></StepIndicator>}>
            <div>
              <Typography level="title-sm">Step 7</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={observacoes}
                onChange={handleObservacaoChange}
                margin="normal"
                label="Digite suas observações aqui... (Opcional)"
                // placeholder="Digite suas observações aqui... (Opcional)"
              />
            </div>
          </Step>
          <Step completed={activeStep > 7} active={activeStep === 7} indicator={<StepIndicator variant="solid"><CheckRoundedIcon /></StepIndicator>}>
            <div>
              <Typography level="title-sm">Resumo do seu agendamento:</Typography>
              <Typography>
                <strong>Salão:</strong> {selectedSalaoData?.nome}<br />
                <strong>Categoria:</strong> {categoriasServicosData.find(c => c.id === selectedCategoria)?.nome}<br />
                <strong>Serviço:</strong> {servicosData.find(s => s.id === selectedServico)?.nome}<br />
                <strong>Profissional:</strong> {profissionaisFiltrados.find(p => p.id === selectedProfissional)?.nome}<br />
                <strong>Data:</strong> {selectedData}<br />
                <strong>Hora:</strong> {selectedHora}<br />
              </Typography>
              <Button variant="contained" color="primary" onClick={handleConcluirAgendamento}>
                Confirmar Agendamento
              </Button>
            </div>
          </Step>
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};

export default AgendamentoCreateModal;
