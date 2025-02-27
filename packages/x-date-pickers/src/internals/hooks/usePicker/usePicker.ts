import { UsePickerParams, UsePickerProps, UsePickerResponse } from './usePicker.types';
import { usePickerValue } from './usePickerValue';
import { usePickerViews } from './usePickerViews';
import { usePickerLayoutProps } from './usePickerLayoutProps';
import { InferError } from '../useValidation';
import { buildWarning } from '../../utils/warning';
import { FieldSection } from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../../models';

const warnRenderInputIsDefined = buildWarning([
  'The `renderInput` prop has been removed in version 6.0 of the Date and Time Pickers.',
  'You can replace it with the `textField` component slot in most cases.',
  'For more information, please have a look at the migration guide (https://mui.com/x/migration/migration-pickers-v5/#input-renderer-required-in-v5).',
]);

export const usePicker = <
  TValue,
  TDate,
  TView extends DateOrTimeViewWithMeridiem,
  TSection extends FieldSection,
  TExternalProps extends UsePickerProps<TValue, TView, TSection, any, any, any>,
  TAdditionalProps extends {},
>({
  props,
  valueManager,
  valueType,
  wrapperVariant,
  inputRef,
  additionalViewProps,
  validator,
  autoFocusView,
}: UsePickerParams<
  TValue,
  TDate,
  TView,
  TSection,
  TExternalProps,
  TAdditionalProps
>): UsePickerResponse<TValue, TView, TSection, InferError<TExternalProps>> => {
  if (process.env.NODE_ENV !== 'production') {
    if ((props as any).renderInput != null) {
      warnRenderInputIsDefined();
    }
  }
  const pickerValueResponse = usePickerValue({
    props,
    valueManager,
    valueType,
    wrapperVariant,
    validator,
  });

  const pickerViewsResponse = usePickerViews<TValue, TView, TExternalProps, TAdditionalProps>({
    props,
    inputRef,
    additionalViewProps,
    autoFocusView,
    propsFromPickerValue: pickerValueResponse.viewProps,
  });

  const pickerLayoutResponse = usePickerLayoutProps({
    props,
    wrapperVariant,
    propsFromPickerValue: pickerValueResponse.layoutProps,
    propsFromPickerViews: pickerViewsResponse.layoutProps,
  });

  return {
    // Picker value
    open: pickerValueResponse.open,
    actions: pickerValueResponse.actions,
    fieldProps: pickerValueResponse.fieldProps,

    // Picker views
    renderCurrentView: pickerViewsResponse.renderCurrentView,
    hasUIView: pickerViewsResponse.hasUIView,
    shouldRestoreFocus: pickerViewsResponse.shouldRestoreFocus,

    // Picker layout
    layoutProps: pickerLayoutResponse.layoutProps,
  };
};
