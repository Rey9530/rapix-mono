import { Component } from '@angular/core';

import { AutoSizeTextarea } from './auto-size-textarea/auto-size-textarea';
import { BasicFloatingInputControl } from './basic-floating-input-control/basic-floating-input-control';
import { BasicForm } from './basic-form/basic-form';
import { BasicHtmlInputControl } from './basic-html-input-control/basic-html-input-control';
import { DynamicFormField } from './dynamic-form-field/dynamic-form-field';
import { EdgesInputStyle } from './edges-input-style/edges-input-style';
import { FileInput } from './file-input/file-input';
import { FlatInputStyle } from './flat-input-style/flat-input-style';
import { FloatingForm } from './floating-form/floating-form';
import { FormControlSizing } from './form-control-sizing/form-control-sizing';
import { MaxLengthElements } from './max-length-elements/max-length-elements';
import { RaiseInputStyle } from './raise-input-style/raise-input-style';
import { SelectSizing } from './select-sizing/select-sizing';

@Component({
  selector: 'app-base-input',
  imports: [
    BasicForm,
    FloatingForm,
    SelectSizing,
    FormControlSizing,
    FileInput,
    FlatInputStyle,
    BasicHtmlInputControl,
    BasicFloatingInputControl,
    EdgesInputStyle,
    RaiseInputStyle,
    DynamicFormField,
    AutoSizeTextarea,
    MaxLengthElements,
  ],
  templateUrl: './base-input.html',
  styleUrl: './base-input.scss',
})
export class BaseInput {}
