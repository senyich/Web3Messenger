<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250728083201 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE message (id SERIAL NOT NULL, cid VARCHAR(350) NOT NULL, timestamp DATE NOT NULL, sender_address VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE "user" (id SERIAL NOT NULL, user_name VARCHAR(50) NOT NULL, address VARCHAR(50) NOT NULL, password_hash VARCHAR(350) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64924A232CF ON "user" (user_name)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649D4E6F81 ON "user" (address)');
        $this->addSql('CREATE TABLE wallet (id SERIAL NOT NULL, user_id INT NOT NULL, wallet_adress VARCHAR(255) NOT NULL, public_key VARCHAR(255) NOT NULL, balance NUMERIC(10, 0) NOT NULL, PRIMARY KEY(id))');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE wallet');
    }
}
