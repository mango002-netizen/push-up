import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AmountPicker } from "@/components/boost-dialog";
import { createIntent } from "@/lib/logorank/api";
import { resizeLogoFile } from "@/lib/logorank/resize-image";

export function BidForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [cents, setCents] = useState(2500);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const data = await resizeLogoFile(file);
      setLogo(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo leer el logo");
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!logo) {
      toast.error("Sube un logo");
      return;
    }
    setBusy(true);
    try {
      const { intent } = await createIntent({
        data: {
          name,
          url,
          xHandle: xHandle || undefined,
          logoData: logo,
          amountCents: cents,
        },
      });
      await navigate({ to: "/pay/$intentId", params: { intentId: intent.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear la puja");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="product">Nombre del producto</Label>
        <Input
          id="product"
          required
          maxLength={80}
          placeholder="Northbeam"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          required
          inputMode="url"
          placeholder="https://tu-producto.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Si la URL ya está en el ranking, tu puja se suma al logo existente.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="x">Handle de X (opcional)</Label>
        <Input
          id="x"
          placeholder="@tumarca"
          value={xHandle}
          onChange={(e) => setXHandle(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Logo</Label>
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-card px-4 py-6 text-center shadow-(--shadow-border) transition-[box-shadow] duration-150 hover:shadow-(--shadow-border-hover)">
          {logo ? (
            <img src={logo} alt="Vista previa del logo" className="logo-img size-24 rounded-md object-contain" />
          ) : (
            <>
              <ImagePlus className="size-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">PNG, JPG o WEBP. Se recorta a 512 px.</span>
            </>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      </div>
      <AmountPicker cents={cents} onChange={setCents} />
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? "Preparando…" : "Continuar al pago"}
      </Button>
    </form>
  );
}
