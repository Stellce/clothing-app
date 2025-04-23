export interface DialogData {
  title: string;
  description?: string;
  inputs?: Input[];
  note?: string;
  selects?: Select[];
  buttonName?: string;
  isLoading?: boolean;
}

export interface Control {
  name: string;
  defaultValue?: string;
  allowEmpty?: boolean;
}

export interface Select extends Control{
  values: string[];
}
export interface Input extends Control{}
