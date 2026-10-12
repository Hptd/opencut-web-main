"use client";

import { Section, SectionContent, SectionFields } from "@/components/section";
import { useEditor } from "@/editor/use-editor";
import type { ParamValue } from "@/params";
import {
	getElementParams,
	readElementParamValue,
	writeElementParamValue,
	type ElementParamDefinition,
} from "@/params/registry";
import type { TimelineElement } from "@/timeline";
import { PropertyParamField } from "./property-param-field";

type ElementWithTrack = { trackId: string; element: TimelineElement };

export function MultiElementParamsTab({
	elementsWithTracks,
	paramKeys,
	sectionKey,
}: {
	elementsWithTracks: ElementWithTrack[];
	paramKeys?: readonly string[];
	sectionKey: string;
}) {
	const editor = useEditor();
	const first = elementsWithTracks[0];
	const params = getElementParams({ element: first.element }).filter(
		(param) => !paramKeys || paramKeys.includes(param.key),
	);
	const valuesByParam = buildValuesByParam({ elementsWithTracks, params });

	return (
		<Section sectionKey={`${first.element.id}:${sectionKey}`}>
			<SectionContent className="pt-4">
				<SectionFields>
					{params
						.filter((param) => isVisible({ param, valuesByParam }))
						.map((param) => (
							<MultiElementParamField
								key={param.key}
								param={param}
								values={valuesByParam[param.key] ?? []}
								onPreview={(value) =>
									editor.timeline.previewElements({
										updates: elementsWithTracks.map(({ trackId, element }) => ({
											trackId,
											elementId: element.id,
											updates: writeElementParamValue({
												element,
												param,
												value,
											}),
										})),
									})
								}
								onCommit={() => editor.timeline.commitPreview()}
							/>
						))}
				</SectionFields>
			</SectionContent>
		</Section>
	);
}

function MultiElementParamField({
	param,
	values,
	onPreview,
	onCommit,
}: {
	param: ElementParamDefinition;
	values: ParamValue[];
	onPreview: (value: ParamValue) => void;
	onCommit: () => void;
}) {
	const isMixed = !areAllEqual({ values });

	return (
		<PropertyParamField
			param={param}
			value={values[0] ?? param.default}
			isMixed={isMixed}
			onPreview={onPreview}
			onCommit={onCommit}
		/>
	);
}

function buildValuesByParam({
	elementsWithTracks,
	params,
}: {
	elementsWithTracks: ElementWithTrack[];
	params: readonly ElementParamDefinition[];
}): Record<string, ParamValue[]> {
	const valuesByParam: Record<string, ParamValue[]> = {};

	for (const param of params) {
		const values: ParamValue[] = [];
		for (const { element } of elementsWithTracks) {
			const value = readElementParamValue({ element, param });
			if (value !== null) {
				values.push(value);
			}
		}
		valuesByParam[param.key] = values;
	}

	return valuesByParam;
}

function areAllEqual({ values }: { values: ParamValue[] }): boolean {
	return values.every((value) => value === values[0]);
}

function isVisible({
	param,
	valuesByParam,
}: {
	param: ElementParamDefinition;
	valuesByParam: Record<string, ParamValue[]>;
}): boolean {
	return (param.dependencies ?? []).every((dependency) => {
		const values = valuesByParam[dependency.param] ?? [];
		if (values.length === 0) return false;
		if (!areAllEqual({ values })) return true;
		return values[0] === dependency.equals;
	});
}
