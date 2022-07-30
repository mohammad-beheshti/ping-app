import * as Yup from 'yup';
import IPing from '../types/IPing';

const validationSchema = Yup.array(
  Yup.object().shape({
    sequence: Yup.number().required(),
    ip: Yup.string()
      .required('IP is required')
      .matches(
        /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
        'IP is invalid',
      ),
    port: Yup.number()
      .required('Port is required')
      .min(1, 'Port is invalid')
      .max(65535, 'Port is invalid'),
    waitInMs: Yup.number(),
  }),
);

export function parseCSV(file: File): Promise<IPing[]> {
  const reader = new FileReader();
  reader.readAsText(file);
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const csv = reader.result;
      const lines = (csv as string).split('\n');
      const headers = lines[0].split(',');
      const data = lines
        .slice(1)
        .filter(Boolean)
        .map((line) => {
          const obj = {} as Record<string, string>;
          const currentLine = line.split(',');
          headers.forEach((header, index) => {
            obj[header.trim()] = currentLine[index]?.trim();
          });
          return obj;
        });
      try {
        validationSchema.validateSync(data);
      } catch (e) {
        return reject(e);
      }
      const castedData = validationSchema.cast(data)! as IPing[];
      return resolve(castedData);
    };
    reader.onerror = (error) => {
      return reject(error);
    };
  });
}