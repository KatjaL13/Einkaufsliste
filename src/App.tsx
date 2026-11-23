import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle2Icon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Product = {
  name: string;
  quantity: number;
  bought: boolean;
};

const LOCAL_STORAGE_KEY = "Einkaufsliste";

export function App() {
  const [quantity, setQuantity] = useState(1);
  const [nameP, setNameP] = useState("");

  const [list, setList] = useState<Product[]>([]);

  const dataLoaded = useRef(false);

  useEffect(() => {
    dataLoaded.current = true;
  }, []);

  useEffect(() => {
    if (dataLoaded.current)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  }, [list]);

  function addProduct() {
    if (list.find((item) => item.name === nameP)) {
      toast.error("Artikel bereits vorhanden", {
        description: "Dieser Artikel steht schon auf der Einkaufsliste.",
      });
    } else {
      setList([{ name: nameP, quantity: quantity, bought: false }, ...list]);

      setNameP("");
      setQuantity(1);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center px-4">
      <h1 className="mt-16 mb-10 text-3xl font-semibold">Einkaufsliste</h1>
      <form // verbindet Eingabefelder und Button
        className="w-full"
        onSubmit={(e) => {
          // onSubmit wird beim Klicken auf den Button oder beim Bestätigen mit Enter ausgelöst
          e.preventDefault(); // verhindert, dass die Seite neu geladen wird
          addProduct();
        }}
      >
        <div className="flex w-full gap-2">
          <Input
            placeholder="Artikel eingeben..."
            value={nameP}
            onChange={(e) => setNameP(e.target.value)}
          />

          <Input
            type="number"
            min={0}
            max={100}
            className="w-18"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.min(100, Math.max(0, Number(e.target.value))))
            }
          />
        </div>

        <Button
          type="submit" //macht den Button zum Absende-Button
          size="lg"
          className="mt-2 w-full bg-gray-500"
          disabled={nameP.length < 1}
        >
          Artikel hinzufügen
        </Button>
      </form>

      <div className="mt-7 flex w-full flex-col gap-3">
        {list.map((item) => (
          <div
            className="flex items-center justify-between rounded-xl border bg-card p-3 text-card-foreground shadow"
            key={item.name}
          >
            <div>
              <h3
                className={`text-lg font-semibold ${item.bought ? "text-muted-foreground line-through decoration-red-500 decoration-2" : ""}`}
              >
                {item.name}
              </h3>
              <p className="text-sm">Anzahl: {item.quantity}</p>
            </div>

            {item.bought ? (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setList([
                      ...list.filter((listItem) => listItem.name !== item.name),
                    ]);
                    toast.success("Artikel erfolgreich gelöscht", {
                      description: `${item.name} wurde aus der Einkaufsliste entfernt.`,
                    });
                  }}
                >
                  <TrashIcon />
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    setList([
                      {
                        name: item.name,
                        quantity: item.quantity,
                        bought: false,
                      },
                      ...list.filter((listItem) => listItem.name !== item.name),
                    ]);
                  }}
                >
                  Zurück
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setList([
                    ...list.filter((listItem) => listItem.name !== item.name),
                    { name: item.name, quantity: item.quantity, bought: true },
                  ]);
                }}
              >
                <CheckCircle2Icon /> Erledigt
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
