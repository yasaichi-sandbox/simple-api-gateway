export class FindUserResponseDto {
  constructor(
    public id: number,
    public username: string,
    public latestPosts: { id: number; title: string }[],
  ) {}
}
