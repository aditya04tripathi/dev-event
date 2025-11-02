import { ArrowDown } from "lucide-react";
import ElectricBorder from "./ui/ElectricBorder";

const ExploreButton = () => {
	return (
		<ElectricBorder
			className="w-fit h-fit px-5 py-2 mt-10"
			color="var(--primary)"
			speed={1}
			chaos={0.5}
			thickness={2}
			style={{ borderRadius: 16 }}
		>
			<a className="flex items-center gap-2" href="#events">
				Explore Events
				<ArrowDown />
			</a>
		</ElectricBorder>
	);
};

export default ExploreButton;
