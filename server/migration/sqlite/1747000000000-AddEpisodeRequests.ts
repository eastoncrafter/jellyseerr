import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEpisodeRequests1747000000000 implements MigrationInterface {
  name = 'AddEpisodeRequests1747000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "episode_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "seasonNumber" integer NOT NULL, "episodeNumber" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "requestId" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_episode_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "seasonNumber" integer NOT NULL, "episodeNumber" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "requestId" integer, CONSTRAINT "FK_episode_request_request" FOREIGN KEY ("requestId") REFERENCES "media_request" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_episode_request"("id", "seasonNumber", "episodeNumber", "status", "createdAt", "updatedAt", "requestId") SELECT "id", "seasonNumber", "episodeNumber", "status", "createdAt", "updatedAt", "requestId" FROM "episode_request"`
    );
    await queryRunner.query(`DROP TABLE "episode_request"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_episode_request" RENAME TO "episode_request"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episode_request" RENAME TO "temporary_episode_request"`
    );
    await queryRunner.query(
      `CREATE TABLE "episode_request" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "seasonNumber" integer NOT NULL, "episodeNumber" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "requestId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "episode_request"("id", "seasonNumber", "episodeNumber", "status", "createdAt", "updatedAt", "requestId") SELECT "id", "seasonNumber", "episodeNumber", "status", "createdAt", "updatedAt", "requestId" FROM "temporary_episode_request"`
    );
    await queryRunner.query(`DROP TABLE "temporary_episode_request"`);
  }
}
