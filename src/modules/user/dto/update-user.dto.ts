export class UpdateUserDto {
  constructor(name?: string) {
    this.name = name;
  }

  name?: string;
}
