-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('Fixed', 'Variable', 'Income', 'Investiment', 'DividendReturn');

-- CreateEnum
CREATE TYPE "TipoMovimento" AS ENUM ('Input', 'Output');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER,
    "session_id" INTEGER,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "str_hashedPassword" TEXT,
    "str_profile_picture" TEXT,
    "dtm_createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updateAt" TIMESTAMP(3) NOT NULL,
    "bool_active" BOOLEAN,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verificationtokens_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "dtm_createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updateAt" TIMESTAMP(3) NOT NULL,
    "bool_active" BOOLEAN,
    "type" TEXT,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expiresAt" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider","provider_account_id")
);

-- CreateTable
CREATE TABLE "Transacao" (
    "transaction_id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "str_category_id" INTEGER NOT NULL,
    "str_name" TEXT NOT NULL,
    "dbl_valor" DOUBLE PRECISION NOT NULL,
    "str_transactionType" TEXT NOT NULL,
    "str_movimentType" TEXT NOT NULL,
    "str_description" TEXT,
    "bool_installment" BOOLEAN,
    "int_installmentCount" INTEGER,
    "dtm_currentInstallmentDate" TIMESTAMP(3),
    "str_paymentForm" TEXT NOT NULL,
    "str_card_id" INTEGER NOT NULL,
    "str_status" TEXT NOT NULL,
    "dtm_data" TIMESTAMP(3) NOT NULL,
    "str_brokerName" TEXT,
    "str_investimentType" TEXT,
    "dtm_createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updateAt" TIMESTAMP(3) NOT NULL,
    "bool_active" BOOLEAN NOT NULL,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "category_id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "str_categoryName" TEXT NOT NULL,
    "str_movimentType" TEXT NOT NULL,
    "bool_hasBudgetLimit" BOOLEAN NOT NULL,
    "dbl_budgetLimit" DOUBLE PRECISION,
    "str_image" TEXT NOT NULL,
    "dtm_createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updateAt" TIMESTAMP(3) NOT NULL,
    "bool_active" BOOLEAN NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Cartao" (
    "card_id" SERIAL NOT NULL,
    "str_transaction_id" INTEGER NOT NULL,
    "str_bank_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "dbl_creditLimit" DOUBLE PRECISION NOT NULL,
    "dtm_dueDate" TIMESTAMP(3) NOT NULL,
    "str_lastNumbers" TEXT NOT NULL,
    "dtm_createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updateAt" TIMESTAMP(3) NOT NULL,
    "bool_active" BOOLEAN NOT NULL,

    CONSTRAINT "Cartao_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "Banco" (
    "bank_id" SERIAL NOT NULL,
    "str_card_id" INTEGER NOT NULL,
    "str_bankName" TEXT NOT NULL,
    "str_image" TEXT,
    "dtm_createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updateAt" TIMESTAMP(3) NOT NULL,
    "bool_active" BOOLEAN NOT NULL,

    CONSTRAINT "Banco_pkey" PRIMARY KEY ("bank_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_id_key" ON "accounts"("account_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
