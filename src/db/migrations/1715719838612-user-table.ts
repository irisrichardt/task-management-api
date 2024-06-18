import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1715719838612 implements MigrationInterface {
    // eslint-disable-next-line prettier/prettier
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user" (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                username varchar(256) NOT NULL,
                password_hash varchar(256) NOT NULL,
                name varchar(256) NOT NULL,
                birth_date date NOT NULL,
                gender varchar(6) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
                email varchar(256) NOT NULL,
                CONSTRAINT user_pk_id PRIMARY KEY (id),
                CONSTRAINT user_un_username UNIQUE (username),
                CONSTRAINT user_un_email UNIQUE (email)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
    }
}
