export namespace Events {
  export interface Data<T> {
    type: string;
    data?: T;
  }
}
