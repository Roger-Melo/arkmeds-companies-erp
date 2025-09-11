"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div>
      <h2>Algo inesperado aconteceu</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Tentar novamente
      </button>
    </div>
  );
}
