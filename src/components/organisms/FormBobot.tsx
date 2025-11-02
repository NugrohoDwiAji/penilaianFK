import { Plus, Trash2 } from "lucide-react";

type FormBobotProps = {
  data: { nama: string; bobot: number };
  onChange: (key: "nama" | "bobot", value: string | number) => void;
  addSub: () => void;
  delSub: () => void;
};

export default function FormBobot({ data, onChange, addSub, delSub }: FormBobotProps) {

  return (
    <div className="flex gap-3 items-center">
      <input
        type="text"
        placeholder="Nama komponen"
        className="border p-2 rounded w-60"
        value={data.nama}
        onChange={(e) => onChange("nama", e.target.value)}
      />
      <input
        type="number"
        placeholder="Bobot"
        className="border p-2 rounded w-24"
        value={data.bobot}
        onChange={(e) => onChange("bobot", Number(e.target.value))}
      />
      <div>
        <button
          type="button"
          onClick={addSub}
          className="bg-green-200 text-white p-2 rounded"
        >
          <Plus className="text-green-600" />
        </button>
        <button className="bg-red-200 p-2 rounded ml-2" onClick={delSub}>
          <Trash2 className="text-red-600" />
        </button>
      </div>
    </div>
  );
}
