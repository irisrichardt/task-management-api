export class TeamDto {
  id: string;
  name: string;
  // eslint-disable-next-line prettier/prettier
  members?: { id: string; username: string }[];
}

export class TeamRouteParameters {
  id: string;
}
