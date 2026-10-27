import { FormlyFieldConfig } from '@ngx-formly/core';

export interface WizardStep {
  label: string;
  fields: FormlyFieldConfig[];
}

export interface WizardConfig {
  title: string;
  steps: WizardStep[];
}

export interface WizardManifest {
  title: string;
  steps: string[];
}
