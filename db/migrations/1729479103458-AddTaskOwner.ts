import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskOwner1729479103458 implements MigrationInterface {
    name = 'AddTaskOwner1729479103458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`ownerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_a132ba8200c3abdc271d4a701d8\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_a132ba8200c3abdc271d4a701d8\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`ownerId\``);
    }

}
