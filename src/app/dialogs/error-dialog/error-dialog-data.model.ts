import {DialogData} from "../dialog/dialog-data.model";

export interface ErrorDialogData extends DialogData{
  errorCode: string;
}
