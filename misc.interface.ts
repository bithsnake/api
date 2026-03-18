export interface FakerInterface {
  name: {
    firstName: () => string;
    lastName: () => string;
    fullName: () => string;
  };
  internet: {
    email: (firstName: string, lastName: string) => string;
  };
  date: {
    future: () => Date;
  };
}
