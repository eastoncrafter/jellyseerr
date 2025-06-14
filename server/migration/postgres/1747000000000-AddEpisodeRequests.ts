import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEpisodeRequests1747000000000 implements MigrationInterface {
  name = 'AddEpisodeRequests1747000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "episode_request" ("id" SERIAL NOT NULL, "seasonNumber" integer NOT NULL, "episodeNumber" integer NOT NULL, "status" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "requestId" integer, CONSTRAINT "PK_episode_request_id" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "episode_request" ADD CONSTRAINT "FK_episode_request_request" FOREIGN KEY ("requestId") REFERENCES "media_request"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode_request" DROP CONSTRAINT "FK_episode_request_request"`
    );
    await queryRunner.query(`DROP TABLE "episode_request"`);
  }
}
