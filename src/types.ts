export interface Page {
  name: string;
  cht: string;
  en: string;
}

export interface PageParameter {
  GUID: string;
  page_name: string;
  cht: string;
  name: string;
  value_type: 'checkbox' | 'checkbox_group' | 'radio' | 'time';
  option_str: string;
  value_db: string;
  value: string | boolean | CheckboxGroupValue[];
  option?: string[];
}

export interface CheckboxGroupValue {
  cht: string;
  name: string;
  value: string;
}

export interface APIResponse {
  Data: PageParameter[];
  Code: number;
  Method: string;
  Result: string;
  Value: string;
  ValueAry: string[];
  TimeTaken: string;
}