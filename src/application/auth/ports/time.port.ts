export interface TimePort {
  now(): Date;
  addMs(d: number): Date;
}
