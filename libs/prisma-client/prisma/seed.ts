import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopnick.vn' },
    update: {},
    create: {
      email: 'admin@shopnick.vn',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
      phone: '0123456789',
    },
  });
  console.log('Admin created:', admin.email);

  // Create sample games
  const lienQuan = await prisma.game.upsert({
    where: { slug: 'lien-quan-mobile' },
    update: {},
    create: {
      name: 'Liên Quân Mobile',
      slug: 'lien-quan-mobile',
      description: 'MOBA 5v5 hàng đầu Việt Nam',
      attributes: {
        create: [
          { name: 'Rank', type: 'SELECT', options: ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Tinh Anh', 'Cao Thủ', 'Thách Đấu'] },
          { name: 'Số tướng', type: 'NUMBER' },
          { name: 'Số skin', type: 'NUMBER' },
          { name: 'Level', type: 'NUMBER' },
        ],
      },
    },
  });

  const freefire = await prisma.game.upsert({
    where: { slug: 'free-fire' },
    update: {},
    create: {
      name: 'Free Fire',
      slug: 'free-fire',
      description: 'Game battle royale mobile phổ biến nhất',
      attributes: {
        create: [
          { name: 'Rank', type: 'SELECT', options: ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Kim Cương', 'Anh Hùng', 'Thách Đấu'] },
          { name: 'Level', type: 'NUMBER' },
          { name: 'Số nhân vật', type: 'NUMBER' },
        ],
      },
    },
  });

  const genshin = await prisma.game.upsert({
    where: { slug: 'genshin-impact' },
    update: {},
    create: {
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      description: 'Game nhập vai thế giới mở anime',
      attributes: {
        create: [
          { name: 'AR Level', type: 'NUMBER' },
          { name: 'Số nhân vật 5*', type: 'NUMBER' },
          { name: 'Server', type: 'SELECT', options: ['Asia', 'America', 'Europe', 'TW/HK/MO'] },
        ],
      },
    },
  });

  await prisma.game.upsert({
    where: { slug: 'crossfire' },
    update: {},
    create: {
      name: 'CrossFire (Đột Kích)',
      slug: 'crossfire',
      description: 'Bắn súng FPS kinh điển',
      attributes: {
        create: [
          { name: 'Rank', type: 'SELECT', options: ['Đồng', 'Bạc', 'Vàng', 'Đại tá', 'Tướng'] },
          { name: 'KD', type: 'NUMBER' },
          { name: 'Số súng VIP', type: 'NUMBER' },
        ],
      },
    },
  });

  await prisma.game.upsert({
    where: { slug: 'pubg-mobile' },
    update: {},
    create: {
      name: 'PUBG Mobile',
      slug: 'pubg-mobile',
      description: 'Battle royale 100 người',
      attributes: {
        create: [
          { name: 'Rank', type: 'SELECT', options: ['Đồng', 'Bạc', 'Vàng', 'Bạch Kim', 'Vương Giả', 'Crown', 'Ace'] },
          { name: 'Level', type: 'NUMBER' },
          { name: 'Skin súng hiếm', type: 'TEXT' },
        ],
      },
    },
  });

  await prisma.game.upsert({
    where: { slug: 'valorant' },
    update: {},
    create: {
      name: 'Valorant',
      slug: 'valorant',
      description: 'FPS chiến thuật 5v5 Riot',
      attributes: {
        create: [
          { name: 'Rank', type: 'SELECT', options: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'] },
          { name: 'Số Agent', type: 'NUMBER' },
          { name: 'Skin đặc biệt', type: 'TEXT' },
        ],
      },
    },
  });

  // Create sample accounts
  const sampleAccounts = [
    { code: 'LQ-001', gameId: lienQuan.id, title: 'Acc Liên Quân VIP - 100 tướng', price: 500000, attributes: { Rank: 'Kim Cương', 'Số tướng': 100, 'Số skin': 50, Level: 30 }, loginInfo: 'user: lq001 | pass: demo123' },
    { code: 'LQ-002', gameId: lienQuan.id, title: 'Acc Liên Quân Thách Đấu', price: 2000000, attributes: { Rank: 'Thách Đấu', 'Số tướng': 113, 'Số skin': 200, Level: 30 }, loginInfo: 'user: lq002 | pass: demo123' },
    { code: 'LQ-003', gameId: lienQuan.id, title: 'Acc Liên Quân giá rẻ', price: 100000, attributes: { Rank: 'Vàng', 'Số tướng': 40, 'Số skin': 10, Level: 20 }, loginInfo: 'user: lq003 | pass: demo123' },
    { code: 'FF-001', gameId: freefire.id, title: 'Acc Free Fire full nhân vật', price: 800000, attributes: { Rank: 'Kim Cương', Level: 60, 'Số nhân vật': 20 }, loginInfo: 'user: ff001 | pass: demo123' },
    { code: 'FF-002', gameId: freefire.id, title: 'Acc Free Fire có Alok', price: 300000, attributes: { Rank: 'Vàng', Level: 40, 'Số nhân vật': 8 }, loginInfo: 'user: ff002 | pass: demo123' },
    { code: 'GI-001', gameId: genshin.id, title: 'Acc Genshin AR 60 nhiều 5*', price: 3000000, attributes: { 'AR Level': 60, 'Số nhân vật 5*': 15, Server: 'Asia' }, loginInfo: 'user: gi001 | pass: demo123' },
    { code: 'GI-002', gameId: genshin.id, title: 'Acc Genshin starter 5* tốt', price: 500000, attributes: { 'AR Level': 45, 'Số nhân vật 5*': 5, Server: 'Asia' }, loginInfo: 'user: gi002 | pass: demo123' },
  ];

  for (const acc of sampleAccounts) {
    await prisma.gameAccount.upsert({
      where: { code: acc.code },
      update: {},
      create: { ...acc, images: [] },
    });
  }

  console.log('Seed completed: 6 games, 7 accounts');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
