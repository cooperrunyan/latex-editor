import { useState } from "react";

import { Button, Tooltip } from "@heroui/react";
import { Copy, Download } from "lucide-react";

export interface Props {
	download: () => Promise<void>;
	copy: () => Promise<void>;
	className?: string;
}

export const Toolbar = ({ download, copy, className }: Props) => {
	const [isDownloading, setIsDownloading] = useState(false);
	const [isCopying, setIsCopying] = useState(false);

	return (
		<div className={`flex !h-fit gap-2 ${className || ""}`}>
			{[
				{
					tooltip: "Copy",
					Icon: Copy,
					isLoading: isCopying,
					onPress: () => {
						setIsCopying(true);
						copy().finally(() => setIsCopying(false));
					},
				},
				{
					tooltip: "Download",
					Icon: Download,
					isLoading: isDownloading,
					onPress: () => {
						setIsDownloading(true);
						download().finally(() => setIsDownloading(false));
					},
				},
			].map((p) => (
				<Tooltip
					key={p.tooltip}
					closeDelay={0}
					className="text-xs"
					content={p.tooltip}
				>
					<Button
						variant="bordered"
						isIconOnly
						className="border-1 text-base"
						isLoading={p.isLoading}
						radius="sm"
						onPress={p.onPress}
					>
						<p.Icon size={18} />
					</Button>
				</Tooltip>
			))}
		</div>
	);
};
