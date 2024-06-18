import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeamTable1718556383480 implements MigrationInterface {
    // eslint-disable-next-line prettier/prettier
    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "teams" (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        name varchar(256) NOT NULL,
        CONSTRAINT teams_pk_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "team_members" (
        team_id uuid NOT NULL,
        user_id uuid NOT NULL,
        CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES "teams"(id) ON DELETE CASCADE,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "team_members";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "teams";`);
  }
}
