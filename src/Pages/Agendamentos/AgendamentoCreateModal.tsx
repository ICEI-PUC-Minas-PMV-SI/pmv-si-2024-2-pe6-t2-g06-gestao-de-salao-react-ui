import * as React from 'react';
import Stepper from '@mui/joy/Stepper';
import Step, { stepClasses } from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import { Dialog, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AgendamentoCreateModalProps {
  open: boolean;
  onClose: () => void;
  agendamento: any | null; // Adjust type as necessary
}

const AgendamentoCreateModal: React.FC<AgendamentoCreateModalProps> = ({ open, onClose, agendamento }) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
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
            '--joy-palette-success-solidBg': theme.vars.palette.success[400],
            [`& .${stepClasses.completed}`]: {
              '&::after': { bgcolor: 'success.solidBg' },
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
          <Step
            completed={activeStep > 0}
            active={activeStep === 0}
            indicator={
              <StepIndicator variant="solid" color="success">
                <CheckRoundedIcon />
              </StepIndicator>
            }
          >
            <div>
              <Typography level="title-sm">Step 1</Typography>
              Escolher o Serviço
            </div>
          </Step>
          <Step
            completed={activeStep > 1}
            active={activeStep === 1}
            disabled={activeStep < 1}
            indicator={
              <StepIndicator variant="solid" color="success">
                <CheckRoundedIcon />
              </StepIndicator>
            }
          >
            <div>
              <Typography level="title-sm">Step 2</Typography>
              Escolher o Profissional
            </div>
          </Step>
          <Step
            completed={activeStep > 2}
            active={activeStep === 2}
            disabled={activeStep < 2}
            indicator={
              <StepIndicator variant="solid" color="primary">
                <AppRegistrationRoundedIcon />
              </StepIndicator>
            }
          >
            <div>
              <Typography level="title-sm">Step 3</Typography>
              Escolher a Data
            </div>
          </Step>
          <Step
            active={activeStep === 3}
            disabled={activeStep < 3}
            indicator={<StepIndicator>4</StepIndicator>}
          >
            <div>
              <Typography level="title-sm">Step 4</Typography>
              Escolher o Horário
            </div>
          </Step>
        </Stepper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        {activeStep < 3 && (
          <Button onClick={handleNext} color="primary" variant="contained">
            Próximo
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AgendamentoCreateModal;
