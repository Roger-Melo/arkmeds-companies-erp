"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
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
          color: "primary.main",
          borderColor: "primary.main",
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          padding: { xs: "4px 8px", sm: "6px 16px" },
          textTransform: "none",
          fontWeight: 500,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "primary.main",
            color: "white",
            borderColor: "primary.main",
            transform: "translateY(-2px)",
            boxShadow: 1,
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
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            minWidth: { xs: "90%", sm: "400px", md: "450px" },
            maxWidth: { xs: "95%", sm: "500px" },
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: "#f5f5f5",
            color: "primary.main",
            fontWeight: 600,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            borderBottom: "2px solid primary.main",
          }}
        >
          {company.nome_fantasia}
        </DialogTitle>
        <DialogContent
          sx={{
            padding: { xs: 2, sm: 3 },
            minHeight: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: currentRevenue === null ? "center" : "flex-start",
          }}
        >
          {currentRevenue === null ? (
            <CircularProgress size={40} sx={{ color: "primary.main" }} />
          ) : (
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem" },
                color: "#333",
                fontWeight: 500,
                "& strong": {
                  color: "primary.main",
                  fontSize: { xs: "1.2rem", sm: "1.3rem" },
                },
              }}
            >
              Rendimento: <strong>{currentRevenue}</strong>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            padding: { xs: 1.5, sm: 2 },
            backgroundColor: "#fafafa",
          }}
        >
          <Button
            data-cy="revenueDialogClose"
            onClick={handleClose}
            autoFocus
            sx={{
              color: "primary.main",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(36, 76, 90, 0.08)",
              },
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
