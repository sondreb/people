export interface Contact {
  id?: number;
  name: string;
  company?: string;
  emails?: string[];
  phones?: string[];
  imageUrl?: string;
  birthday?: Date;
}
