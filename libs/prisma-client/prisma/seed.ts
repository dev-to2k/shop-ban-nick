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

  const crossfire = await prisma.game.upsert({
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

  const pubg = await prisma.game.upsert({
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

  const valorant = await prisma.game.upsert({
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

  const sampleAccounts = [
    { code: 'LQ-001', gameId: lienQuan.id, title: 'Acc Liên Quân VIP - 100 tướng', price: 500000, attributes: { Rank: 'Kim Cương', 'Số tướng': 100, 'Số skin': 50, Level: 30 }, loginInfo: 'user: lq001 | pass: demo123' },
    { code: 'LQ-002', gameId: lienQuan.id, title: 'Acc Liên Quân Thách Đấu', price: 2000000, attributes: { Rank: 'Thách Đấu', 'Số tướng': 113, 'Số skin': 200, Level: 30 }, loginInfo: 'user: lq002 | pass: demo123' },
    { code: 'LQ-003', gameId: lienQuan.id, title: 'Acc Liên Quân giá rẻ', price: 100000, attributes: { Rank: 'Vàng', 'Số tướng': 40, 'Số skin': 10, Level: 20 }, loginInfo: 'user: lq003 | pass: demo123' },
    { code: 'LQ-004', gameId: lienQuan.id, title: 'Acc Liên Quân Bạch Kim', price: 350000, attributes: { Rank: 'Bạch Kim', 'Số tướng': 80, 'Số skin': 30, Level: 28 }, loginInfo: 'user: lq004 | pass: demo123' },
    { code: 'FF-001', gameId: freefire.id, title: 'Acc Free Fire full nhân vật', price: 800000, attributes: { Rank: 'Kim Cương', Level: 60, 'Số nhân vật': 20 }, loginInfo: 'user: ff001 | pass: demo123' },
    { code: 'FF-002', gameId: freefire.id, title: 'Acc Free Fire có Alok', price: 300000, attributes: { Rank: 'Vàng', Level: 40, 'Số nhân vật': 8 }, loginInfo: 'user: ff002 | pass: demo123' },
    { code: 'FF-003', gameId: freefire.id, title: 'Acc Free Fire Thách Đấu', price: 1500000, attributes: { Rank: 'Thách Đấu', Level: 70, 'Số nhân vật': 25 }, loginInfo: 'user: ff003 | pass: demo123' },
    { code: 'FF-004', gameId: freefire.id, title: 'Acc Free Fire starter', price: 150000, attributes: { Rank: 'Đồng', Level: 25, 'Số nhân vật': 5 }, loginInfo: 'user: ff004 | pass: demo123' },
    { code: 'GI-001', gameId: genshin.id, title: 'Acc Genshin AR 60 nhiều 5*', price: 3000000, attributes: { 'AR Level': 60, 'Số nhân vật 5*': 15, Server: 'Asia' }, loginInfo: 'user: gi001 | pass: demo123' },
    { code: 'GI-002', gameId: genshin.id, title: 'Acc Genshin starter 5* tốt', price: 500000, attributes: { 'AR Level': 45, 'Số nhân vật 5*': 5, Server: 'Asia' }, loginInfo: 'user: gi002 | pass: demo123' },
    { code: 'GI-003', gameId: genshin.id, title: 'Acc Genshin AR 55', price: 1200000, attributes: { 'AR Level': 55, 'Số nhân vật 5*': 10, Server: 'Asia' }, loginInfo: 'user: gi003 | pass: demo123' },
    { code: 'GI-004', gameId: genshin.id, title: 'Acc Genshin AR 50', price: 800000, attributes: { 'AR Level': 50, 'Số nhân vật 5*': 7, Server: 'Asia' }, loginInfo: 'user: gi004 | pass: demo123' },
    { code: 'CF-001', gameId: crossfire.id, title: 'Acc CF VIP full súng', price: 600000, attributes: { Rank: 'Đại tá', KD: 1.8, 'Số súng VIP': 15 }, loginInfo: 'user: cf001 | pass: demo123' },
    { code: 'CF-002', gameId: crossfire.id, title: 'Acc CF giá rẻ', price: 200000, attributes: { Rank: 'Vàng', KD: 1.2, 'Số súng VIP': 3 }, loginInfo: 'user: cf002 | pass: demo123' },
    { code: 'CF-003', gameId: crossfire.id, title: 'Acc CF Tướng', price: 1200000, attributes: { Rank: 'Tướng', KD: 2.0, 'Số súng VIP': 25 }, loginInfo: 'user: cf003 | pass: demo123' },
    { code: 'CF-004', gameId: crossfire.id, title: 'Acc CF Bạc', price: 150000, attributes: { Rank: 'Bạc', KD: 1.0, 'Số súng VIP': 1 }, loginInfo: 'user: cf004 | pass: demo123' },
    { code: 'PUBG-001', gameId: pubg.id, title: 'Acc PUBG Vương Giả', price: 900000, attributes: { Rank: 'Vương Giả', Level: 70, 'Skin súng hiếm': 'M416 Glacier' }, loginInfo: 'user: pubg001 | pass: demo123' },
    { code: 'PUBG-002', gameId: pubg.id, title: 'Acc PUBG Crown', price: 600000, attributes: { Rank: 'Crown', Level: 55, 'Skin súng hiếm': 'AKM' }, loginInfo: 'user: pubg002 | pass: demo123' },
    { code: 'PUBG-003', gameId: pubg.id, title: 'Acc PUBG Ace', price: 1500000, attributes: { Rank: 'Ace', Level: 75, 'Skin súng hiếm': 'Full set' }, loginInfo: 'user: pubg003 | pass: demo123' },
    { code: 'PUBG-004', gameId: pubg.id, title: 'Acc PUBG giá rẻ', price: 250000, attributes: { Rank: 'Bạch Kim', Level: 40, 'Skin súng hiếm': '' }, loginInfo: 'user: pubg004 | pass: demo123' },
    { code: 'VAL-001', gameId: valorant.id, title: 'Acc Valorant Immortal', price: 2000000, attributes: { Rank: 'Immortal', 'Số Agent': 18, 'Skin đặc biệt': 'Vandal' }, loginInfo: 'user: val001 | pass: demo123' },
    { code: 'VAL-002', gameId: valorant.id, title: 'Acc Valorant Diamond', price: 800000, attributes: { Rank: 'Diamond', 'Số Agent': 15, 'Skin đặc biệt': 'Phantom' }, loginInfo: 'user: val002 | pass: demo123' },
    { code: 'VAL-003', gameId: valorant.id, title: 'Acc Valorant Gold', price: 350000, attributes: { Rank: 'Gold', 'Số Agent': 12, 'Skin đặc biệt': '' }, loginInfo: 'user: val003 | pass: demo123' },
    { code: 'VAL-004', gameId: valorant.id, title: 'Acc Valorant Radiant', price: 3500000, attributes: { Rank: 'Radiant', 'Số Agent': 20, 'Skin đặc biệt': 'Full' }, loginInfo: 'user: val004 | pass: demo123' },
  ];

  for (const acc of sampleAccounts) {
    await prisma.gameAccount.upsert({
      where: { code: acc.code },
      update: {},
      create: { ...acc, images: [] },
    });
  }

  const seedBannerId = 'seed-banner';
  const bannerRows = [
    { sortOrder: 0, image: 'banner-promo.png', title: 'Khuyến mãi', subtitle: 'Acc hot tuần này – Giá tốt nhất, giao ngay', href: '/games', gradient: 'from-black/30 via-transparent to-transparent', promo: true },
    { sortOrder: 1, image: 'banner-lien-quan-mobile.png', title: 'Liên Quân Mobile', subtitle: 'Acc VIP giá rẻ - Full tướng, full skin', href: '/games/lien-quan-mobile', gradient: 'from-blue-900/90 via-blue-900/50 to-transparent', promo: false },
    { sortOrder: 2, image: 'banner-free-fire.png', title: 'Free Fire', subtitle: 'Acc Thách Đấu - Full nhân vật VIP', href: '/games/free-fire', gradient: 'from-orange-900/90 via-orange-900/50 to-transparent', promo: false },
    { sortOrder: 3, image: 'banner-crossfire.png', title: 'CrossFire (Đột Kích)', subtitle: 'Acc VIP full súng - KD cao', href: '/games/crossfire', gradient: 'from-emerald-900/90 via-emerald-900/50 to-transparent', promo: false },
    { sortOrder: 4, image: 'banner-genshin-impact.png', title: 'Genshin Impact', subtitle: 'Acc AR cao - Nhiều nhân vật 5 sao', href: '/games/genshin-impact', gradient: 'from-cyan-900/90 via-cyan-900/50 to-transparent', promo: false },
    { sortOrder: 5, image: 'banner-pubg-mobile.png', title: 'PUBG Mobile', subtitle: 'Acc Vương Giả - Set skin súng hiếm', href: '/games/pubg-mobile', gradient: 'from-amber-900/90 via-amber-900/50 to-transparent', promo: false },
    { sortOrder: 6, image: 'banner-valorant.png', title: 'Valorant', subtitle: 'Acc Immortal+ full Agent & skin', href: '/games/valorant', gradient: 'from-rose-900/90 via-rose-900/50 to-transparent', promo: false },
  ];
  for (let i = 0; i < bannerRows.length; i++) {
    const row = bannerRows[i];
    await prisma.banner.upsert({
      where: { id: `${seedBannerId}-${i}` },
      update: { image: row.image, title: row.title, subtitle: row.subtitle, href: row.href, gradient: row.gradient, promo: row.promo, sortOrder: row.sortOrder },
      create: { id: `${seedBannerId}-${i}`, ...row },
    });
  }
  console.log('Banners seeded:', bannerRows.length);

  const gameCount = 6;
  const accCount = sampleAccounts.length;
  console.log(`Seed completed: ${gameCount} games, ${accCount} accounts, ${bannerRows.length} banners`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
