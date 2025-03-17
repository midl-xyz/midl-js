import { MainMenu } from "@/components/main-menu";
import { RuneForm } from "@/components/rune-form/RuneForm";

export default function Home() {
	return (
		<div className="flex space-y-8 flex-col justify-center w-full max-w-[450px]">
			<div>
				<RuneForm />
			</div>
		</div>
	);
}
