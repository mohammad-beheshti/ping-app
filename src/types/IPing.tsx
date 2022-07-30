export default interface IPing {
  sequence: number;
  ip: string;
  port: number;
  waitInMs: number;
}