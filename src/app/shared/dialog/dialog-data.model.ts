export interface DialogData {
  title: string;
  description?: string;
  inputs?: Input[];
  note?: string;
  selects?: Select[];
  buttonName?: string;
  isLoading?: boolean;
}

export interface Select {
  name: string;
  values: string[];
  defaultValue?: string;
}

export interface Input {
  name: string;
  defaultValue?: string;
}
