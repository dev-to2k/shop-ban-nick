import Link from 'next/link';
import {
  Gamepad2,
  ShieldCheck,
  Zap,
  Search,
  CreditCard,
  KeyRound,
  ArrowRight,
  Star,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  BannerSlider,
  HomeHero,
  HomeFaq,
  FeaturedProductsCarousel,
  DealProductsCarousel,
  FirstGameCarousel,
  PurchaseMarquee,
  GamesList,
  getGamesServer,
} from '@shop-ban-nick/shared-web';

const HOW_IT_WORKS = [
  { icon: Search, title: 'Chọn game', desc: 'Vào danh sách game, chọn game bạn muốn mua acc.' },
  { icon: Gamepad2, title: 'Chọn acc', desc: 'Xem chi tiết từng acc, so sánh giá và thông tin rồi thêm vào giỏ.' },
  { icon: CreditCard, title: 'Thanh toán', desc: 'Thanh toán qua ngân hàng hoặc ví. Gửi chứng từ nếu cần.' },
  { icon: KeyRound, title: 'Nhận thông tin', desc: 'Sau khi xác nhận, bạn nhận thông tin đăng nhập acc ngay.' },
];

const FAQ_ITEMS = [
  { q: 'Giao dịch có an toàn không?', a: 'Chúng tôi xác thực thanh toán trước khi giao acc. Bảo hành hoàn tiền trong 24h nếu acc lỗi.' },
  { q: 'Nhận acc sau bao lâu?', a: 'Thông tin đăng nhập được gửi ngay sau khi thanh toán được xác nhận, thường trong vài phút đến 1 giờ.' },
  { q: 'Hoàn tiền thế nào?', a: 'Nếu acc không đăng nhập được hoặc sai mô tả, bạn báo trong 24h để được hoàn tiền 100%.' },
  { q: 'Có thể đổi acc khác không?', a: 'Trong 24h nếu acc lỗi bạn có thể yêu cầu đổi acc cùng game (nếu còn) hoặc hoàn tiền.' },
  { q: 'Hỗ trợ 24/7?', a: 'Bạn có thể nhắn Zalo hoặc Facebook để được hỗ trợ nhanh. Xem số liên hệ ở footer hoặc nút Zalo góc phải màn hình.' },
];

export default async function HomePage() {
  const games = await getGamesServer();
  const totalAcc = games.reduce((s, g) => s + (g._count?.accounts ?? 0), 0);
  const accLabel = totalAcc > 0 ? `${totalAcc.toLocaleString('vi-VN')}+ acc đang bán` : 'Hàng ngàn acc đang bán';

  return (
    <div>
      <section aria-label="Banner quảng báo">
        <BannerSlider />
      </section>

      <HomeHero accLabel={accLabel} />

      <section className="py-16 container-narrow" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          Vì sao chọn chúng tôi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: Zap, title: 'Giao dịch tức thì', desc: 'Nhận acc ngay sau khi thanh toán được xác nhận' },
            { icon: ShieldCheck, title: 'Bảo hành uy tín', desc: 'Cam kết hoàn tiền nếu acc lỗi trong 24h' },
            { icon: Gamepad2, title: 'Đa dạng game', desc: 'Liên Quân, Free Fire, PUBG, Genshin và nhiều hơn' },
          ].map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <f.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12 container-narrow bg-section-alt rounded-xl" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-fluid-section font-bold text-center mb-8">
          Khách hàng nói gì
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-4xl mx-auto">
          {[
            { name: 'Minh T.', text: 'Mua acc Liên Quân, nhận thông tin đăng nhập trong 10 phút. Acc đúng mô tả, rất hài lòng.', stars: 5 },
            { name: 'Thu H.', text: 'Lần đầu mua acc game online, hơi lo nhưng shop hỗ trợ nhiệt tình. Giao dịch nhanh.', stars: 5 },
            { name: 'Hoàng N.', text: 'Acc Free Fire giá tốt, bảo hành rõ ràng. Sẽ ủng hộ lâu dài.', stars: 5 },
          ].map((r) => (
            <Card key={r.name} className="flex flex-col h-full">
              <CardContent className="flex flex-col flex-1 p-4 min-h-0">
                <div className="border-l-2 border-primary/30 pl-3 flex-1 min-h-0">
                  <p className="text-sm text-muted-foreground italic line-clamp-3 sm:line-clamp-4">&ldquo;{r.text}&rdquo;</p>
                </div>
                <div className="flex flex-row items-center gap-2 mt-3 shrink-0">
                  <div className="flex gap-0.5 text-amber-500" aria-hidden>
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium tracking-wide">&mdash; {r.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FeaturedProductsCarousel sectionVariant="white" />
      <DealProductsCarousel sectionVariant="slate" />
      <FirstGameCarousel sectionVariant="white" />

      <section aria-label="Giao dịch gần đây">
        <PurchaseMarquee sectionVariant="slate" />
      </section>

      <GamesList variant="preview" sectionVariant="white" />

      <section className="py-16 container-narrow" aria-labelledby="how-it-works-heading">
        <h2 id="how-it-works-heading" className="text-fluid-section font-bold text-center mb-10">
          Cách mua hàng
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border" aria-hidden />
              )}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mb-4 relative">
                <step.icon className="h-8 w-8" />
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold" aria-hidden>{i + 1}</span>
              </div>
              <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/games">
            <Button variant="outline" size="lg">Bắt đầu mua ngay</Button>
          </Link>
        </div>
      </section>

      <section className="py-16 bg-section-alt" aria-labelledby="faq-heading">
        <div className="container-narrow">
          <h2 id="faq-heading" className="text-fluid-section font-bold text-center mb-8">
            Câu hỏi thường gặp
          </h2>
          <HomeFaq items={FAQ_ITEMS} />
        </div>
      </section>

      <section className="py-16 container-narrow text-center" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="sr-only">
          Xem tất cả game
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          Khám phá hàng ngàn acc game chất lượng, giá tốt.
        </p>
        <Link href="/games">
          <Button size="lg">
            Xem tất cả game <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
