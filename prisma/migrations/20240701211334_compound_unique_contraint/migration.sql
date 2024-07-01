/*
  Warnings:

  - A unique constraint covering the columns `[id,belongsToId]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Article_id_belongsToId_key" ON "Article"("id", "belongsToId");
