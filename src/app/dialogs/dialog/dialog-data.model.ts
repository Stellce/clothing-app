export interface DialogData {
  title: string;
  description?: string;
  inputs?: Input[];
  note?: string;
  selects?: Select[];
  buttonName?: string;
  isLoading?: boolean;
}

interface Select {
  name: string;
  values: string[];
  defaultValue?: string;
}

interface Input {
  name: string;
  defaultValue?: string;
}
