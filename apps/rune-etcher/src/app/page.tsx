import { RuneForm } from "@/components/rune-form/RuneForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-[12vh]">
      <div className="flex space-y-8 flex-col justify-center w-full max-w-[450px]">
        <div className="flex flex-col space-y-0 items-start">
          <h1 className="text-3xl font-bold text-primary">
            Bitcoin Rune Etcher
          </h1>
          <p className="text-lg">Etch runes on the Bitcoin blockchain</p>
        </div>

        <div>
          <RuneForm />
        </div>
      </div>
    </div>
  );
}
