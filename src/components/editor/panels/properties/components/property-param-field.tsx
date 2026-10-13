"use client";

import type {
	ParamDefinition,
	NumberParamDefinition,
	ParamValue,
} from "@/params";
import {
	formatNumberForDisplay,
	getFractionDigitsForStep,
	snapToStep,
} from "@/utils/math";
import { SectionField } from "@/components/section";
import { NumberField } from "@/components/ui/number-field";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ui/color-picker";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePropertyDraft } from "../hooks/use-property-draft";
import { KeyframeToggle } from "./keyframe-toggle";
import { Textarea } from "@/components/ui/textarea";
import { FontPicker } from "@/components/ui/font-picker";
import { useTranslation } from "@/i18n";

export function PropertyParamField({
	param,
	value,
	onPreview,
	onCommit,
	isMixed = false,
	keyframe,
}: {
	param: ParamDefinition;
	value: ParamValue;
	onPreview: (value: ParamValue) => void;
	onCommit: () => void;
	isMixed?: boolean;
	keyframe?: {
		isActive: boolean;
		isDisabled: boolean;
		onToggle: () => void;
	};
}) {
	const { t } = useTranslation();
	return (
		<SectionField
			label={t(param.label)}
			beforeLabel={
				keyframe && param.keyframable !== false ? (
					<KeyframeToggle
						isActive={keyframe.isActive}
						isDisabled={keyframe.isDisabled}
						title={t("Toggle {param} keyframe", {
							param: t(param.label).toLowerCase(),
						})}
						onToggle={keyframe.onToggle}
					/>
				) : undefined
			}
		>
			<ParamInput
				param={param}
				value={value}
				isMixed={isMixed}
				onPreview={onPreview}
				onCommit={onCommit}
			/>
		</SectionField>
	);
}

function ParamInput({
	param,
	value,
	isMixed,
	onPreview,
	onCommit,
}: {
	param: ParamDefinition;
	value: ParamValue;
	isMixed: boolean;
	onPreview: (value: ParamValue) => void;
	onCommit: () => void;
}) {
	const { t } = useTranslation();
	if (param.type === "number") {
		return (
			<NumberParamField
				param={param}
				value={typeof value === "number" ? value : Number(value)}
				isMixed={isMixed}
				onPreview={onPreview}
				onCommit={onCommit}
			/>
		);
	}

	if (param.type === "boolean") {
		return (
			<div className="flex items-center gap-2">
				<Switch
					checked={Boolean(value)}
					onCheckedChange={(checked) => {
						onPreview(checked);
						onCommit();
					}}
				/>
				{isMixed && (
					<span className="text-muted-foreground text-xs">{t("Mixed")}</span>
				)}
			</div>
		);
	}

	if (param.type === "select") {
		return (
			<Select
				value={isMixed ? "" : String(value)}
				onValueChange={(selected) => {
					onPreview(selected);
					onCommit();
				}}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={isMixed ? t("Mixed") : undefined} />
				</SelectTrigger>
				<SelectContent>
					{param.options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{t(option.label)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	}

	if (param.type === "color") {
		return (
			<ColorPicker
				isMixed={isMixed}
				value={String(value).replace(/^#/, "").toUpperCase()}
				onChange={(color) => onPreview(`#${color}`)}
				onChangeEnd={(color) => {
					onPreview(`#${color}`);
					onCommit();
				}}
			/>
		);
	}

	if (param.type === "text") {
		return (
			<Textarea
				value={isMixed ? "" : String(value)}
				placeholder={isMixed ? t("Mixed") : undefined}
				onChange={(event) => onPreview(event.currentTarget.value)}
				onBlur={onCommit}
			/>
		);
	}

	if (param.type === "font") {
		return (
			<FontPicker
				className="h-9"
				defaultValue={isMixed ? undefined : String(value)}
				placeholder={isMixed ? t("Mixed") : t("Select a font")}
				onValueChange={(font) => {
					onPreview(font);
					onCommit();
				}}
			/>
		);
	}

	return null;
}

function NumberParamField({
	param,
	value,
	isMixed,
	onPreview,
	onCommit,
}: {
	param: NumberParamDefinition;
	value: number;
	isMixed: boolean;
	onPreview: (value: number) => void;
	onCommit: () => void;
}) {
	const { t } = useTranslation();
	const { min, max, step, displayMultiplier = 1 } = param;
	const displayValue = value * displayMultiplier;
	const clampDisplayValue = (nextDisplayValue: number) =>
		Math.max(
			min,
			max !== undefined ? Math.min(max, nextDisplayValue) : nextDisplayValue,
		);

	const previewFromDisplay = (displayVal: number) => {
		const clamped = clampDisplayValue(
			snapToStep({ value: displayVal, step }),
		);
		onPreview(clamped / displayMultiplier);
	};

	const maxFractionDigits = getFractionDigitsForStep({ step });

	const draft = usePropertyDraft({
		displayValue: isMixed
			? ""
			: formatNumberForDisplay({
					value: displayValue,
					maxFractionDigits,
				}),
		parse: (input) => {
			const parsed = parseFloat(input);
			if (Number.isNaN(parsed)) return null;
			return clampDisplayValue(snapToStep({ value: parsed, step }));
		},
		onPreview: previewFromDisplay,
		onCommit,
	});

	const handleReset = () => {
		onPreview(param.default);
		onCommit();
	};

	return (
		<NumberField
			icon={param.shortLabel}
			value={draft.displayValue}
			placeholder={isMixed ? t("Mixed") : undefined}
			dragSensitivity="slow"
			isDefault={isMixed || value === param.default}
			onFocus={draft.onFocus}
			onChange={draft.onChange}
			onBlur={draft.onBlur}
			onScrub={isMixed ? undefined : previewFromDisplay}
			onScrubEnd={onCommit}
			onReset={isMixed ? undefined : handleReset}
		/>
	);
}
