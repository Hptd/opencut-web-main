"use client";

import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/i18n/store";
import { useTranslation } from "@/i18n/use-translation";

export function LanguageToggle() {
	const { language } = useTranslation();
	const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleLanguage}
			aria-label="Switch language"
			title="Switch language"
		>
			<span className="text-xs font-semibold">
				{language === "zh" ? "中" : "EN"}
			</span>
		</Button>
	);
}
