import React from "react";
import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import { WidgetType } from "constants/WidgetConstants";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import _ from "lodash";
import { VALIDATION_TYPES } from "constants/WidgetValidation";
import * as Sentry from "@sentry/react";
import withMeta, { WithMeta } from "./MetaHOC";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import MultiSelectComponent from "components/designSystems/appsmith/MultiSelectComponent.tsx";
import { DefaultValueType } from "rc-select/lib/interface/generator";

class MultiSelectWidget extends BaseWidget<
  MultiSelectWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "General",
        children: [
          {
            helpText:
              "Allows users to select multiple options. Values must be unique",
            propertyName: "options",
            label: "Options",
            controlType: "INPUT_TEXT",
            placeholderText: 'Enter [{"label": "label1", "value": "value2"}]',
            isBindProperty: true,
            isTriggerProperty: false,
            validation: VALIDATION_TYPES.OPTIONS_DATA,
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "Selects the option with value by default",
            propertyName: "defaultOptionValue",
            label: "Default Option",
            controlType: "INPUT_TEXT",
            placeholderText: "Enter option value",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: VALIDATION_TYPES.DEFAULT_OPTION_VALUE,
          },
          {
            helpText: "Input Place Holder",
            propertyName: "placeholderText",
            label: "Input Placeholder",
            controlType: "INPUT_TEXT",
            placeholderText: "Enter placeholder text",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: VALIDATION_TYPES.TEXT,
          },
          {
            propertyName: "isRequired",
            label: "Required",
            helpText: "Makes input to the widget mandatory",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: VALIDATION_TYPES.BOOLEAN,
          },
          {
            helpText: "Controls the visibility of the widget",
            propertyName: "isVisible",
            label: "Visible",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: VALIDATION_TYPES.BOOLEAN,
          },
          {
            propertyName: "isDisabled",
            label: "Disabled",
            helpText: "Disables input to this widget",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: VALIDATION_TYPES.BOOLEAN,
          },
        ],
      },
      {
        sectionName: "Actions",
        children: [
          {
            helpText: "Triggers an action when a user selects an option",
            propertyName: "onOptionChange",
            label: "onOptionChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getDerivedPropertiesMap() {
    return {
      selectedIndexArr: `{{ this.selectedOptionValues.map(o => _.findIndex(this.options, { value: o })) }}`,
      selectedOptionLabels: `{{ this.selectedOptionValueArr.map((o) => { const index = _.findIndex(this.options, { value: o }); return this.options[index]?.label ?? this.options[index]?.value; })  }}`,
      selectedOptionValues: `{{ this.selectedOptionValueArr.filter((o) => { const index = _.findIndex(this.options, { value: o });  return index > -1; })  }}`,
      isValid: `{{this.isRequired ? !!this.selectedIndexArr && this.selectedIndexArr.length > 0 : true}}`,
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      selectedOptionValueArr: "defaultOptionValue",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedOptionValueArr: undefined,
    };
  }

  getPageView() {
    const options = _.isArray(this.props.options) ? this.props.options : [];
    const values: string[] = this.props.selectedOptionValues;

    return (
      <MultiSelectComponent
        disabled={this.props.isDisabled ?? false}
        onChange={this.onOptionChange}
        options={options}
        placeholder={this.props.placeholderText ?? "Select a value"}
        value={values}
      />
    );
  }

  onOptionChange = (value: DefaultValueType) => {
    this.props.updateWidgetMetaProperty("selectedOptionValueArr", value, {
      triggerPropertyName: "onOptionChange",
      dynamicString: this.props.onOptionChange,
      event: {
        type: EventType.ON_OPTION_CHANGE,
      },
    });
  };

  getWidgetType(): WidgetType {
    return "MULTI_SELECT_WIDGET";
  }
}

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface MultiSelectWidgetProps extends WidgetProps, WithMeta {
  placeholderText?: string;
  selectedIndex?: number;
  selectedIndexArr?: number[];
  selectedOption: DropdownOption;
  options?: DropdownOption[];
  onOptionChange: string;
  defaultOptionValue: string | string[];
  isRequired: boolean;
  selectedOptionValueArr: string[];
  selectedOptionValues: string[];
  selectedOptionLabels: string[];
}

export default MultiSelectWidget;
export const ProfiledMultiSelectWidget = Sentry.withProfiler(
  withMeta(MultiSelectWidget),
);