import React from "react";
import { toast, Toaster } from "sonner";

interface MinecraftToastProps {
  toastId: string | number;
}

const SUCCESS_IMAGE_SRC = "/success.png";

export function MinecraftToast({ toastId }: MinecraftToastProps) {

  const shell: React.CSSProperties = {
    width: "min(92vw, 360px)",
    position: "relative",
    cursor: "pointer",
    userSelect: "none",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    display: "block",
    imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
  };

  return (
    <div style={shell} onClick={() => toast.dismiss(toastId)}>
      <img src={SUCCESS_IMAGE_SRC} alt="success toast" style={imageStyle} draggable={false} />
    </div>
  );
}

const showSuccess = () =>
  toast.custom(
    (id) => <MinecraftToast toastId={id} />,
    {
      duration: 4500,
      position: "top-center",
      unstyled: true,
    }
  );

// eslint-disable-next-line react-refresh/only-export-components
export const minecraftToast = {
  success: (title?: string, description?: string) => {
    void title;
    void description;
    return showSuccess();
  }
};

// ─── Toaster (add once to your app root) ─────────────────────────────────────

export function MinecraftToaster() {
  return (
    <Toaster
      position="top-center"
    />
  );
}