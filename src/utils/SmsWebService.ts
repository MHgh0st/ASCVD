import { Smsir } from "sms-typescript/lib";

const SmsWebService = new Smsir(
  process.env.SMSIR_API_KEY as string,
  Number(process.env.SMSIR_LINE_NUMBER)
);

export default SmsWebService;
