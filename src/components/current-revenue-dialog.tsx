"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useState } from "react";
import { Company } from "@/types";
import { getCurrentRevenueAction } from "@/actions/get-current-revenue-action";

type CurrentRevenueDialogProps = {
  company: Company;
};

export function CurrentRevenueDialog({ company }: CurrentRevenueDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentRevenue, setCurrentRevenue] = useState<string | null>(null);

  const handleClickOpen = async () => {
    setOpen(true);
    const currentRevenue = await getCurrentRevenueAction(company.cnpj);
    setCurrentRevenue(currentRevenue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        data-cy="revenueDialogButton"
        size="small"
        sx={{
          color: "#244C5A",
          borderColor: "#244C5A",
          "&:hover": {
            backgroundColor: "#244C5A",
            color: "white",
            borderColor: "#244C5A",
          },
        }}
        variant="outlined"
        onClick={handleClickOpen}
      >
        Ver rendimento atual
      </Button>

      <Dialog
        data-cy="revenueDialog"
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {company.nome_fantasia}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Rendimento: {currentRevenue}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button data-cy="revenueDialogClose" onClick={handleClose} autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
